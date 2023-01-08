import { Injectable, NotFoundException } from '@nestjs/common';
import { TASKSTATUS } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { SearchTaskDto } from './dto/search-task-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Like, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTasks(searchTaskDto: SearchTaskDto, user: User): Promise<Task[]> {
    const { search, status } = searchTaskDto;

    const tasksQuery = await this.taskRepository.createQueryBuilder('task');
    tasksQuery.where({ user });

    if (status) {
      tasksQuery.andWhere('task.status = :status', { status });
    }

    if (search) {
      tasksQuery.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return await tasksQuery.getMany();
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    if (id) {
      const targetTask = await this.taskRepository.findOneBy({
        id,
        user,
      });
      if (!targetTask) {
        throw new NotFoundException(`getTaskById id ${id} not found`);
      }
      return targetTask;
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<void> {
    const { title, description } = createTaskDto;
    try {
      await this.taskRepository.insert({
        title,
        description,
        status: TASKSTATUS.OPEN,
        user,
      });
    } catch (error) {
      throw new Error(`${error} createTask err`);
    }
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    try {
      const { affected } = await this.taskRepository.delete({ id, user });
      if (affected <= 0) {
        console.log('no record deleted =>', affected);
      }
    } catch (error) {
      throw new Error(`${error} deleteTaskById err`);
    }
  }

  async updataTaskById(
    id: string,
    status: TASKSTATUS,
    user: User,
  ): Promise<void> {
    try {
      const task = await this.getTaskById(id, user);
      task.status = status;
      await this.taskRepository.save(task);
    } catch (error) {
      throw new Error(`${error} updataTaskById err`);
    }
  }
}
