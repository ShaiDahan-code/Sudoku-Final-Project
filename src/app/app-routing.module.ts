import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MainPageComponent} from "./app-main-page/app-main-page.component";
import {SudokuComponent} from "./app-main-page/sudoku/sudoku.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: MainPageComponent },
      { path: 'Sudoku/Easy', component: SudokuComponent },
      { path: 'game2', component: MainPageComponent },
      { path: 'game3', component: MainPageComponent }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
