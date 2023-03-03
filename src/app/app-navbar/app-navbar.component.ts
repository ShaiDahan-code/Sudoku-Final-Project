import {Component, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent {
  modalRef!: BsModalRef;
  constructor(private modalService: BsModalService) {
  }

  /** Open the modal when get the Temple was sent.*/
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
