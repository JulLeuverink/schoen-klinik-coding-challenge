import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AnamneseModule } from './anamnese/anamnese.module';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    MongooseModule.forRoot(process.env['MONGODB_URI'] ?? 'mongodb://mongo:27017/anamnesedb'),
    AnamneseModule,
    AuditModule,
    UserModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
