import { Component, inject } from '@angular/core';
import { LoginService } from '../../servicios/login.service';
import { Login } from './modelos/login.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;


  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) return;
    this.isLoading = true;
  this.errorMessage = null;


    this.loginService.login(this.form.value).subscribe({
      next: () => {
        this.isLoading = false;
        console.log('¡Login exitoso!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error de login', err);
        this.errorMessage = err?.error?.error || 'Error desconocido al iniciar sesión.';
      }
    });
  }
}
