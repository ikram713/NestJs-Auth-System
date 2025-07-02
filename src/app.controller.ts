import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { AuthGuard } from './guards/auth.guard';
@UseGuards(AuthGuard)
@Controller()
export class AppController {

    constructor(private readonly appService: AppService) {}

    @Get()
    someProtectedRoute(@Req() req){
        return {message : 'This is a protected route', userId: req.userId};
    }

}