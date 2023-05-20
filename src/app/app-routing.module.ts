import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MainPageComponent} from "./app-main-page/app-main-page.component";
import {SudokuGameComponent} from "./app-main-page/sudoku-game/sudoku-game.component";
import {LoginRegisterSliderComponent} from "./login-register-slider/login-register-slider.component";


@NgModule({
  imports: [
    RouterModule.forRoot([
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'Sudoku/Easy', component: SudokuGameComponent, data: { Level: "easy" } },
    { path: 'Sudoku/Medium', component: SudokuGameComponent, data: { Level: "medium" } },
    { path: 'Sudoku/Hard', component: SudokuGameComponent, data: { Level: "hard" } },
    { path: 'Login', component: LoginRegisterSliderComponent, },
    { path: '**', redirectTo: '/home' } // Wildcard route that redirects to the home page
], {
    initialNavigation: 'enabledBlocking'
})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
