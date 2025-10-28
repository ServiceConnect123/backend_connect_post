import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { LocationsModule } from './modules/locations/locations.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { ConfigurationsModule } from './modules/configurations/configurations.module';
import { UtilsModule } from './modules/utils/utils.module';

@Module({
  imports: [AuthModule, PostsModule, LocationsModule, NavigationModule, ConfigurationsModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
