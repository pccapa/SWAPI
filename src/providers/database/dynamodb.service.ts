import { Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import 'dotenv/config'
import { HttpPeopleDto } from 'src/model/http/http.people.dto'

@Injectable()
export class DynamoDB {
    private dynamodb: AWS.DynamoDB.DocumentClient = null

    constructor() {
        this.dynamodb = new AWS.DynamoDB.DocumentClient({
            region: process.env.region,
            //endpoint: process.env.endPointLocal,
        })
    }

    async create(httpPeopleDto: HttpPeopleDto) {
        await this.dynamodb
            .put({
                TableName: process.env.tableName,
                Item: httpPeopleDto,
            })
            .promise()
    }

    async findOne(id: string): Promise<HttpPeopleDto | undefined> {
        const result = await this.dynamodb
            .get({
                TableName: process.env.tableName,
                Key: { id: String(id) },
            })
            .promise()
        if (result.Item === undefined || Object.keys(result.Item).length == 0)
            return undefined
        return result.Item as HttpPeopleDto
    }
}
