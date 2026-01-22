
export interface User{
    id : number;
    username :string;
    email : string;
    firstName? : string;
    lastName? : string;
    roles: string[];
}

export interface AuthResponse {
    accesToken : string;
    tokenType : string;
    userId : number;
    username : string;
    roles : string[];
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
    username : string;
    password : string;
}