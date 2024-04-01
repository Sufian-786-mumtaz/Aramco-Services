import { AuthGuard } from '@guards/auth/auth.guard';
import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Inject,
    Post,
    Res,
    Get,
    UseGuards,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { RolesDto, UpdateRolesDto } from './dto/roles.dto';
import { Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';

@UseGuards(AuthGuard)
@Controller('roles')
export class RolesController {
    constructor(
        @Inject('USER_SERVICE')
        private readonly rolesService: ClientProxy,
    ) { }

    @Get('all')
    async getAllRoles(@Res() res: Response) {
        const response = await this.rolesService.send('getAllRoles', {}).toPromise();
        if (response?.status === HttpStatus.OK)
            return res.status(response?.status).send({ ...response?.data });
        throw new HttpException(response?.error, response?.status);
    }

    @Get(':id')
    async getRoleById(@Param('id') id: string, @Res() res: Response) {
        const response = await this.rolesService.send('getRoleById', id).toPromise();
        if (response?.status === HttpStatus.OK)
            return res.status(response?.status).send({ ...response?.data });
        throw new HttpException(response?.error, response?.status);
    }

    @Post('create')
    async createRole(@Body() rolesDto: RolesDto, @Res() res: Response) {
        const response = await this.rolesService
            .send('createRole', rolesDto)
            .toPromise();
        if (response?.status === HttpStatus.CREATED)
            return res.status(response?.status).send({ message: response?.message });
        throw new HttpException(response?.error, response?.status);
    }

    @Put(':id/update')
    async updateRole(
        @Param('id') id: string,
        @Body() roles: UpdateRolesDto,
        @Res() res: Response,
    ) {
        const response = await this.rolesService
            .send('updateRole', { id, roles })
            .toPromise();
        if (response?.status === HttpStatus.OK)
            return res.status(response?.status).send({ data: { ...response?.data, }, message: response?.message });
        throw new HttpException(response?.error, response?.status);
    }

    @Delete(':id/delete')
    async deleteRoles(@Param('id') id: string, @Res() res: Response) {
        const response = await this.rolesService.send('deleteRole', id).toPromise();
        if (response?.status === HttpStatus.OK)
            return res.status(response?.status).send({ message: response?.message });
        throw new HttpException(response?.error, response?.status);
    }
}
