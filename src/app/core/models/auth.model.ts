export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  techInterests?: string[];
}

export interface JwtPayload {
  sub: string; // user id
  name: string;
  email: string;
  iat: number; // issued at
  exp: number; // expires at
}
