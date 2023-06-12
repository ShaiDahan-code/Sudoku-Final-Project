import {Component, Renderer2, ElementRef, TemplateRef, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user-service.service";
import { Router } from '@angular/router';

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
  loginForm: FormGroup;
  passwordError: string | null = null;
  loginPasswordError: string | null = null;
  registerCompleted: string | null = null;
  emailError: string | null = null;
  loginEmailError: string | null = null;
  nameError: string | null = null;
  hasBeenSubmitted = false;
  loginHasBeenSubmitted = false;
  modalRef!: BsModalRef;
  users :any[]= []

  constructor(private renderer: Renderer2,
              private el: ElementRef,
              private fb: FormBuilder,
              private modalService: BsModalService,
              private http: HttpClient,
              private userService: UserService,
              private router: Router) {
    this.registerForm = this.fb.group({
      registerName: ['', Validators.required],
      registerEmail: ['', [Validators.required, emailValidator]],
      registerPassword: ['', [Validators.required, passwordStrengthValidator]],
    });
    this.loginForm = this.fb.group({
      loginEmail: ['', [Validators.required, emailValidator]],
      loginPassword: ['', Validators.required]
    })
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

  Login() {
    this.loginHasBeenSubmitted = true;
    // Reset error messages
    this.loginEmailError = null;
    this.loginPasswordError = null;

    if(this.loginForm.get('loginEmail')?.hasError('invalidEmail')) {
      this.loginEmailError = 'Please enter a valid email address.';
      return;
    }
    else if(this.loginForm.get('loginPassword')?.hasError('required')) {
      this.loginPasswordError = 'Please enter your password.';
      return;
    }

    // Send a POST request to the server with the login data
    this.http.post('/api/login', this.loginForm.value).subscribe(
      response => {
        // Login was successful, handle response here
        this.loginForm.reset();
        // @ts-ignore
        let user_name = response['user_name'] as string;
        this.userService.loginStatus(true, user_name);
        this.loginHasBeenSubmitted = false;
        this.router.navigate(['/home']); // redirect to home page

      },
      error => {
        // Handle error here
        if (error.error.message === 'User does not exist.') {
          this.loginEmailError = 'No account found with this email address.';
        } else if (error.error.message === 'Incorrect password.') {
          this.loginPasswordError = 'Incorrect password.';
        }
      }
    );
  }
}
