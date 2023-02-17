import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-timer-component',
  templateUrl: './timer-component.component.html',
  styleUrls: ['./timer-component.component.css']
})

export class TimerComponent implements OnInit {
  @Input() duration = 0;  // 20 minutes in seconds
  minutes!: number;
  seconds!: number;

  ngOnInit() {
    this.minutes = Math.floor(this.duration / 60);
    this.seconds = this.duration % 60;

    setInterval(() => {
        this.duration++;
        this.minutes = Math.floor(this.duration / 60);
        this.seconds = this.duration % 60;
    }, 1000);
  }
}
