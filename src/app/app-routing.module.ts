import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserUtils } from '@azure/msal-browser';
import { MsalGuard } from '@azure/msal-angular';
import { LayoutComponent } from './views/layout/layout.component';
import { ContentSharingComponent } from './views/track-token/content-sharing.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'conteudos',
        component: ContentSharingComponent,
        canActivate: [MsalGuard],
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: ''
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      // Don't perform initial navigation in iframes or popups
      initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabledNonBlocking' : 'disabled' // Set to enabledBlocking to use Angular Universal
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }