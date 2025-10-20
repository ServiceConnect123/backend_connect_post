import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { LocationsModule } from './modules/locations/locations.module';
import { NavigationModule } from './modules/navigation/navigation.module';

@Module({
  imports: [AuthModule, PostsModule, LocationsModule, NavigationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
