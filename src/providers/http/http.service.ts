import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { HttpPeopleDto } from '../../model/http/http.people.dto'
import 'dotenv/config'

@Injectable()
export class Swapi {
    async getPeople(id: string): Promise<HttpPeopleDto> {
        const response = await axios.get<HttpPeopleDto>(
            `${process.env.domainStartwars}/api/people/${id}`
        )
        return response.data
    }
}
