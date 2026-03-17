import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    const qb = this.repo.createQueryBuilder('user').where('user.email = :email', { email });

    if (includePassword) qb.addSelect('user.passwordHash');

    return qb.getOne();
  }

  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role?: User['role'];
  }): Promise<User> {
    const existing = await this.findByEmail(data.email);
    if (existing) throw new ConflictException('Email already registered');

    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async updateRefreshToken(id: string, hash: string | null): Promise<void> {
    await this.repo.update(id, { refreshTokenHash: hash ?? undefined });
  }
}
