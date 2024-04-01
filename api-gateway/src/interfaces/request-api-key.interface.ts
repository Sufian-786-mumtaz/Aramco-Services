import { Request } from 'express';

export interface RequestWithApiKeyAndOrganizationId extends Request {
  apiKey: string;
  organizationId: string;
}
