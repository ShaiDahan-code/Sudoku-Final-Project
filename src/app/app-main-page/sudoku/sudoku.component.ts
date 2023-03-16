import {Component, Input} from '@angular/core';
import {BsModalService} from "ngx-bootstrap/modal";


export interface GridPosition {
  row:number;
  col:number;
}

export interface Cell{
  content:string;
  editable:boolean;
  style : Set<string>;
  isBlock:boolean;
}

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent {
  constructor(private modalService: BsModalService) {
  }
  grid!: Cell[][];
  selectedCell: GridPosition = {row: -1, col: -1};
  unvalidBoard: boolean = false;
  hovering: boolean = false;

  explainStage : number = 0;
  hintRowAndCol : GridPosition = {row: -1, col: -1};
  possibleNumber!: number;

  invalidCell: boolean = false;

  @Input() sudokuStringSolve !: string;
  hintIsActive: boolean = false;

  @Input()
  set sudokuString(sudoku: string) {
    console.log(sudoku);
    if (!sudoku) {
      this.unvalidBoard = true;
      return;
    } else if (sudoku.length !== 81) {
      this.unvalidBoard = true;
      return;
    }
    this.grid = [];
    for (let i = 0; i < 9; i++) {
      this.grid[i] = [];
      for (let j = 0; j < 9; j++) {
        this.grid[i][j] = {content: sudoku[i * 9 + j], editable: false, style: new Set([]), isBlock: false}
        this.grid[i][j].editable = this.grid[i][j].content == "0";
        if(!this.grid[i][j].editable){
          this.grid[i][j].style.add("filled");
        }
      }
    }
    // this.grid = this.transposeGrid(this.grid);
    console.log(this.grid);
  }

  transposeGrid(grid: Cell[][]): Cell[][] {
    console.log(grid);
    let transposedGrid: Cell[][] = [];
    for (let i = 0; i < 9; i++) {
      transposedGrid[i] = [];
      for (let j = 0; j < 9; j++) {
        // Create a deep copy of the cell object while transposing
        transposedGrid[i][j] = {
          content: grid[j][i].content,
          editable: grid[j][i].editable,
          style: new Set(grid[j][i].style),
          isBlock: grid[j][i].isBlock
        };
      }
    }
    console.log(transposedGrid);
    return transposedGrid;
  }


  selectCell(row: number, col: number) {
    if (!this.grid[row][col].editable || this.grid[row][col].isBlock) {
      this.selectedCell.row = -1;
      this.selectedCell.col = -1;
      return;
    }

    this.deleteSelectedCell();
    this.displaySelectedValid(row,col);
    this.grid[row][col].style.add("selected");
    this.selectedCell.row = row;
    this.selectedCell.col = col;
  }

  deleteSelectedCell() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        this.grid[i][j].style.delete("selected");
        this.grid[i][j].style.delete("hover");
      }
    }
  }

  selectedNumber(numberSelected: number) {
    this.grid[this.selectedCell.row][this.selectedCell.col].content = numberSelected.toString();
    this.checkForValidation(this.selectedCell.row, this.selectedCell.col, numberSelected);
    console.log(this.grid);
    this.selectedCell.row = -1;
    this.selectedCell.col = -1;
  }

  checkForValidation(row: number, col: number, numberSelected: number) {
    let is_invalid = false;
    for (let i = 0; i < 9; i++) {
      if (numberSelected != 0 && this.grid[row][i].content == numberSelected.toString() && i != col) {
        this.grid[row][i].style.add("err");
        is_invalid = true;
      } else {
        this.grid[row][i].style.delete("err");
      }
      if (numberSelected != 0 && this.grid[i][col].content == numberSelected.toString() && i != row) {
        this.grid[i][col].style.add("err");
        is_invalid = true;
      } else {
        this.grid[i][col].style.delete("err");
      }
    }
    let centerRow = row;
    let centerCol = col;
    if (row % 3 == 0)
      centerRow += 1;
    if (row % 3 == 2)
      centerRow -= 1;
    if (col % 3 == 0)
      centerCol += 1;
    if (col % 3 == 2)
      centerCol -= 1;

    for (let i = centerRow - 1; i < centerRow + 2; i++) {
      for (let j = centerCol - 1; j < centerCol + 2; j++) {
        if (row != i || col != j) {
          if (numberSelected && numberSelected.toString() == this.grid[i][j].content) {
            this.grid[i][j].style.add("err");
            is_invalid = true;
          } else {
            this.grid[i][j].style.delete("err");
          }
        }
      }
    }

    if (is_invalid) {
      this.grid[row][col].style.add("invalid");
      this.grid[row][col].style.delete("valid");
      this.BlockAllButtons(row, col)
    } else {
      this.ReleaseAllButtons(row, col)
      this.grid[row][col].style.add("valid");
      this.grid[row][col].style.delete("invalid");
    }
    this.deleteHover();

  }

  BlockAllButtons(row: number, col: number) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (i != row || j != col) {
          this.grid[i][j].isBlock = true;
        }
      }
    }
  }

  ReleaseAllButtons(row: number, col: number) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (i != row || j != col) {
          this.grid[i][j].isBlock = false;
        }
      }
    }
  }

  displayOptions() {
    return this.selectedCell.row !== -1 && this.selectedCell.col !== -1
  }

  arrayToDisplay() {
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    //remove from the arr the number in this.grid[this.selectedCell.row][this.selectedCell.col]
    arr.splice(arr.indexOf(parseInt(this.grid[this.selectedCell.row][this.selectedCell.col].content)), 1);
    return arr;

  }

  getClasses(style: Set<string>) {
    let classes: string = "";
    for (let st of style) {
      classes += st + " ";
    }
    return classes;
  }

  addStyle(i: number, j: number) {
    let style = "";
    if (i === 2 || i === 5)
      style += " margin-right: 10px;";
    if (j === 2 || j === 5)
      style += " margin-bottom: 10px;";
    return style;
  }
  deleteHover() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        this.grid[i][j].style.delete("hover")
      }
    }
  }
  private displaySelectedValid(row: number, col: number) {
    for (let i = 0; i < 9; i++) {
      this.grid[row][i].style.add("hover");
      this.grid[i][col].style.add("hover");
    }

    let centerRow = row;
    let centerCol = col;
    if (row % 3 == 0)
      centerRow += 1;
    if (row % 3 == 2)
      centerRow -= 1;
    if (col % 3 == 0)
      centerCol += 1;
    if (col % 3 == 2)
      centerCol -= 1;

    for (let i = centerRow - 1; i < centerRow + 2; i++) {
      for (let j = centerCol - 1; j < centerCol + 2; j++) {
        this.grid[i][j].style.add("hover");

      }
    }
  }


  /** Function to find the next move the user can do to continue solving the sudoku.*/
  findNextMove() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.grid[row][col].content == "0") {
          const possibleNumbers = this.getPossibleNumbers(row, col);
          console.log([row, col, possibleNumbers]);

          //In case the numbers on possibleNumbers are more than 1 then we got a 100% spot to put a number.
          //In that case we need to give styles to the row, the col and the 3x3 square
          if(possibleNumbers.length == 1){
            this.hintIsActive = true;
            this.displayToUserNextMove1(row,col);
            return; //We found a move so we can stop the function
          }
        }
      }
    }
  }

  getPossibleNumbers(row: number, col: number){
    let possibleNumbers: number[] = Array.from({ length: 9 }, (_, i) => i + 1);
    for (let i = 0; i < 9; i++) {
      if(this.grid[row][i].content != "0" && possibleNumbers.includes(parseInt(this.grid[row][i].content))) {
        possibleNumbers = possibleNumbers.filter(num => (num !== parseInt(this.grid[row][i].content)));
        this.grid[row][i].style.add("")
      }
      if(this.grid[i][col].content != "0" && possibleNumbers.includes(parseInt(this.grid[i][col].content))) {
        possibleNumbers = possibleNumbers.filter(num => (num !== parseInt(this.grid[i][col].content)));
      }
    }
    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(col / 3) * 3;
    for (let i = rowStart; i < rowStart + 3; i++) {
      for (let j = colStart; j < colStart + 3; j++) {
        if(this.grid[i][j].content != "0" && possibleNumbers.includes(parseInt(this.grid[i][j].content)))
          possibleNumbers = possibleNumbers.filter(num => (num !== parseInt(this.grid[i][j].content)));
      }
    }
    return possibleNumbers;
  }

  displayToUserNextMove1(row: number, col: number){
    let possibleNumbers: number[] = Array.from({ length: 9 }, (_, i) => i + 1);
    for (let i = 0; i < 9; i++) {
      if(this.grid[row][i].content != "0" && possibleNumbers.includes(parseInt(this.grid[row][i].content))) {
        possibleNumbers = possibleNumbers.filter(num => (num !== parseInt(this.grid[row][i].content)));
        this.grid[row][i].style.add("nextMove1");
      }
      if(this.grid[i][col].content != "0" && possibleNumbers.includes(parseInt(this.grid[i][col].content))) {
        possibleNumbers = possibleNumbers.filter(num => (num !== parseInt(this.grid[i][col].content)));
        this.grid[i][col].style.add("nextMove1");

      }
    }
    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(col / 3) * 3;
    for (let i = rowStart; i < rowStart + 3; i++) {
      for (let j = colStart; j < colStart + 3; j++) {
        if(this.grid[i][j].content != "0" && possibleNumbers.includes(parseInt(this.grid[i][j].content))) {
          possibleNumbers = possibleNumbers.filter(num => (num !== parseInt(this.grid[i][j].content)));
          this.grid[i][j].style.add("nextMove1");
        }
      }
    }
    this.grid[row][col].style.delete("nextMove1");
    this.possibleNumber = possibleNumbers[0];
    this.hintRowAndCol = {row: row, col: col};
  }

  goToNextExplain() {
    this.explainStage++;
    if(this.explainStage == 1){
      this.grid[this.hintRowAndCol.row][this.hintRowAndCol.col].style.add("hintCell");
      const rowStart = Math.floor(this.hintRowAndCol.row / 3) * 3;
      const colStart = Math.floor(this.hintRowAndCol.col / 3) * 3;
      for (let i = rowStart; i < rowStart + 3; i++) {
        for (let j = colStart; j < colStart + 3; j++) {
          this.grid[i][j].style.add("hintBlock");
        }
      }
    }
    if(this.explainStage == 2){
      this.grid[this.hintRowAndCol.row][this.hintRowAndCol.col].content = this.possibleNumber.toString();
    }
    if(this.explainStage == 3){
      this.hintIsActive = false;

      //Remove all the styles
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          this.grid[i][j].style.delete("nextMove1");
          this.grid[this.hintRowAndCol.row][this.hintRowAndCol.col].style.delete("hintCell");
          this.grid[i][j].style.delete("hintBlock");
        }
      }
      this.grid[this.hintRowAndCol.row][this.hintRowAndCol.col].style.add("filled");
      this.grid[this.hintRowAndCol.row][this.hintRowAndCol.col].isBlock = true;
      this.explainStage = 0;
    }

  }

  goToBackExplain() {
    if(this.explainStage == 0){
      return;
    }
    this.explainStage--;
    if(this.explainStage == 0){
      this.grid[this.hintRowAndCol.row][this.hintRowAndCol.col].style.delete("hintCell");
      const rowStart = Math.floor(this.hintRowAndCol.row / 3) * 3;
      const colStart = Math.floor(this.hintRowAndCol.col / 3) * 3;
      for (let i = rowStart; i < rowStart + 3; i++) {
        for (let j = colStart; j < colStart + 3; j++) {
          this.grid[i][j].style.delete("hintBlock");
        }
      }
    }
    if(this.explainStage == 1){
      this.grid[this.hintRowAndCol.row][this.hintRowAndCol.col].content = "0";
    }
  }
}
