import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";



let FILES_PUZZLE: string[] = ["EasyPuzzle.txt","MediumPuzzle.txt","HardPuzzle.txt"];
let DIFFICULT = new Map<string, number>();
DIFFICULT.set("Easy", 0);
DIFFICULT.set("Medium", 1);
DIFFICULT.set("Hard", 2);

@Component({
  selector: 'app-sudoku-game',
  templateUrl: './sudoku-game.component.html',
  styleUrls: ['./sudoku-game.component.scss']
})

export class SudokuGameComponent implements OnInit{
  level:string = 'easy';
  hovering: boolean = false;
  private rowSelected!: number;

  boardString!: string;
  boardStringSolve!: string;
  constructor(private route: ActivatedRoute,private httpClient: HttpClient){

  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.level = data['Level'];
    });
    //generate a random number between 0 and 2000
    this.rowSelected = Math.floor(Math.random() * 2000);
    this.selectRandomBoard();
  }

  selectRandomBoard() {
    //read the file and get the string inside. the file is in path "../../../assets/MediumPuzzle.txt"
    let file = FILES_PUZZLE[DIFFICULT.get(this.level)!];
    this.httpClient.get("../../../assets/" + file, {responseType: 'text'}).subscribe((data) => {
      //get rowSelected row from the file
      let rows = data.split("\n");
      this.boardString = rows[this.rowSelected].split(",")[0];
      this.boardStringSolve = rows[this.rowSelected].split(",")[1];
    });

  }
}
