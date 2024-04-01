export interface DepartmentInterface {
  code: string;
  name: string;
  description?: string;
  hod?: DepartmentHeadInterface
  contact_email?: string;
  status?: string,
  parentId?: string
}

export interface DepartmentHeadInterface {
  id: string;
  name: string,
  email: string
}

export interface UpdateDepartmentInterface {
  id: string;
  department: updateDepartmentObj
}
export interface updateDepartmentObj {
  code?: string;
  name?: string;
  description?: string;
  contact_email?: string
  status?: string
  parentId?: string
}
