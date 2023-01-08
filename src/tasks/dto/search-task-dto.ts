import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TASKSTATUS } from '../task-status-enum';

export class SearchTaskDto {
  @IsOptional()
  @IsEnum(TASKSTATUS)
  status?: TASKSTATUS;

  @IsOptional()
  @IsString()
  search?: string;
}
