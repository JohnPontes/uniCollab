import { Inject, Injectable } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult, EventMessage, EventType, InteractionStatus, InteractionType, PopupRequest, RedirectRequest, SsoSilentRequest } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { IdTokenClaims, PromptValue } from '@azure/msal-common'
import { environment } from 'src/environments/environment';

type IdTokenClaimsWithPolicyId = IdTokenClaims & {
  acr?: string,
  tfp?: string,
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService) { }

  initializeLogin() {
    this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal
    this.setLoginDisplay();

    this.authService.instance.enableAccountStorageEvents();
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = "/";
        } else {
          this.setLoginDisplay();
        }
      });


    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      })

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS
          || msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
          || msg.eventType === EventType.SSO_SILENT_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {

        let payload = result.payload as AuthenticationResult;
        let idtoken = payload.idTokenClaims as IdTokenClaimsWithPolicyId;

        if (idtoken.acr === environment.b2cPolicies.names.signUpSignIn || idtoken.tfp === environment.b2cPolicies.names.signUpSignIn) {
          this.authService.instance.setActiveAccount(payload.account);
        }

        if (idtoken.acr === environment.b2cPolicies.names.editProfile || idtoken.tfp === environment.b2cPolicies.names.editProfile) {

          const originalSignInAccount = this.authService.instance.getAllAccounts()
            .find((account: AccountInfo) =>
              account.idTokenClaims?.oid === idtoken.oid
              && account.idTokenClaims?.sub === idtoken.sub
              && ((account.idTokenClaims as IdTokenClaimsWithPolicyId).acr === environment.b2cPolicies.names.signUpSignIn
                || (account.idTokenClaims as IdTokenClaimsWithPolicyId).tfp === environment.b2cPolicies.names.signUpSignIn)
            );

          let signUpSignInFlowRequest: SsoSilentRequest = {
            authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
            account: originalSignInAccount
          };
          this.authService.ssoSilent(signUpSignInFlowRequest);
        }

        if (idtoken.acr === environment.b2cPolicies.names.resetPassword || idtoken.tfp === environment.b2cPolicies.names.resetPassword) {
          let signUpSignInFlowRequest: RedirectRequest | PopupRequest = {
            authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
            scopes: [...environment.apiConfig.scopes],
            prompt: PromptValue.LOGIN // force user to reauthenticate with their new password
          };

          this.login(signUpSignInFlowRequest);
        }

        return result;
      });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_FAILURE || msg.eventType === EventType.ACQUIRE_TOKEN_FAILURE),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        if (result.error && result.error.message.indexOf('AADB2C90118') > -1) {
          let resetPasswordFlowRequest: RedirectRequest | PopupRequest = {
            authority: environment.b2cPolicies.authorities.resetPassword.authority,
            scopes: [],
          };

          this.login(resetPasswordFlowRequest);
        };
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount() {
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  login(userFlowRequest?: RedirectRequest | PopupRequest) {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({ ...this.msalGuardConfig.authRequest, ...userFlowRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService.loginPopup(userFlowRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest, ...userFlowRequest } as RedirectRequest);
      } else {
        this.authService.loginRedirect(userFlowRequest);
      }
    }
  }

  logout() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: "/"
      });
    } else {
      this.authService.logoutRedirect();
    }
  }
}
