import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'Ausbildung Preparation Portal API',
      status: 'operational',
      version: '1.0.0',
      docs: '/api/v1/docs',
    };
  }
}
