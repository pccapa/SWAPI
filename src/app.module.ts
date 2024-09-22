import { Module } from '@nestjs/common'
//import { AppController } from './app.controller';
import { AppService } from './app.service'
import { DynamoDB } from './providers/database/dynamodb.service'
import { Swapi } from './providers/http/http.service'
import { AppController } from './app.controller'

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, DynamoDB, Swapi],
})
export class AppModule {}
