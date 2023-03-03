import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import {MainPageComponent} from './app-main-page/app-main-page.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { SudokuComponent } from './app-main-page/sudoku/sudoku.component';
import { SudokuGameComponent } from './app-main-page/sudoku-game/sudoku-game.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { TimerComponent } from './app-main-page/timer-component/timer-component.component';
import { ImageToTextComponent } from './app-main-page/image-to-text/image-to-text.component';
import { CreditsPopUpComponent } from './app-navbar/credits-pop-up/credits-pop-up.component';
import {MatDialogModule} from "@angular/material/dialog";
import { AppFooterComponent } from './app-footer/app-footer.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AppNavbarComponent,
    SudokuComponent,
    SudokuGameComponent,
    TimerComponent,
    ImageToTextComponent,
    CreditsPopUpComponent,
    AppFooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
