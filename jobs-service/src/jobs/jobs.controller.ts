import { Controller, HttpStatus } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  Job,
  JobInterface,
  UpdateJobInterface,
} from './interface/jobs.interface';
import handleErrorException from '@errorException/error.exception';
import {
  JOB_NOT_FOUND,
  NO_JOBS_FOUND,
  SOMETHING_WENT_WRONG_TRY_AGAIN,
} from '@constants/error.contant';
import { JOB_DELETION_SUCCESS } from '@constants/messages.contant';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @MessagePattern('getAllJobs')
  async getAllCreatedJobs(): Promise<Job[]> {
    return await handleErrorException(async () => {
      const jobs = await this.jobsService.getAllJobs();
      if (!jobs) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: NO_JOBS_FOUND,
        };
      }

      return {
        status: HttpStatus.OK,
        data: { jobs },
      };
    });
  }

  @MessagePattern('findJobsByFilter')
  async findJobsByFilter(filter: any): Promise<Job[]> {
    return await handleErrorException(async () => {
      const jobs = await this.jobsService.findJobByFilter(filter);

      if (!jobs) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: NO_JOBS_FOUND,
        };
      }

      return {
        status: HttpStatus.OK,
        data: { jobs },
      };
    });
  }

  @MessagePattern('getJobById')
  async findJobById(JobId: any): Promise<Job> {
    return await handleErrorException(async () => {
      const job = await this.jobsService.findJobById(JobId);
      if (!job) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: NO_JOBS_FOUND,
        };
      }

      return {
        status: HttpStatus.OK,
        data: { job },
      };
    });
  }

  @MessagePattern('createJob')
  async createNewJob(jobInterface: JobInterface): Promise<any> {
    return await handleErrorException(async () => {
      const job = await this.jobsService.createJob(jobInterface);

      if (!job) {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: SOMETHING_WENT_WRONG_TRY_AGAIN,
        };
      }

      return {
        status: HttpStatus.CREATED,
        data: job,
      };
    });
  }

  @MessagePattern('updateJob')
  async findJobByIdAndUpate(
    updateJobInterface: UpdateJobInterface,
  ): Promise<Job> {
    return await handleErrorException(async () => {
      const jobExist = await this.jobsService.findJobById(
        updateJobInterface?.jobId,
      );

      if (!jobExist) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: JOB_NOT_FOUND,
        };
      }
      const updatedJob = await this.jobsService.findOneAndUpdate(
        { _id: updateJobInterface?.jobId },
        {
          status: updateJobInterface?.status,
          outputs: updateJobInterface?.outputs,
        },
      );

      if (!updatedJob) {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: SOMETHING_WENT_WRONG_TRY_AGAIN,
        };
      }

      return {
        status: HttpStatus.OK,
        // message: JOB_UPDATE_SUCCESS,
        data: updatedJob,
      };
    });
  }

  @MessagePattern('deleteJob')
  async findJobByIdAndDelete(JobId: any): Promise<any> {
    return await handleErrorException(async () => {
      const jobExist = await this.jobsService.findJobById(JobId);

      if (!jobExist) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: JOB_NOT_FOUND,
        };
      }

      const deleteJob = await this.jobsService.findOneAndDelete(JobId);

      if (!deleteJob) {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: SOMETHING_WENT_WRONG_TRY_AGAIN,
        };
      }

      return {
        status: HttpStatus.OK,
        message: JOB_DELETION_SUCCESS,
      };
    });
  }
}
