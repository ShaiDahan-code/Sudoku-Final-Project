import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-credits-pop-up',
  templateUrl: './credits-pop-up.component.html',
  styleUrls: ['./credits-pop-up.component.css']
})
export class CreditsPopUpComponent {
  constructor(public dialogRef: MatDialogRef<CreditsPopUpComponent>) {
  }
}
