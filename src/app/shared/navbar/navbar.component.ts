import { Component } from '@angular/core';
import { LoginService } from '../../servicios/login.service';
import { AuthTokenPayload } from '../../modelos/auth-token.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
AbrirMenu=false;
mantenimientoOpen = false;
  
 constructor(private loginService: LoginService, private router: Router) {}

abrirMenu(){
  this.AbrirMenu = !this.AbrirMenu;
}
toggleMantenimiento() {
  this.mantenimientoOpen = !this.mantenimientoOpen;
  //this.cortesOpen = false; // Cierra el otro si está abierto
}
 //nos traemos el nombre del usario desde el servicio de login
 public get nombreUsuario(): string | null {
  const usuario: AuthTokenPayload | null = this.loginService.getUsuarioAutenticado();
  return usuario ? usuario.nombre : null;
}

logout() {
  this.loginService.logout();
  // redirecciona con router.navigate añ el login cuando se cierre sesion 
  
}


}
