import {Component, ViewChild, ElementRef, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {UserService} from "../services/user-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent {
  @ViewChild('myAudio', { static: false }) myAudio!: ElementRef<HTMLAudioElement>;

  isPlaying: boolean = false;
  modalRef!: BsModalRef;
  constructor(private modalService: BsModalService,public userService: UserService, private router: Router) {
  }

  /** Open the modal when get the Temple was sent.*/
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  logout() {
    // You might want to make a logout request to the server here
    this.userService.loginStatus(false, null); // reset login status and current user
    this.router.navigate(['/Login']); // redirect to login page

  }
  toggleAudio() {
    if(this.isPlaying)
      this.myAudio.nativeElement.pause();
    else
      this.myAudio.nativeElement.play();
    this.isPlaying = !this.isPlaying;
  }
}
