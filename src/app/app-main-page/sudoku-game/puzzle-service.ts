import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Puzzle {
  id: string;
  puzzle: string;
  solution: string;
  clues: string;
  difficulty: string;
}

type DifficultyLevels = { [key: string]: number[] };

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {
  private levels: DifficultyLevels = {
    'easy': [0, 1],
    'medium': [1, 4],
    'hard': [4, 6]
  };
  private puzzles: Puzzle[] = [];

  constructor(private http: HttpClient) {
  }

  async getPuzzle(level: string): Promise<Puzzle | null> {
    const puzzles = await this.loadPuzzles();
    const filteredPuzzles = puzzles.filter(puzzle => {
      const [start, end] = this.levels[level];
      const difficulty = parseFloat(puzzle.difficulty);
      return start <= difficulty && difficulty < end;
    });
    if (filteredPuzzles.length === 0) {
      return null;
    }
    const selectedPuzzle = filteredPuzzles[Math.floor(Math.random() * filteredPuzzles.length)];
    return selectedPuzzle;
  }

  private async loadPuzzles(): Promise<Puzzle[]> {
    if (this.puzzles.length > 0) {
      return this.puzzles;
    } else {
      const response = await this.http.get('../../../assets/boards_data.txt', {responseType: 'text'}).toPromise();
      if (!response) { // add a null check for the response object
        console.log("Error: No response from server");
        return [];
      }
      const rows = response.split('\n').map(line => line.trim());
      const header = rows.shift()?.split(',') || [];
      const puzzles = rows.map(row => {
        const [id, puzzle, solution, clues, difficulty] = row.split(',');
        return {id, puzzle, solution, clues, difficulty};
      });
      this.puzzles = puzzles;
      console.log(puzzles);
      return puzzles;
    }
  }
}
