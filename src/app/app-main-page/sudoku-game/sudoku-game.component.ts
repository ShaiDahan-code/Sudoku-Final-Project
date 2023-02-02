import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";


let FILES_PUZZLE: string[] = ["EasyPuzzle.txt","MediumPuzzle.txt","HardPuzzle.txt"];
let DIFFICULT = new Map<string, number>();
DIFFICULT.set("Easy", 0);
DIFFICULT.set("Medium", 1);
DIFFICULT.set("Hard", 2);

@Component({
  selector: 'app-sudoku-game',
  templateUrl: './sudoku-game.component.html',
  styleUrls: ['./sudoku-game.component.css']
})

export class SudokuGameComponent implements OnInit{
  level:string = 'easy';
  private rowSelected!: number;
  constructor(private route: ActivatedRoute) {


  }
  ngOnInit(): void {
      this.route.data.subscribe((data) => {
        this.level = data['Level'];
    });

  }

  createStringBoard(): string {
    const reader = new FileReader();
    let file_to_read = ""
    let index = DIFFICULT.get(this.level);

    if (index) {
      const file_to_read = new File(['content of the file'], FILES_PUZZLE[index], { type: 'text/plain' });
      reader.readAsText(file_to_read);

      reader.onload = () => {
          const rows = (reader.result as string).split('\n');
          //resolve(rows[this.rowSelected]);
          return rows[this.rowSelected]
        };
    }

    return 'Invalid level';
  }


  GetStringBoardSolve() {
    return ""
  }
}
