import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent {
  grid!: string[][];
  selectedCell: string = '';

  @Input()
  set sudokuString(sudoku: string) {
    this.grid = [];
    for (let i = 0; i < 9; i++) {
      this.grid[i] = [];
      for (let j = 0; j < 9; j++) {
        this.grid[i][j] = sudoku[i * 9 + j];
      }
    }
  }


}
