import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  title: string = 'Register';
  registerSubmitted: boolean = false;
  showMessage: boolean = false;

  loading: boolean = false;
  messages: any = {
    success: null!,
    error: null!,
  };

  registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  sub: Subscription = new Subscription();

  get form() {
    return this.registerForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  handleRegister(): void {
    this.registerSubmitted = true;
    this.loading = true;

    if (this.registerForm.invalid) {
      return;
    }

    const body = {
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
    };

    this.sub.add(
      this.registerService
        .register(body.email, body.password)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.showMessage = true;
          })
        )
        .subscribe({
          next: () => {
            this.messages.success = "You've registered successfully.";
          },
          error: (err) => (this.messages.error = err),
        })
    );
  }

  handleCloseDialog(): void {
    this.showMessage = false;
    this.messages = {
      error: null!,
      success: null!,
    };
  }

  getErrorMessage(control: AbstractControl, name: string): string {
    if (control.hasError('required')) {
      return `${name} is required.`;
    }
    if (control.hasError('email')) {
      return `${name} is not a valid email address.`;
    }
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength');
      return `${name} must be at least ${minLength.requiredLength} characters long.`;
    }
    return '';
  }
}
