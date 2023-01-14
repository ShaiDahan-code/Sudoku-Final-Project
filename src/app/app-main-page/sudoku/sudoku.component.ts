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
  private sudokuString = "004300209005009001070060043006002087190007400050083000600000105003508690042910300";

  constructor() { }

  ngOnInit() {
    this.createBoard();
  }
  createBoard(){
    this.cells = [];
    for (let i = 0; i < this.sudokuString.length; i++) {
      let value = parseInt(this.sudokuString[i]);
      this.cells.push({ value });
    }
    console.log(this.cells);
  }
  select(index: number) {
    this.selectedIndex = index;
  }
  changeValue(i: number, j: number) {
    if(this.cells[i][j].value === 0){
      this.cells[i][j].value = 1;
    }else{
      this.cells[i][j].value = (this.cells[i][j].value + 1) % 10;
    }
  }

}
