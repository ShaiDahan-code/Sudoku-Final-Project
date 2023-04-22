import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {PuzzleService} from "./puzzle-service";


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
  private easyPuzzle: any;
  constructor(private route: ActivatedRoute,private httpClient: HttpClient,private puzzleService: PuzzleService){

  }


  async ngOnInit(): Promise<void> {
    this.route.data.subscribe((data) => {
      this.level = data['Level'];
    });
    this.easyPuzzle = await this.puzzleService.getPuzzle(this.level);
    this.boardString = this.easyPuzzle["puzzle"].replaceAll('.','0');
  }

}
