import { PeopleDto } from 'src/model/dto/people.dto'
import { HttpPeopleDto } from 'src/model/http/http.people.dto'
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { LambdaDto } from 'src/model/lambda/lambda.dto'

@Injectable()
export class TransformGetRequestPeople<T>
    implements NestInterceptor<string, LambdaDto>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<LambdaDto> {
        return next.handle().pipe(
            map((data) => {
                const modelEnglish = (data as LambdaDto).data as HttpPeopleDto
                const modelSpanish: PeopleDto = {
                    codigo: modelEnglish.id,
                    cumpleanios: modelEnglish.birth_year,
                    color_ojo: modelEnglish.eye_color,
                    peliculas: modelEnglish.films,
                    genero: modelEnglish.gender,
                    cabello_color: modelEnglish.hair_color,
                    talla: modelEnglish.height,
                    mundo: modelEnglish.homeworld,
                    peso: modelEnglish.mass,
                    nombre: modelEnglish.name,
                    piel_color: modelEnglish.skin_color,
                    creado: modelEnglish.created,
                    editado: modelEnglish.edited,
                    especies: modelEnglish.species,
                    naves: modelEnglish.starships,
                    url: modelEnglish.url,
                    vehiculos: modelEnglish.vehicles,
                }
                return { ...data, data: modelSpanish } as LambdaDto
            })
        )
    }
}

export class TransformPostResponsePeople<T>
    implements NestInterceptor<PeopleDto, LambdaDto>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<LambdaDto> {
        const modelSpanish = context.switchToHttp().getRequest()
            .body as PeopleDto

        const validateModelSpanish: PeopleDto = {
            codigo: '',
            cumpleanios: '',
            color_ojo: '',
            peliculas: [],
            genero: '',
            cabello_color: '',
            talla: '',
            mundo: '',
            peso: '',
            nombre: '',
            piel_color: '',
            creado: '',
            editado: '',
            especies: [],
            naves: [],
            url: '',
            vehiculos: [],
        }

        const arrModelSpanish = Object.keys(modelSpanish)
        const arrModelSpanishValidate = Object.keys(validateModelSpanish)
        let countItems = 0
        for (let i = 0; i < arrModelSpanish.length; i++) {
            if (
                arrModelSpanishValidate.find(
                    (element) => element == arrModelSpanish[i]
                )
            )
                countItems++
        }
        if (
            countItems !== arrModelSpanish.length ||
            arrModelSpanish.length !== arrModelSpanishValidate.length
        )
            throw new HttpException(
                `La información contiene un formato incorrecto`,
                HttpStatus.BAD_REQUEST
            )

        const modelEnglish: HttpPeopleDto = {
            id: modelSpanish.codigo,
            birth_year: modelSpanish.cumpleanios,
            eye_color: modelSpanish.color_ojo,
            films: modelSpanish.peliculas,
            gender: modelSpanish.genero,
            hair_color: modelSpanish.cabello_color,
            height: modelSpanish.talla,
            homeworld: modelSpanish.mundo,
            mass: modelSpanish.peso,
            name: modelSpanish.nombre,
            skin_color: modelSpanish.piel_color,
            created: modelSpanish.creado,
            edited: modelSpanish.editado,
            species: modelSpanish.especies,
            starships: modelSpanish.naves,
            url: modelSpanish.url,
            vehicles: modelSpanish.vehiculos,
        }
        context.switchToHttp().getRequest().body = modelEnglish

        return next.handle().pipe(
            map((data) => {
                const modelEnglish = (data as LambdaDto).data as HttpPeopleDto
                const modelSpanish: PeopleDto = {
                    codigo: modelEnglish.id,
                    cumpleanios: modelEnglish.birth_year,
                    color_ojo: modelEnglish.eye_color,
                    peliculas: modelEnglish.films,
                    genero: modelEnglish.gender,
                    cabello_color: modelEnglish.hair_color,
                    talla: modelEnglish.height,
                    mundo: modelEnglish.homeworld,
                    peso: modelEnglish.mass,
                    nombre: modelEnglish.name,
                    piel_color: modelEnglish.skin_color,
                    creado: modelEnglish.created,
                    editado: modelEnglish.edited,
                    especies: modelEnglish.species,
                    naves: modelEnglish.starships,
                    url: modelEnglish.url,
                    vehiculos: modelEnglish.vehicles,
                }
                return { ...data, data: modelSpanish } as LambdaDto
            })
        )
    }
}
