export interface NewRoleInterface {
  name: string;
  description?: string;
}

export interface UpdateRoleInterface {
  id: string
  roles: NewRoleInterface
}
