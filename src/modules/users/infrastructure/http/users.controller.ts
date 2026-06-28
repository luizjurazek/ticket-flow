import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@/shared/http/http-status';
import { CreateUserUseCase } from '@/modules/users/application/create-user/create-user.usecase';
import { UpdateUserUseCase } from '@/modules/users/application/update-user/update-user.usecase';
import { GetUsersUseCase } from '@/modules/users/application/get-users/get-users.usecase';
import { GetUserByIdUseCase } from '@/modules/users/application/get-user-by-id/get-user-by-id.usecase';
import { DeleteUserUseCase } from '@/modules/users/application/delete-user/delete-user.usecase';
import { UserOutputDTO } from '@/modules/users/application/dtos/user-output.dto';
import { CreateUserInputDTO } from '@/modules/users/infrastructure/http/dtos/create-user-input.dto';
import { UpdateUserInputDTO } from './dtos/update-user-input.dto';

import { ApiRoute, ApiOperation, ApiResponse, ApiBody, ApiParams, ApiTags } from '@swagger/decorators';

@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @ApiRoute({
    method: 'post',
    path: '/users',
  })
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user with the given name and email',
  })
  @ApiResponse({
    statusCode: HttpStatus.CREATED,
    description: 'User created successfully',
    type: UserOutputDTO,
  })
  @ApiBody({
    type: CreateUserInputDTO,
    description: 'User data',
  })
  async create(req: Request, res: Response): Promise<Response | void> {
    const { name, email } = req.body;
    const user = await this.createUserUseCase.execute({ name, email });
    return res.status(HttpStatus.CREATED).json(user);
  }

  @ApiRoute({
    method: 'get',
    path: '/users/{id}',
  })
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Gets a user by their ID',
  })
  @ApiResponse({
    statusCode: HttpStatus.OK,
    description: 'User found successfully',
    type: UserOutputDTO,
  })
  @ApiParams({
    name: 'id',
    in: 'path',
    description: 'User ID',
    required: true,
    type: 'string',
  })
  async findById(req: Request, res: Response): Promise<Response | void> {
    const user = await this.getUserByIdUseCase.execute(req.params.id as string);
    return res.status(HttpStatus.OK).json(user);
  }

  @ApiRoute({
    method: 'get',
    path: '/users',
  })
  @ApiOperation({
    summary: 'Get all users',
    description: 'Gets all users',
  })
  @ApiResponse({
    statusCode: HttpStatus.OK,
    description: 'Users found successfully',
    type: UserOutputDTO,
    isArray: true,
  })
  async findAll(req: Request, res: Response): Promise<Response | void> {
    const users = await this.getUsersUseCase.execute();
    return res.status(HttpStatus.OK).json(users);
  }

  @ApiRoute({
    method: 'put',
    path: '/users/{id}',
  })
  @ApiOperation({
    summary: 'Update a user',
    description: 'Updates a user by their ID',
  })
  @ApiResponse({
    statusCode: HttpStatus.OK,
    description: 'User updated successfully',
    type: UserOutputDTO,
  })
  @ApiBody({
    type: UpdateUserInputDTO,
    description: 'User data',
  })
  async update(req: Request, res: Response): Promise<Response | void> {
    const { name, email } = req.body;
    const user = await this.updateUserUseCase.execute(req.params.id as string, { name, email });
    return res.status(HttpStatus.OK).json(user);
  }

  @ApiRoute({
    method: 'delete',
    path: '/users/{id}',
  })
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Deletes a user by their ID',
  })
  @ApiResponse({
    statusCode: HttpStatus.NO_CONTENT,
    description: 'User deleted successfully',
  })
  @ApiParams({
    name: 'id',
    in: 'path',
    description: 'User ID',
    required: true,
    type: 'string',
  })
  async delete(req: Request, res: Response): Promise<Response | void> {
    await this.deleteUserUseCase.execute(req.params.id as string);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
