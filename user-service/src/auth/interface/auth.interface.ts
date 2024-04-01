export interface EmailSignUp {
  email: string;
  name: string;
}

export interface AuthSignUp {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  status: string;
  token: string;
  password: string;
}

export interface AuthSignIn {
  userName: string;
  email: string;
  password: string;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  password: string;
  token: string;
}
