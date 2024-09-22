import { ApiProperty } from '@nestjs/swagger'

export class PeopleSwagger {
    @ApiProperty()
    codigo: string
    @ApiProperty()
    cumpleanios: string
    @ApiProperty()
    color_ojo: string
    @ApiProperty()
    peliculas: string[]
    @ApiProperty()
    genero: string
    @ApiProperty()
    cabello_color: string
    @ApiProperty()
    talla: string
    @ApiProperty()
    mundo: string
    @ApiProperty()
    peso: string
    @ApiProperty()
    nombre: string
    @ApiProperty()
    piel_color: string
    @ApiProperty()
    creado: string
    @ApiProperty()
    editado: string
    @ApiProperty()
    especies: string[]
    @ApiProperty()
    naves: string[]
    @ApiProperty()
    url: string
    @ApiProperty()
    vehiculos: string[]
}
