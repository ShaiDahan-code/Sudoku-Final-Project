import {Component, OnInit, ViewChild, ElementRef, TemplateRef} from '@angular/core';
import * as Tesseract from 'tesseract.js'
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
@Component({
  selector: 'app-image-to-text',
  templateUrl: './image-to-text.component.html',
  styleUrls: ['./image-to-text.component.css']
})

export class ImageToTextComponent implements OnInit {
  imageText!: any;
  defaultBtn!:any;
  modalRef!: BsModalRef;
  imageDataUrl!:string;
  constructor(private modalService: BsModalService) {
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit(): void {

  }

  uploadImage(event :any) {
    const file = event.target.files[0];
    let loadingPopup = document.getElementById('loading-clear') || document.getElementById('loading-popup-display') ;
  try {
    Tesseract
      .recognize(file)
      .then((res: any) => {
        this.imageText = this.replaceBarWithSpace(res.data.text.replaceAll("[", "").replaceAll("]", ""))
          .replaceAll("|", "").replaceAll("(", "")
          .replace(/[a-zA-Z]/g, "0").replaceAll(' ', '0');
        this.imageText = this.checkEveryLineSize(this.imageText.split("\n"));
        console.log(this.imageText);
        loadingPopup = document.getElementById('loading-clear') || document.getElementById('loading-popup-display');
        if (loadingPopup) {
          loadingPopup.id = 'loading-clear';
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const image = reader.result as string;
            this.imageDataUrl = image;
          }

        }
      })
  }
  catch  {
    loadingPopup = document.getElementById('loading-clear') || document.getElementById('loading-popup-display');
    if (loadingPopup) {
      loadingPopup.id = 'loading-clear';
    }
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
  defaultBtnActive(){
    this.defaultBtn = document.getElementById("fileEvent");
    console.log(this.defaultBtn);
    this.defaultBtn.click()
  }

}

