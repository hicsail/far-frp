import { Module } from '@nestjs/common';
import { GrantsController } from './grants.controller';

@Module({
  controllers: [GrantsController]
})
export class GrantsModule {}
