import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatRadioModule} from '@angular/material/radio';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxMaskModule } from 'ngx-mask'
import { NgxFileDragDropModule } from "ngx-file-drag-drop";
import { ToastrModule } from 'ngx-toastr';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation, LogLevel } from '@azure/msal-browser';
import { MsalGuard, MsalInterceptor, MsalBroadcastService, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalRedirectComponent } from '@azure/msal-angular';

import { environment } from 'src/environments/environment';
import { LayoutComponent } from './views/layout/layout.component';
import { ToolbarComponent } from './views/components/toolbar/toolbar.component';
import { SideNavComponent } from './views/components/side-nav/side-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocumentModalComponent } from './views/components/modals/document-modal/document-modal.component';
import { GenericModalComponent } from './views/components/modals/generic-modal/generic-modal.component';
import { DatePipe } from '@angular/common';
import { ContentSharingComponent } from './views/track-token/content-sharing.component';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export function loggerCallback(logLevel: LogLevel, message: string) {
  
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msalConfig.auth.clientId,
      authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: environment.redirectUrl,
      postLogoutRedirectUri: environment.redirectUrl,
      knownAuthorities: [environment.b2cPolicies.authorityDomain]
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      allowNativeBroker: false, // Disables WAM Broker
      loggerOptions: {
        // loggerCallback,
        logLevel: LogLevel.Verbose,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();

  protectedResourceMap.set(environment.apiConfig.uri, environment.apiConfig.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...environment.apiConfig.scopes],
    },
    loginFailedRoute: '/login-failed'
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ToolbarComponent,
    SideNavComponent,
    ContentSharingComponent,
    DocumentModalComponent,
    GenericModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule, // Animations cause delay which interfere with E2E tests
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MsalModule,
    NgbModule,
    NgxSpinnerModule,
    NgxExtendedPdfViewerModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    MatTooltipModule,
    ClipboardModule,
    MatSnackBarModule,
    MatRadioModule,
    MatSelectModule,
    MatExpansionModule,
    MatCheckboxModule,
    NgxMaskModule.forRoot(),
    NgxFileDragDropModule,
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }