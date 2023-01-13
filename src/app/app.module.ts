import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import {MainPageComponent} from './app-main-page/app-main-page.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { SudokuComponent } from './app-main-page/sudoku/sudoku.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AppNavbarComponent,
    SudokuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
