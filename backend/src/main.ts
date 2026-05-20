import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://future-platform-indol.vercel.app',
      'https://future-platform-pro.vercel.app',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const swagger = new DocumentBuilder()
    .setTitle('Future Platform')
    .setDescription(`Future Platform APIs documentation`)
    .addBearerAuth()
    .setVersion('1.0')
    .addTag('App', 'General endpoints')
    .addTag('Users', 'User management and authentication')
    .addTag('Students', 'Student management')
    .addTag('Instructors', 'Instructor management')
    .addTag('Courses', 'Course management')
    .addTag('Enrollments', 'Course enrollment management')
    .addTag('Grades', 'Grade management')
    .addTag('Assign Course', 'Assigning courses to instructors')
    .build();
  const document = SwaggerModule.createDocument(app, swagger);

  SwaggerModule.setup('api-docs', app, document);
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server is listening on port: ${port}`);
}
bootstrap();
