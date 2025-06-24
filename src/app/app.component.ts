import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { LoginService } from './servicios/login.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'front_cortearroz';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar si el usuario está autenticado al cargar la aplicación
    if (this.loginService.isLoggedIn()) {
      // Si está autenticado y está en la ruta raíz, redirigir al dashboard
      if (this.router.url === '/') {
        this.router.navigate(['/dashboard']);
      }
    }
  }
}
