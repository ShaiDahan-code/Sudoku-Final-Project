import { Component, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-login-register-slider',
  templateUrl: './login-register-slider.component.html',
  styleUrls: ['./login-register-slider.component.css']
})
export class LoginRegisterSliderComponent {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  onRegisterClick() {
    this.renderer.addClass(this.el.nativeElement.querySelector('#container'), 'right-panel-active');
  }

  onLoginClick() {
    this.renderer.removeClass(this.el.nativeElement.querySelector('#container'), 'right-panel-active');
  }
}
