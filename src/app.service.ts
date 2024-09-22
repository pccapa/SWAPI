import {
    HttpException,
    HttpStatus,
    Injectable,
    UseInterceptors,
} from '@nestjs/common'
import { DynamoDB } from './providers/database/dynamodb.service'
import { Swapi } from './providers/http/http.service'
import 'dotenv/config'
import { HttpPeopleDto } from './model/http/http.people.dto'

@Injectable()
export class AppService {
    constructor(
        private database: DynamoDB,
        private http: Swapi
    ) {}

    async getPeople(id: string): Promise<HttpPeopleDto> {
        let people = await this.database.findOne(id)
        if (!people) {
            people = await this.http.getPeople(id)
            people = { ...people, id }
            await this.database.create(people)
        }
        return people
    }

    async createPeople(httpPeopleDto: HttpPeopleDto): Promise<HttpPeopleDto> {
        let people = await this.database.findOne(httpPeopleDto.id)
        if (people)
            throw new HttpException(
                `El registro con el id ${httpPeopleDto.id} ya se encuentra registrado`,
                HttpStatus.BAD_REQUEST
            )
        await this.database.create(httpPeopleDto)
        return httpPeopleDto
    }
}
