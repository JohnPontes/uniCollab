import { Component, EventEmitter, HostListener, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/login.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() SideNavToggle = new EventEmitter();
  width: any

  constructor(private router: Router,
    private loginService: LoginService,
    public dialog: MatDialog) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.width = event.target.innerWidth
  }

  ngOnInit(): void {
    this.width = window.innerWidth
  }

  openSidenav() {
    this.SideNavToggle.emit();
  }


  navigateToHome() {
    this.router.navigate(['/'])
  }

  logout(): void {
    this.loginService.logout()
    localStorage.clear()
  }
}
