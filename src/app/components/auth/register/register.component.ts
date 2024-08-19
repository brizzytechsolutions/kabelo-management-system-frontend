import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid && this.registerForm.value.password === this.registerForm.value.confirmPassword) {
      const { username, password } = this.registerForm.value;
      
      this.authService.register(username, password).subscribe({
        next: () => {
          this.router.navigate(['/login']);
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
        complete: () => {
          console.info('Registration completed');
        }
      });
    } else {
      this.errorMessage = 'Passwords do not match';
    }
  }  

  resetForm() {
    this.registerForm.reset();
  }
}
