import { Callback, Context, Handler } from 'aws-lambda'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import serverlessExpress from '@codegenie/serverless-express'
//import serverlessExpress from '@vendia/serverless-express';

async function bootstrap(): Promise<Handler> {
    const app = await NestFactory.create(AppModule)
    await app.init()

    const expressApp = app.getHttpAdapter().getInstance()
    return serverlessExpress({ app: expressApp })
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback
) => {
    let server: Handler
    server = server ?? (await bootstrap())
    console.log(JSON.stringify(event))
    console.log(JSON.stringify(context))
    /*if (!event.requestContext)
    event.requestContext = context;*/
    return server(event, context, callback)
}
