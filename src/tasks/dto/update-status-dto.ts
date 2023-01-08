import { IsEnum } from 'class-validator';
import { TASKSTATUS } from '../task-status-enum';

export class UpdateStatusDto {
  @IsEnum(TASKSTATUS)
  status: TASKSTATUS;
}
