import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('audio')
export class AudioProcessor {
  private readonly logger = new Logger(AudioProcessor.name);

  @Process('transcode')
  handleTranscode(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }

  @Process('addJob')
  handleAddJob(job: Job<{ foo: string }>) {
    this.logger.debug('Start addJob...');
    this.logger.debug(job.data);
    this.logger.debug('addJob completed');
  }
}
