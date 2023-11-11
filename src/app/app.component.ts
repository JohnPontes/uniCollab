import { Component, OnInit } from '@angular/core';
import { LoginService } from './auth/login.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import icons from './../assets/icons.json'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'uniCollab';
  iconsArray = icons.icons

  constructor(
    private readonly loginService: LoginService,
    private readonly iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    this.iconsArray.forEach(icon => {
      this.iconRegistry.addSvgIcon(icon.icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(`assets/icons-svg/${icon.path}`));
    });
  }

  ngOnInit(): void {
    this.loginService.initializeLogin()
  }  
}

