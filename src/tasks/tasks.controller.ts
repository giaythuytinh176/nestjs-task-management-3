import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { DeleteResult } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(
        private tasksService: TasksService,
    ) {

    }

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(
            `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
                filterDto,
            )}`,
        );
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById (
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Patch('/:id')
    updateStatusTaskById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User,
    ) {
        return this.tasksService.updateStatusTaskById(id, status, user);
    }

    @Post()
    createTask(
        @Body(ValidationPipe) createTaskDto: CreateTaskDTO,
        @GetUser() user: User,
    ) {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    async deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<DeleteResult> {
        this.logger.verbose(
            `User "${user.username}" deleting a task. Data: ${JSON.stringify({
                id: id,
            })}`,
        );
        // return this.tasksService.deleteTaskById(id);
        return this.tasksService.deleteTask(id, user);
    }
}
