import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  
  async create(createUserDto: CreateUserDto) {
    const { tenantId, ...userData } = createUserDto;

    return this.prisma.user.create({
      data: {
        ...userData,
        tenant: {
          connect: { id: tenantId },
        },
      },
    });
  }

  
  async findAll() {
    return this.prisma.user.findMany();
  }

  
  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  
  async update(id: number, updateUserDto: UpdateUserDto) {
    const { tenantId, ...userData } = updateUserDto;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(tenantId && {
          tenant: {
            connect: { id: tenantId },
          },
        }),
      },
    });
  }

  
  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}