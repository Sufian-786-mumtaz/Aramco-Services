export interface Job {
  title: string;
  description: string;
  submissionDate: string;
  platform: string;
}

export class JobUserInterface {
  id: string;
  email: string;
  name: string;
  sourceId: string;
}

export class ArtifactsInterface {
  type: string;
  url: string;
}

export class JobInterface {
  description: string;
  submissionDate?: string;
  outputs: string[];
  status?: string;
  user: JobUserInterface;
  artifacts: ArtifactsInterface[];
}

export interface UpdateJobInterface {
  jobId: string;
  status: string;
  outputs: string[];
}
