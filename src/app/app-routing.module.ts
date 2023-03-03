import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MainPageComponent} from "./app-main-page/app-main-page.component";
import {SudokuGameComponent} from "./app-main-page/sudoku-game/sudoku-game.component";


@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: MainPageComponent },
      { path: 'Sudoku/Easy', component: SudokuGameComponent,data: {Level:"Easy"} },
      { path: 'Sudoku/Medium', component: SudokuGameComponent ,data: {Level:"Medium"}},
      { path: 'Sudoku/Hard', component: SudokuGameComponent,data: {Level:"Hard"} },
      { path: '**', redirectTo: '/home' } // Wildcard route that redirects to the home page
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
