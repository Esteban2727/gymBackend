/* import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EmailQueueProcessor } from './email-Queue.processor';
import { MailService } from '../mail/mail.service';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [EmailQueueProcessor, MailService],
  exports: [BullModule],
})
export class EmailQueueModule {}
 */