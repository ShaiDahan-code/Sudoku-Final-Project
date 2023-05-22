import {Component, Renderer2, ElementRef, TemplateRef, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../user-service.service";

function passwordStrengthValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const valid = regex.test(control.value);
  return valid ?  { passwordWeak: false } : { passwordWeak: true };
}
function emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  const valid = regex.test(control.value);
  return valid ? { passwordWeak: false } : { invalidEmail: true };
}


@Component({
  selector: 'app-login-register-slider',
  templateUrl: './login-register-slider.component.html',
  styleUrls: ['./login-register-slider.component.css']
})
export class LoginRegisterSliderComponent {
  /** Private fields*/
  registerForm: FormGroup;
  passwordError: string | null = null;
  registerCompleted: string | null = null;
  emailError: string | null = null;
  nameError: string | null = null;
  hasBeenSubmitted = false;
  modalRef!: BsModalRef;
  users :any[]= []

  constructor(private renderer: Renderer2,
              private el: ElementRef,
              private fb: FormBuilder,
              private modalService: BsModalService,
              private http: HttpClient,
              private userService: UserService) {
    this.registerForm = this.fb.group({
      registerName: ['', Validators.required],
      registerEmail: ['', [Validators.required, emailValidator]],
      registerPassword: ['', [Validators.required, passwordStrengthValidator]],
    });
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  onRegisterClick() {
    this.renderer.addClass(this.el.nativeElement.querySelector('#container'), 'right-panel-active');
  }

  onLoginClick() {
    this.renderer.removeClass(this.el.nativeElement.querySelector('#container'), 'right-panel-active');
  }


  createNewAccount() {
    this.hasBeenSubmitted = true;
    if (!this.registerForm.get('registerPassword')?.hasError('passwordWeak') &&
        !this.registerForm.get('registerEmail')?.hasError('invalidEmail') &&
        this.registerForm.get('registerName')?.value
    ) {
      // Reset the error messages
      this.passwordError = null;
      this.emailError = null;
      this.nameError = null;

      // Send a POST request to the server with the form data
      this.http.post('/api/data', this.registerForm.value).subscribe(
        response => {
          this.users = Object.entries(response);
          console.log(response);
          this.registerForm.reset();
          this.registerForm.setAsyncValidators(null);
          this.registerCompleted = 'Your account has been created successfully!';
          this.hasBeenSubmitted = false;
          this.onLoginClick();
        },
          error => {
              this.emailError = 'This email address is already registered.';
              this.hasBeenSubmitted = false;
              return;
        });

    }
    //In case not all fields are valid.
    else {
      if (this.registerForm.get('registerPassword')?.hasError('passwordWeak')) {
        this.passwordError = 'Password should have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.';
      } else {
        this.passwordError = null;
      }
      if (this.registerForm.get('registerEmail')?.hasError('invalidEmail')) {
        this.emailError = 'Please enter a valid email address.';
      } else {
        this.emailError = null;
      }
      if(!this.registerForm.get('registerName')?.value) {
        this.nameError = 'Please enter your name.';
      }
      else{
        this.nameError = null;
      }
    }
  }
}
