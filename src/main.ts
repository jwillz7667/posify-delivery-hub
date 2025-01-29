import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards';
import { PincodeMiddleware } from './common/middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Apply global authentication guard
  app.useGlobalGuards(new JwtAuthGuard());
  
  // Add middleware to protected routes
  app.use('/api/admin*', PincodeMiddleware);
  app.use('/api/settings*', PincodeMiddleware);
  
  await app.listen(3000);
}
bootstrap(); 