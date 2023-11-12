import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { LoginService } from 'src/app/auth/login.service';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, AfterViewInit {
  @Output() closeSideNav = new EventEmitter();


  userEmail: any
  userName: any
  constructor(private authService: MsalService,
    private loginService: LoginService,
    private cd: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const account = this.authService?.instance?.getAllAccounts()
      this.userEmail = account[0]?.idTokenClaims?.['emails']?.[0]
      this.userName = account[0]?.idTokenClaims?.['given_name']
      this.cd.detectChanges();
    }, 1000);
  }

  ngOnInit(): void {}

  menu = [
    {
      route: "conteudos",
      title: "Conteúdos Acadêmico"
    }
  ]

  onToggleClose() {
    this.closeSideNav.emit();
  }

  logout(): void {
    this.loginService.logout()
    localStorage.clear()
  }

}
