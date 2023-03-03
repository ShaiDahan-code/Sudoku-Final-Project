import {Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import * as Tesseract from 'tesseract.js'

@Component({
  selector: 'app-image-to-text',
  templateUrl: './image-to-text.component.html',
  styleUrls: ['./image-to-text.component.css']
})

export class ImageToTextComponent implements OnInit {
  imageText!: any;
  constructor() { }

  ngOnInit(): void {

  }

  uploadImage(event :any) {
    const file = event.target.files[0];
    let loadingPopup = document.getElementById('loading-clear') || document.getElementById('loading-popup-display') ;

    Tesseract
      .recognize(file)
      .then((res: any) => {
        this.imageText = this.replaceBarWithSpace(res.data.text.replaceAll("[","").replaceAll("]",""))
          .replaceAll("|","").replaceAll("(","")
          .replace(/[a-zA-Z]/g, "0").replaceAll(' ','0');
        this.imageText = this.checkEveryLineSize(this.imageText.split("\n"));
        console.log(this.imageText);
        loadingPopup = document.getElementById('loading-clear') || document.getElementById('loading-popup-display');
        if (loadingPopup) {
          loadingPopup.id = 'loading-clear';
        }
      })
      .catch(console.error);
    console.log("Here!")
    loadingPopup = document.getElementById('loading-clear') || document.getElementById('loading-popup-display');
    if (loadingPopup) {
      loadingPopup.id = 'loading-clear';
    }
  }
  replaceBarWithSpace(text:string) {
    const rows = text.split("\n");
    const newRows = rows.map(row => {
      return row.replace(/^\|/, " ");
    });
    return newRows.join("\n");
  }
  checkEveryLineSize(text:string[]){
    return text.map((str) => {
      if (str.length > 9) {
        return str.slice(1);
      }
      return str;
    }).join("");
  }

  chooseFileEvent() {
    const loadingPopup = document.getElementById('loading-clear');
    if (loadingPopup) {
      loadingPopup.id = "loading-popup-display";
    }
  }

}

