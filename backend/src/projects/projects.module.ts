import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
    providers: [ProjectsService, PrismaService],
    exports: [ProjectsService],
    controllers: [ProjectsController],
})
export class ProjectsModule { }
