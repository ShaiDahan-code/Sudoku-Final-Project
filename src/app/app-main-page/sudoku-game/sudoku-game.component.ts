import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-sudoku-game',
  templateUrl: './sudoku-game.component.html',
  styleUrls: ['./sudoku-game.component.css']
})
export class SudokuGameComponent implements OnInit{
  level:string = '';
  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
      this.route.data.subscribe((data) => {
        this.level = data['Level'];
    });
  }
}
