import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  constructor(
    public router: Router,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  logout(event: MouseEvent) {
    event.preventDefault()
    this.auth.logout()
    this.router.navigate(['/admin','login'])
  }
}
