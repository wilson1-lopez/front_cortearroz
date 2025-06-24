export interface AuthTokenPayload {
    sub: number;
    nombre: string;
    email: string;
    exp: number;
    iat: number;
    // puedes agregar más campos si tu token los tiene
  }
  