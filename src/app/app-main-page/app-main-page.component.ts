import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

export enum Level{
  Easy=0,
  Medium=1,
  Hard=2
}


@Component({
  selector: 'app-main-page',
  templateUrl: './app-main-page.component.html',
  styleUrls: ['./app-main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  startNewGame() {
    // code to start a new game goes here
  }

  openSettings() {
    // code to open the settings goes here
  }

  openCredits() {
    // code to open the credits goes here
  }

  OpenGame(value : string) {
    this.router.navigate(['Sudoku/' + value]);
  }
}
