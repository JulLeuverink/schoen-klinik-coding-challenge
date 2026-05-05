import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AnamneseModule } from './anamnese/anamnese.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    MongooseModule.forRoot('mongodb://mongo:27017/anamnesedb'),
    AnamneseModule,
    AuditModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
