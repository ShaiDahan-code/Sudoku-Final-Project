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
import {MatDialogModule} from "@angular/material/dialog";
import { AppFooterComponent } from './app-footer/app-footer.component';
import {MatInputModule} from "@angular/material/input";
import {BsDropdownConfig, BsDropdownModule} from "ngx-bootstrap/dropdown";
import {BsModalService, ModalModule} from "ngx-bootstrap/modal";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import { CongratsComponent } from './app-main-page/congrats/congrats.component';
import { LoginRegisterSliderComponent } from './login-register-slider/login-register-slider.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AppNavbarComponent,
    SudokuComponent,
    SudokuGameComponent,
    TimerComponent,
    ImageToTextComponent,
    AppFooterComponent,
    CongratsComponent,
    LoginRegisterSliderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    MatInputModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule,
    ModalModule
  ],
  providers: [BsDropdownConfig,BsModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
