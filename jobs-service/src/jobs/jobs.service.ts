import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from './schemas/jobs.schema';
import { JobInterface } from './interface/jobs.interface';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private readonly jobModel: Model<Job>) {}

  async getAllJobs(): Promise<Job[]> {
    const jobs = await this.jobModel.find();
    return jobs;
  }

  filterAllJobsByStatus(status: string): Promise<Job[]> {
    return this.jobModel.find({ status });
  }

  findJobById(jobId: any): Promise<Job> {
    return this.jobModel.findOne({ _id: jobId }).exec();
  }

  findJobByFilter({ queryKey, queryValue }): Promise<Job> {
    const filter = { [queryKey]: queryValue };
    return this.jobModel.findOne(filter);
  }

  createJob(jobInterface: JobInterface): Promise<Job> {
    return this.jobModel.create(jobInterface);
  }

  findOneAndUpdate(filter: any, body: any): Promise<Job> {
    return this.jobModel.findOneAndUpdate(filter, body, { new: true });
  }

  findOneAndDelete(jobId: any): Promise<any> {
    return this.jobModel.findByIdAndDelete({ _id: jobId });
  }
}
