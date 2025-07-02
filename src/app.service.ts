
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    someProtectedRoute() {
        return 'This is a protected route';
    }
}