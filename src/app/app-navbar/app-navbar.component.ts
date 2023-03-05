import {Component, ViewChild, ElementRef, TemplateRef} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent {
  @ViewChild('myAudio', { static: false }) myAudio!: ElementRef<HTMLAudioElement>;

  isPlaying: boolean = false;
  modalRef!: BsModalRef;
  constructor(private modalService: BsModalService) {
  }

  /** Open the modal when get the Temple was sent.*/
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  toggleAudio() {
    if(this.isPlaying)
      this.myAudio.nativeElement.pause();
    else
      this.myAudio.nativeElement.play();
    this.isPlaying = !this.isPlaying;
  }
}
