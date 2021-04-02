import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { DeleteResult } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    private logger = new Logger('TasksService');
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {
        
    }

    async updateStatusTaskById(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);

        task.status = status;
        await task.save();
        return task;
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ id: id, userId: user.id });

        this.logger.verbose(
            `User "${user.username}" retrieving one task. ${found}`,
        );

        if (!found) {
            throw new NotFoundException(`Task with ${id} not found.`)
        }

        return found;
    }

    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }
    
    createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTask(id: number, user: User): Promise<DeleteResult> {
        const result = await this.taskRepository.delete({
            id: id,
            userId: user.id,
        });

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return result;
    }

}

