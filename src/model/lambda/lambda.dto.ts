import { PeopleType } from 'src/common/types/people.type'

export type LambdaDto = {
    code: number
    message: string
    data: PeopleType
}
