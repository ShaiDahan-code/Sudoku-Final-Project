import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreditsPopUpComponent} from "./credits-pop-up/credits-pop-up.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent {
  constructor(private dialog: MatDialog) {
  }
  openCreditsDialog() {
    this.dialog.open(CreditsPopUpComponent,{width: '500px', height: '500px'});
  }
}
