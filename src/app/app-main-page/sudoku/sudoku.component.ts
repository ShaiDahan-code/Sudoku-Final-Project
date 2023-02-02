import {Component, Input} from '@angular/core';

export interface GridPosition {
  row:number;
  col:number;
}

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent {
  grid!: string[][];
  selectedCell: GridPosition = {row:-1, col:-1};

  @Input() sudokuStringSolve !:string;
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


  selectCell(row: number, col: number) {
    this.selectedCell.row = row;
    this.selectedCell.col = col;
    console.log(this.grid[row][col]);

  }

  selectedNumber(numberSelected : number) {
    this.grid[this.selectedCell.row][this.selectedCell.col] = numberSelected.toString();
    this.selectedCell.row = -1;
    this.selectedCell.col = -1;
  }

  displayOptions() {
    return this.selectedCell.row !== -1 && this.selectedCell.col !== -1
  }

  arrayToDisplay() {
    let arr = [1,2,3,4,5,6,7,8,9];
    if(this.grid[this.selectedCell.row][this.selectedCell.col] === '0') {
      return arr;
    }
    //remove from the arr the number in this.grid[this.selectedCell.row][this.selectedCell.col]
    arr.splice(arr.indexOf(parseInt(this.grid[this.selectedCell.row][this.selectedCell.col])),1);
    return arr;



  }
}
