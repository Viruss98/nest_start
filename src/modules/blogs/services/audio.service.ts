import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class AudioService {
  constructor(@InjectQueue('audio') private audioQueue: Queue) {}
  async addJob() {
    const job = await this.audioQueue.add(
      'addJob',
      {
        foo: 'bar',
      },
      { delay: 20000, removeOnComplete: true, timeout: 5000 },
    );
    return job;
  }

  async transcode() {
    await this.audioQueue.add('transcode', {
      file: 'audio.mp3',
    });
  }
}
