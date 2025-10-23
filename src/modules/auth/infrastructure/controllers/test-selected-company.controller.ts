import { Controller, Put, Body, UseGuards, Request } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../../../shared/infrastructure/guards/supabase-auth.guard';

@Controller('test-selected-company')
export class TestSelectedCompanyController {

  @Put('test')
  @UseGuards(SupabaseAuthGuard)
  async testEndpoint(@Request() req: any, @Body() body: any) {
    return {
      message: 'Test endpoint working',
      user: req.user?.email,
      body
    };
  }

  @Put('simple')
  async simpleTest(@Body() body: any) {
    return {
      message: 'Simple test working',
      body
    };
  }
}
