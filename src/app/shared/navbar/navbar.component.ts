import { Component } from '@angular/core';
import { LoginService } from '../../servicios/login.service';
import { AuthTokenPayload } from '../../modelos/auth-token.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  AbrirMenu = false;
  mantenimientoOpen = false;
  
  constructor(private loginService: LoginService, private router: Router) {}

  abrirMenu() {
    this.AbrirMenu = !this.AbrirMenu;
  }

  toggleMantenimiento() {
    this.mantenimientoOpen = !this.mantenimientoOpen;
  }

  // Verificar si el usuario está autenticado
  get isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  // Obtener el nombre del usuario desde el servicio de login
  get nombreUsuario(): string | null {
    const usuario: AuthTokenPayload | null = this.loginService.getUsuarioAutenticado();
    return usuario ? usuario.nombre : null;
  }

  logout() {
    this.loginService.logout();
  }
}
