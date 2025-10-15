import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { LocationsModule } from './modules/locations/locations.module';

@Module({
  imports: [AuthModule, PostsModule, LocationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
