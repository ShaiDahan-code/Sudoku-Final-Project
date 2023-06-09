import {Component, Input} from '@angular/core';

type Coordinate = [number, number];

export interface PossibleAnswer {
  row: number;
  col: number;
  array: number[];
}

export interface GridPosition {
  row: number;
  col: number;
}

export interface Cell {
  content: string;
  editable: boolean;
  style: Set<string>;
  isBlock: boolean;
  hints: string;
}

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent {
  gameEnded: boolean = false;
  private HintsOn: any;
  constructor() {
  }

  grid!: Cell[][];
  gridSoulution!: Cell[][];
  selectedCell: GridPosition = {row: -1, col: -1};
  unvalidBoard: boolean = false;
  hovering: boolean = false;

  explainStage: number = 0;
  hintRowAndCol: GridPosition = {row: -1, col: -1};
  possibleNumber!: number;


  @Input()
  set sudokuStringSolution(sudoku:string){
    if(!sudoku || sudoku.length !== 81){
      this.unvalidBoard = true;
    }
    this.gridSoulution = [];
    for (let i = 0; i < 9; i++) {
      this.gridSoulution[i] = [];
      for (let j = 0; j < 9; j++) {
        this.gridSoulution[i][j] = {content: sudoku[i * 9 + j], editable: false, style: new Set([]), isBlock: false,hints:""}
      }
    }

  };
  hintIsActive: boolean = false;

  @Input()
  set sudokuString(sudoku: string) {
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
        this.grid[i][j] = {content: sudoku[i * 9 + j], editable: false, style: new Set([]), isBlock: false,hints:""}
        this.grid[i][j].editable = this.grid[i][j].content == "0";
        if (!this.grid[i][j].editable) {
          this.grid[i][j].style.add("filled");
        }
      }
    }

  }


  selectCell(row: number, col: number) {
    if(this.hintIsActive) return;
    if (!this.grid[row][col].editable || this.grid[row][col].isBlock) {
      this.selectedCell.row = -1;
      this.selectedCell.col = -1;
      return;
    }

    this.deleteSelectedCell();
    this.displaySelectedValid(row, col);
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
    if(this.hintIsOn) return;
    let row = this.selectedCell.row;
    let col = this.selectedCell.col;
    this.grid[row][col].content = numberSelected.toString();


    this.checkForValidation(this.selectedCell.row, this.selectedCell.col, numberSelected);

    if(this.grid[row][col].content !== this.gridSoulution[row][col].content && numberSelected !== 0){
      this.grid[row][col].style.add('err');
      this.grid[row][col].style.delete("valid");
      this.BlockAllButtons(row, col)
    }
    else{
      this.ReleaseAllButtons(row, col)
      this.grid[row][col].style.add("valid");
      this.grid[row][col].style.delete("err");
      this.gameEnded = this.checkForWin();
    }

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
      this.gameEnded = this.checkForWin();
    }
    this.deleteHover();
    this.grid[row][col].style.delete("selected");

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
    //asd
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

  printPossibaleNumberOnBoard(){
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if(!this.grid[row][col].style.has("filled")) {
          const possibleNumbers = this.sudoku_PossibleNumbers_RightNow.find(x => x.row == row && x.col == col)?.array as number[];
          this.grid[row][col].style.add("Hint3");
          this.grid[row][col].hints = possibleNumbers.toString().replaceAll(","," ");
          this.HintsOn = true;
        }
      }
    }
  }
  sudoku_PossibleNumbers_RightNow: PossibleAnswer[] = [];
  hintIsOn: boolean = false;
  /** Function to find the next move the user can do to continue solving the sudoku.*/
  findNextMove() {
    this.sudoku_PossibleNumbers_RightNow = [];
    if(this.selectedCell.row != -1 && this.selectedCell.col != -1){
      this.deleteSelectedCell();
      this.selectedCell.row = -1;
      this.selectedCell.col = -1;
    }
    let sudoku_PossibleNumbers: PossibleAnswer[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.grid[row][col].content == "0") {
          const possibleNumbers = this.getPossibleNumbers(row, col);
          sudoku_PossibleNumbers.push({row: row, col: col, array: possibleNumbers});
          this.sudoku_PossibleNumbers_RightNow.push({row: row, col: col, array: possibleNumbers});

          if (possibleNumbers.length == 1) {
            this.hintIsActive = true;
            this.displayToUserNextMove1(row, col);
            return; //We found a move so we can stop the function
          }
        }
      }
    }

    //In case we not find a 100% spot to put a number, we will try to remove more options from the possible numbers by Hint2.
    let hint2PossibleAnswer = this.editPossibleNumbers(sudoku_PossibleNumbers);
    this.changeto2d(sudoku_PossibleNumbers)

    if (hint2PossibleAnswer.row != -1) {
      this.hintIsActive = true;
      this.displayToUserNextMove2(hint2PossibleAnswer.row, hint2PossibleAnswer.col, hint2PossibleAnswer.array[0]);
    }
    else if (this.LockedCandidatesRows(sudoku_PossibleNumbers) == 1){
      this.printPossibaleNumberOnBoard();
      this.printPossibaleNumberOnBoard();
    }
    else if (this.LockedCandidatesCols(sudoku_PossibleNumbers) == 1){
      this.printPossibaleNumberOnBoard();
      this.printPossibaleNumberOnBoard();
    }
    else{
      this.LockedCandidatesCols(sudoku_PossibleNumbers)
      this.printPossibaleNumberOnBoard();
    }

  }
  changeto1d(arr: number[][][]): PossibleAnswer[] {
    let result: PossibleAnswer[] = [];

    for (let row = 0; row < arr.length; row++) {
      for (let col = 0; col < arr[row].length; col++) {
        if (!arr[row][col].every(value => value === -1)) { // Add this condition
          result.push({
            row: row,
            col: col,
            array: arr[row][col]
          });
        }
      }
    }

    return result;
  }

  changeto2d(arr: PossibleAnswer[]): number[][][] {
    // find the maximum row and col in the array to determine the size of the 2D array
    let maxRow = 0, maxCol = 0;
    for (let answer of arr) {
      maxRow = Math.max(maxRow, answer.row);
      maxCol = Math.max(maxCol, answer.col);
    }

    // create a 2D array with default value [-1] for each cell
    let result: number[][][] = Array(maxRow + 1).fill(0).map(() => Array(maxCol + 1).fill(0).map(() => [-1]));

    // populate the 2D array with the values from the arr array
    for (let answer of arr) {
      result[answer.row][answer.col] = answer.array;
    }

    return result;
  }
  intersect(arr1: any[], arr2: any[]): any[] {
    return arr1.filter(value => arr2.includes(value));
  }
  union(arr1: any[], arr2: any[]): any[] {
    let set = new Set([...arr1, ...arr2]);
    return Array.from(set);
  }
  LockedCandidatesRows(arr: PossibleAnswer[]): any {
    let arr2d = this.changeto2d(arr);
    this.printPossibaleNumberOnBoard();
    for (let i=0; i<9;i++){
      for (let j=0; j<3;j++){
        arr2d = this.changeto2d(arr);
        let pos_num = this.union(arr2d[i][j*3],arr2d[i][j*3+1]);
        pos_num = this.union(pos_num,arr2d[i][j*3+2]);
        pos_num = pos_num.filter(value => value != -1);
        let num_to_delete: number[] = [];
        const rowStart = Math.floor(i / 3) * 3;
        const colStart = Math.floor(j*3 / 3) * 3;
        let num_to_check = [];
        for(let n = rowStart;n< rowStart+3;n++){
          for(let m = colStart;m< colStart+3;m++){
            if(n == i)
              continue;
            num_to_check = this.union(num_to_check,arr2d[n][m]);
          }
        }
        for(let k = 0; k<pos_num.length;k++){
          if(this.intersect([pos_num[k]],num_to_check).length == 0){
            num_to_delete.push(pos_num[k]);
          }
        }
        if(num_to_delete.length > 0){
          for(let t = 0;t<9;t++){
            if(t==j*3 || t==j*3+1 || t ==j*3+2)
              continue;
            arr2d[i][t] = arr2d[i][t].filter(value => !num_to_delete.includes(value));
          }
          let option_to_solve = this.changeto1d(arr2d);
          let hint2PossibleAnswer = this.editPossibleNumbers(option_to_solve);
          if (hint2PossibleAnswer.row != -1) {
            this.displayToUserNextMove2(hint2PossibleAnswer.row, hint2PossibleAnswer.col, hint2PossibleAnswer.array[0]);
            return 1;
          }
        }
        num_to_delete = [];
      }
    }
    return 0;
  }
  LockedCandidatesCols(arr: PossibleAnswer[]): number{
    this.printPossibaleNumberOnBoard();
    let arr2d = this.changeto2d(arr);
    for (let i=0; i<9;i++){
      for (let j=0; j<3;j++){
        arr2d = this.changeto2d(arr);
        let pos_num = this.union(arr2d[j*3][i],arr2d[j*3+1][i]);
        pos_num = this.union(pos_num,arr2d[j*3+2][i]);
        pos_num = pos_num.filter(value => value != -1);
        let num_to_delete: number[] = [];
        const rowStart = Math.floor(i / 3) * 3;
        const colStart = Math.floor(j*3 / 3) * 3;
        let num_to_check = [];
        for(let n = rowStart;n< rowStart+3;n++){
          for(let m = colStart;m< colStart+3;m++){
            if(n == i)
              continue;
            num_to_check = this.union(num_to_check,arr2d[m][n]);
          }
        }
        for(let k = 0; k<pos_num.length;k++){
          if(this.intersect([pos_num[k]],num_to_check).length == 0){
            num_to_delete.push(pos_num[k]);
          }
        }
        if(num_to_delete.length > 0){
          for(let t = 0;t<9;t++){
            if(t==i*3 || t==i*3+1 || t ==i*3+2)
              continue;
            arr2d[t][i] = arr2d[t][i].filter(value => !num_to_delete.includes(value));
          }
          let option_to_solve = this.changeto1d(arr2d);
          let hint2PossibleAnswer = this.editPossibleNumbers(option_to_solve);
          if (hint2PossibleAnswer.row != -1) {
            this.displayToUserNextMove2(hint2PossibleAnswer.row, hint2PossibleAnswer.col, hint2PossibleAnswer.array[0]);
            return 1;
          }
        }
        num_to_delete = [];
      }
    }
    return 0;
  }

  editPossibleNumbers(arr: PossibleAnswer[]): PossibleAnswer {
    for (let i = 0; i < arr.length; i++) {
      let row = arr[i].row;
      let col = arr[i].col;
      let possibleNumbers = arr[i].array;
      const rowStart = Math.floor(row / 3) * 3;
      const colStart = Math.floor(col / 3) * 3;
      for (let i = rowStart; i < rowStart + 3; i++) {
        for (let j = colStart; j < colStart + 3; j++) {
          if (this.grid[i][j].content === "0") {
            if (i == row && j == col)//We don't want to remove the number from the same cell.
              continue;
            //find in arr the cell with the same row and col
            let index = arr.findIndex(cell => cell.row == i && cell.col == j);
            if (index != -1) {
              arr[index].array.forEach(num => {
                if (possibleNumbers.includes(num))
                  possibleNumbers = possibleNumbers.filter(number => (number !== num));
              });
            }
            //In case the numbers on possibleNumbers is equal to 1 then we got a 100% spot to put a number.

          }
        }
      }
      if (possibleNumbers.length === 1) {
        return {row: row, col: col, array: possibleNumbers};
      }
    }
    return {row: -1, col: -1, array: []}
  }

  /** Return all the possible numbers of each cell. Get as input the row and col, and remove all the numbers in the row,col,and 3x3 square that can't be possible number.*/
  getPossibleNumbers(row: number, col: number): number[] {
    let possibleNumbers: number[] = Array.from({length: 9}, (_, i) => i + 1);
    for (let i = 0; i < 9; i++) {
      if (this.grid[row][i].content != "0" && possibleNumbers.includes(parseInt(this.grid[row][i].content))) {
        possibleNumbers = possibleNumbers.filter(num => (num !== parseInt(this.grid[row][i].content)));
        this.grid[row][i].style.add("")
      }
      if (this.grid[i][col].content != "0" && possibleNumbers.includes(parseInt(this.grid[i][col].content))) {
        possibleNumbers = possibleNumbers.filter(num => (num !== parseInt(this.grid[i][col].content)));
      }
    }
    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(col / 3) * 3;
    for (let i = rowStart; i < rowStart + 3; i++) {
      for (let j = colStart; j < colStart + 3; j++) {
        if (this.grid[i][j].content != "0" && possibleNumbers.includes(parseInt(this.grid[i][j].content)))
          possibleNumbers = possibleNumbers.filter(num => (num !== parseInt(this.grid[i][j].content)));
      }
    }
    return possibleNumbers;
  }

  displayToUserNextMove2(row: number, col: number, possibleNumber: number) {
    this.hintIsActive = true;
    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(col / 3) * 3;
    const adjacentCells: Coordinate[] = [];
    // Check cells in the same row
    for (let i = 0; i < 3; i++) {
      if (i !== rowStart) {
        adjacentCells.push([i * 3, colStart]);
      }
    }

    // Check cells in the same column
    for (let j = 0; j < 3; j++) {
      if (j !== colStart) {
        adjacentCells.push([rowStart, j * 3]);
      }
    }
    //remove from adjacentCells the [rowStart, colStart]
    adjacentCells.splice(adjacentCells.findIndex(cell => cell[0] == rowStart && cell[1] == colStart), 1);

    //Move on all the spots that can influence the block we check, and mark all the numbers on those block that equal to possibleNumber.
    adjacentCells.forEach(block => {
      for (let i = block[0]; i < block[0] + 3; i++) {
        for (let j = block[1]; j < block[1] + 3; j++) {
          if (this.grid[i][j].content == possibleNumber.toString()) {
            this.grid[i][j].style.add("nextMove1");
          }
        }
      }
    });
    this.possibleNumber = possibleNumber;
    this.hintRowAndCol = {row: row, col: col};
  }

  /** After the user get the hint There are 3 steps to explained how it's working(Hint 1), will trigger the explanation process.*/
  displayToUserNextMove1(row: number, col: number) {
    let possibleNumbers: number[] = Array.from({length: 9}, (_, i) => i + 1);
    for (let i = 0; i < 9; i++) {
      if (this.grid[row][i].content != "0" && possibleNumbers.includes(parseInt(this.grid[row][i].content))) {
        possibleNumbers = possibleNumbers.filter(num => (num !== parseInt(this.grid[row][i].content)));
        this.grid[row][i].style.add("nextMove1");
      }
      if (this.grid[i][col].content != "0" && possibleNumbers.includes(parseInt(this.grid[i][col].content))) {
        possibleNumbers = possibleNumbers.filter(num => (num !== parseInt(this.grid[i][col].content)));
        this.grid[i][col].style.add("nextMove1");

      }
    }
    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(col / 3) * 3;
    for (let i = rowStart; i < rowStart + 3; i++) {
      for (let j = colStart; j < colStart + 3; j++) {
        if (this.grid[i][j].content != "0" && possibleNumbers.includes(parseInt(this.grid[i][j].content))) {
          possibleNumbers = possibleNumbers.filter(num => (num !== parseInt(this.grid[i][j].content)));
          this.grid[i][j].style.add("nextMove1");
        }
      }
    }
    this.grid[row][col].style.delete("nextMove1");
    this.possibleNumber = possibleNumbers[0];
    this.hintRowAndCol = {row: row, col: col};
  }

  /** After the user get the hint There are 3 steps to explained how it's working(Hint 1), this function is to go forward with the explanation.*/
  goToNextExplain() {
    this.explainStage++;
    if (this.explainStage == 1) {
      this.grid[this.hintRowAndCol.row][this.hintRowAndCol.col].style.add("hintCell");
      const rowStart = Math.floor(this.hintRowAndCol.row / 3) * 3;
      const colStart = Math.floor(this.hintRowAndCol.col / 3) * 3;
      for (let i = rowStart; i < rowStart + 3; i++) {
        for (let j = colStart; j < colStart + 3; j++) {
          this.grid[i][j].style.add("hintBlock");
        }
      }
    }
    if (this.explainStage == 2) {
      this.grid[this.hintRowAndCol.row][this.hintRowAndCol.col].content = this.possibleNumber.toString();
    }
    if (this.explainStage == 3) {
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
    if (this.explainStage == 0) {
      return;
    }
    this.explainStage--;
    if (this.explainStage == 0) {
      this.grid[this.hintRowAndCol.row][this.hintRowAndCol.col].style.delete("hintCell");
      const rowStart = Math.floor(this.hintRowAndCol.row / 3) * 3;
      const colStart = Math.floor(this.hintRowAndCol.col / 3) * 3;
      for (let i = rowStart; i < rowStart + 3; i++) {
        for (let j = colStart; j < colStart + 3; j++) {
          this.grid[i][j].style.delete("hintBlock");
        }
      }
    }
    if (this.explainStage == 1) {
      this.grid[this.hintRowAndCol.row][this.hintRowAndCol.col].content = "0";
    }
  }

  private checkForWin() {
    for (let i = 0; i < 9 ; i++) {
      for (let j = 0; j < 9 ; j++) {
        if(this.grid[i][j].content == "0"){
          return false
        }
      }
    }
    return true;
  }

  getCellContentDisplayValue(j: number, i: number) {
    if(this.HintsOn){
      if(!this.grid[j][i].style.has("filled"))
        return this.grid[j][i].hints;
    }
    if (this.grid[j][i].content === '0') {
      return '';
    }
    else if (this.grid[j][i].content !== '0') {
      return this.grid[j][i].content;
    }
    return ' '
  }
}
