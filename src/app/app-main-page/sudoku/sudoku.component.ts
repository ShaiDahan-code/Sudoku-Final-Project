import {Component, Input} from '@angular/core';


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
  grid!: Cell[][];
  selectedCell: GridPosition = {row:-1, col:-1};
  unvalidBoard: boolean = false;

  invalidCell: boolean = false;

  @Input() sudokuStringSolve !:string;
  @Input()
  set sudokuString(sudoku: string) {
    if(!sudoku){
      this.unvalidBoard = true;
      return;
    }
    else if(sudoku.length !== 81) {
      this.unvalidBoard = true;
      return;
    }
    this.grid = [];
    for (let i = 0; i < 9; i++) {
      this.grid[i] = [];
      for (let j = 0; j < 9; j++) {
        this.grid[i][j] = {content: sudoku[i*9+j], editable: false, style:new Set([]), isBlock:false}
        this.grid[i][j].editable = true ? this.grid[i][j].content == "0" : false;
      }
    }
  }


  selectCell(row: number, col: number) {
    if(!this.grid[row][col].editable || this.grid[row][col].isBlock) {
      this.selectedCell.row = -1;
      this.selectedCell.col = -1;
      return;
    }

    this.selectedCell.row = row;
    this.selectedCell.col = col;
  }

  selectedNumber(numberSelected : number) {
    this.grid[this.selectedCell.row][this.selectedCell.col].content = numberSelected.toString();
    this.checkForValidation(this.selectedCell.row,this.selectedCell.col,numberSelected);
    console.log(this.grid);
    this.selectedCell.row = -1;
    this.selectedCell.col = -1;
  }

  checkForValidation(row: number, col: number, numberSelected : number){
    let is_invalid = false;
    for(let i = 0 ; i< 9 ;i++){
      if (numberSelected != 0 && this.grid[row][i].content == numberSelected.toString() && i != col){
        this.grid[row][i].style.add("duplicate");
        is_invalid = true;
      }
      else{
        this.grid[row][i].style.delete("duplicate");
      }
      if (numberSelected != 0 && this.grid[i][col].content == numberSelected.toString() && i != row){
        this.grid[i][col].style.add("duplicate");
        is_invalid = true;
      }
      else{
        this.grid[i][col].style.delete("duplicate");
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

    for(let i = centerRow-1 ; i < centerRow+2 ;i++){
      for(let j = centerCol-1 ; j < centerCol+2 ;j++){
        if(row != i || col != j){
          if(numberSelected && numberSelected.toString() == this.grid[i][j].content){
            this.grid[i][j].style.add("duplicate");
            is_invalid = true;
          }
          else{
            this.grid[i][j].style.delete("duplicate");
          }
        }
      }
    }

    if(is_invalid) {
      this.grid[row][col].style.add("invalid");
      this.grid[row][col].style.delete("valid");
      this.BlockAllButtons(row,col)
    }
    else{
      this.ReleaseAllButtons(row,col)
      this.grid[row][col].style.add("valid");
      this.grid[row][col].style.delete("invalid");
    }


  }
  BlockAllButtons(row: number, col: number) {
    for (let i = 0 ; i <9 ; i++){
      for(let j =0 ; j < 9 ; j++){
        if(i != row || j != col){
          this.grid[i][j].isBlock = true;
        }
      }
    }
  }
  ReleaseAllButtons(row: number, col: number) {
    for (let i = 0 ; i <9 ; i++){
      for(let j =0 ; j < 9 ; j++){
        if(i != row || j != col){
          this.grid[i][j].isBlock = false;
        }
      }
    }
  }
  displayOptions() {
    return this.selectedCell.row !== -1 && this.selectedCell.col !== -1
  }

  arrayToDisplay() {
    let arr = [0,1,2,3,4,5,6,7,8,9];
    if(this.grid[this.selectedCell.row][this.selectedCell.col].content === '0') {
      return arr;
    }
    //remove from the arr the number in this.grid[this.selectedCell.row][this.selectedCell.col]
    arr.splice(arr.indexOf(parseInt(this.grid[this.selectedCell.row][this.selectedCell.col].content)),1);
    return arr;

  }

  getClasses(style: Set<string>) {
    let classes :string = "";
    for (let st of style) {
      classes += st +" ";
    }
    return classes;
  }
}
