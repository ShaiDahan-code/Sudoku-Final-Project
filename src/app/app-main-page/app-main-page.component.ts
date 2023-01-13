import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-main-page',
  templateUrl: './app-main-page.component.html',
  styleUrls: ['./app-main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor() { }

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
}
