import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { SearchTaskDto } from './dto/search-task-dto';
import { UpdateStatusDto } from './dto/update-status-dto';
import { TASKSTATUS } from './task-status-enum';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query() searchTaskDto: SearchTaskDto, @GetUser() user: User) {
    return this.tasksService.getTasks(searchTaskDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  updataTaskById(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @GetUser() user: User,
  ) {
    const { status } = updateStatusDto;
    return this.tasksService.updataTaskById(id, status, user);
  }
}
