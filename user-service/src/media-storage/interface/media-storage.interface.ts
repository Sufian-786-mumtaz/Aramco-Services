
export class UserInterface {
  id: string;
  email: string;
  name: string;
  sourceId: string;
}

export interface NewMediaStorageInterface {
  fileName: string;
  description?: string;
  url: string;
  user: UserInterface;
  departmentIds: string[];
  status?: string,
  isShareAi?: string
}

export interface UpdateMediaStorageInterface {
  id: string
  fileName: string;
  description?: string;
  url: string;
  user?: UserInterface;
  departmentIds: string[];
  status?: string,
  isShareAi?: string
}
