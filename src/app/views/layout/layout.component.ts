import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { filter } from 'rxjs';
import { LoginService } from 'src/app/auth/login.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(private router: Router,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    public dialog: MatDialog,
    private loginService: LoginService) { 
    }

    loginDisplay = false;
    displayedColumns: string[] = ['claim', 'value'];
    dataSource: any = [];
    PAGE_LAYOUT: any

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
        console.log('teste')
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims as Record<string, any>);
      })

      setTimeout(() => {
        this.router.navigate(['conteudos'])
      }, 500);
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    if (!this.loginDisplay) {
      this.loginService.login()
    }
  }

  getClaims(claims: Record<string, any>) {
    if (claims) {
      Object.entries(claims).forEach((claim: [string, unknown], index: number) => {
        this.dataSource.push({ id: index, claim: claim[0], value: claim[1] });
      });
    }
  }



}
