import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import httpPeopleData from './data/peopleEnglish.json';
import responsePeople from './data/peopleSpanish.json';
import { HttpPeopleDto } from '../../src/model/http/http.people.dto';
import { LambdaDto } from '../../src/model/lambda/lambda.dto';
import axios from 'axios';
import { DynamoDB } from '../../src/providers/database/dynamodb.service';

jest.mock('axios');

const configuration = async (dataAxios: any = null, fnCreate: any = jest.fn(), fnFindOne: any = jest.fn()) => {
  if (dataAxios) {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockResolvedValue({ data: dataAxios });
  }

  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).overrideProvider(DynamoDB)
    .useValue({
      create: fnCreate,
      findOne: fnFindOne
    }).compile();
  return module;
}


describe('Get People Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
  });
  it('should get people when it is not recorded in database', async () => {
    const idPeople = "1";
    const dataAxios: HttpPeopleDto = { ...httpPeopleData, id: idPeople };
    const dataResponse = { ...responsePeople, codigo: idPeople };
    const fnFindOne = jest.fn(() => undefined);
    const valueExpected: LambdaDto = {
      code: HttpStatus.OK,
      message: "OK",
      data: dataResponse
    }

    app = (await configuration(dataAxios, jest.fn(), fnFindOne)).createNestApplication();
    await app.init();

    return request(app.getHttpServer())
      .get(`/people/${idPeople}`)
      .expect(200)
      .expect(valueExpected);
  });


  it('should get people when it is recorded in database', async () => {
    const idPeople = "1";
    const dataAxios: HttpPeopleDto = { ...httpPeopleData, id: idPeople };
    const dataResponse = { ...responsePeople, codigo: idPeople };
    const fnFindOne = jest.fn().mockReturnValue(dataAxios);
    const valueExpected: LambdaDto = {
      code: HttpStatus.OK,
      message: "OK",
      data: dataResponse
    }

    app = (await configuration(dataAxios, jest.fn(), fnFindOne)).createNestApplication();
    await app.init();

    return request(app.getHttpServer())
      .get(`/people/${idPeople}`)
      .expect(200)
      .expect(valueExpected);
  });

  it('should show invalid parameter', async () => {
    const idPeople = "1";
    const idPeopleInvalid = "ar2";
    const dataAxios: HttpPeopleDto = { ...httpPeopleData, id: idPeople };
    const fnFindOne = jest.fn().mockReturnValue(dataAxios);
    const errorResponse = { code: HttpStatus.BAD_REQUEST, message: `El parámetro ${idPeopleInvalid} no es válido` }


    app = (await configuration(dataAxios, jest.fn(), fnFindOne)).createNestApplication();
    await app.init();

    return request(app.getHttpServer())
      .get(`/people/${idPeopleInvalid}`)
      .expect(HttpStatus.BAD_REQUEST)
      .expect(errorResponse);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

});




describe('Save People Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
  });

  it('should record people in database', async () => {
    const idPeople = "2";
    const dataResponse = { ...responsePeople, codigo: idPeople };
    const fnFindOne = jest.fn().mockReturnValue(undefined);
    const fnCreate = jest.fn();
    const valueExpected: LambdaDto = {
      code: HttpStatus.CREATED,
      message: "OK",
      data: dataResponse
    }

    app = (await configuration(undefined, fnFindOne, fnCreate)).createNestApplication();
    await app.init();

    return request(app.getHttpServer())
      .post(`/people`)
      .send(dataResponse)
      .expect(HttpStatus.CREATED)
      .expect(valueExpected);
  });


  it('should show existing people validation message when creating', async () => {
    const idPeople = "2";
    const dataRequest = { ...responsePeople, codigo: idPeople };
    const dataAxios: HttpPeopleDto = { ...httpPeopleData, id: idPeople };
    const errorResponse = { code: HttpStatus.BAD_REQUEST, message: `El registro con el id ${idPeople} ya se encuentra registrado` }
    const fnFindOne = jest.fn().mockReturnValue(dataAxios);
    const fnCreate = jest.fn();
    app = (await configuration(undefined, fnCreate, fnFindOne)).createNestApplication();
    await app.init();

    return request(app.getHttpServer())
      .post(`/people`)
      .send(dataRequest)
      .expect(HttpStatus.BAD_REQUEST).expect(errorResponse)
  });

  it('should show invalid request', async () => {
    const idPeople = "2";
    const dataRequest = { ...responsePeople, codigo: idPeople, badField: "bad field" };
    const dataAxios = { ...httpPeopleData, id: idPeople };
    const errorResponse = { code: HttpStatus.BAD_REQUEST, message: `La información contiene un formato incorrecto` }
    const fnFindOne = jest.fn().mockReturnValue(dataAxios);
    const fnCreate = jest.fn();
    app = (await configuration(undefined, fnCreate, fnFindOne)).createNestApplication();
    await app.init();

    return request(app.getHttpServer())
      .post(`/people`)
      .send(dataRequest)
      .expect(HttpStatus.BAD_REQUEST).expect(errorResponse)
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

});