import { PeopleDto } from 'src/model/dto/people.dto'
import { HttpPeopleDto } from 'src/model/http/http.people.dto'

export type PeopleType = PeopleDto | HttpPeopleDto
