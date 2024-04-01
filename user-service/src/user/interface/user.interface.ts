export interface NewUserInterface {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  password: string;
  role: string;
  department: string;
}

export interface UpdateUserInterface {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  role: string;
  department: string;
}
