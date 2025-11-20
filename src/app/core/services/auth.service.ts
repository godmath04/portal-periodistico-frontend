import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/auth'; // URL del backend
  private tokenKey = 'auth_token';

  // BehaviorSubject para manejar el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Realiza el login del usuario
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // Guardar el token en localStorage
        this.setToken(response.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Obtiene el token almacenado
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Guarda el token en localStorage
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Verifica si existe un token
   */
  private hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isLoggedIn(): boolean {
    return this.hasToken();
  }
}
