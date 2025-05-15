import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from '../mail/mail.service';

@Processor('email')
export class EmailQueueProcessor extends WorkerHost {
  constructor(private readonly emailService: MailService) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { to, subject, body } = job.data;
    await this.emailService.sendEmail(to, subject, body);
  }
}
