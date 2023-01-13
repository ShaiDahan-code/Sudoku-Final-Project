import { Component } from '@angular/core';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
})
export class SudokuComponent {
  title = 'Sudoku Game';
  cells = Array(81).fill({ value: null });
  selectedIndex: number | undefined;

  constructor() { }

  ngOnInit() {
  }
  select(index: number) {
    this.selectedIndex = index;
  }
}
