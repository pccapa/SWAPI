import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
    HttpException,
    HttpStatus,
} from '@nestjs/common'
import { PeopleDto } from 'src/model/dto/people.dto'

@Injectable()
export class ValidationIdPeople implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (isNaN(value))
            throw new HttpException(
                `El parámetro ${value} no es válido`,
                HttpStatus.BAD_REQUEST
            )
        return value
    }
}
