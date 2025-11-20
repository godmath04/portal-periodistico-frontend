import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  credentials: LoginRequest = {
    username: '',
    password: '',
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';

    // Validación básica
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Por favor ingresa usuario y contraseña';
      return;
    }

    // Llamar al servicio de autenticación
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        // Redirigir al dashboard después del login
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.errorMessage = 'Usuario o contraseña incorrectos';
      },
    });
  }
}
