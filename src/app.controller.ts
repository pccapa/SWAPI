import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common'
import { AppService } from './app.service'
import {
    TransformGetRequestPeople,
    TransformPostResponsePeople,
} from './common/transform/transform.people'
import { LambdaDto } from './model/lambda/lambda.dto'
import { HttpPeopleDto } from './model/http/http.people.dto'
import { PeopleType } from './common/types/people.type'
import { HttpExceptionFilter } from './common/exception/exception.filter'
import { ApiBody } from '@nestjs/swagger'
import { PeopleSwagger } from './common/swagger/people.swagger'
import { ValidationIdPeople } from './common/pipes/people.pipe'

@Controller('people')
@UseFilters(new HttpExceptionFilter())
export class AppController {
    constructor(private appService: AppService) {}

    @Get(':id')
    @UseInterceptors(TransformGetRequestPeople)
    async getPeople(
        @Param('id', ValidationIdPeople) id: string
    ): Promise<LambdaDto> {
        const people = await this.appService.getPeople(id)
        return { code: HttpStatus.OK, message: 'OK', data: people } as LambdaDto
    }

    @Post()
    @ApiBody({ type: PeopleSwagger })
    @UseInterceptors(TransformPostResponsePeople)
    async saveCreate(@Body() peopleDto: PeopleType): Promise<LambdaDto> {
        const people = await this.appService.createPeople(
            peopleDto as HttpPeopleDto
        )
        return {
            code: HttpStatus.CREATED,
            message: 'OK',
            data: people,
        } as LambdaDto
    }
}
