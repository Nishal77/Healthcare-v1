import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { DataSourceOptions, LogLevel } from 'typeorm';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { PatientsModule } from './modules/patients/patients.module';
import { UsersModule } from './modules/users/users.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { MedicalRecordsModule } from './modules/medical-records/medical-records.module';
import { HealthSyncModule } from './modules/health-sync/health-sync.module';
import { FoodLogModule } from './modules/food-log/food-log.module';

@Module({
  imports: [
    // ─── Config ──────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal:    true,
      load:        [appConfig, databaseConfig, jwtConfig],
      envFilePath: '.env',
    }),

    // ─── Database ────────────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): DataSourceOptions => {
        const isDev = config.get('app.nodeEnv') === 'development';
        const url   = config.get<string | undefined>('database.url');

        const logging: LogLevel[] = isDev ? ['query', 'error'] : ['error'];

        const shared = {
          type:             'postgres' as const,
          autoLoadEntities: true,
          // HIPAA: Never use synchronize in production — use migrations.
          synchronize: isDev,
          logging,
        };

        if (url) {
          // Supabase / any DATABASE_URL — SSL required by Supabase
          return {
            ...shared,
            url,
            ssl: { rejectUnauthorized: false },
          };
        }

        // Local dev fallback (individual host/port/db vars)
        return {
          ...shared,
          host:     config.get<string>('database.host'),
          port:     config.get<number>('database.port'),
          database: config.get<string>('database.name'),
          username: config.get<string>('database.user'),
          password: config.get<string>('database.password'),
          ssl:      config.get<boolean>('database.ssl') ? { rejectUnauthorized: false } : false,
        };
      },
    }),

    // ─── Rate limiting (HIPAA: prevent brute-force on auth endpoints) ────
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl:   config.get<number>('app.throttleTtl',   60) * 1_000,
          limit: config.get<number>('app.throttleLimit', 100),
        },
      ],
    }),

    // ─── Feature modules ─────────────────────────────────────────────────
    EmailModule,
    AuditLogModule,
    AuthModule,
    UsersModule,
    PatientsModule,
    AppointmentsModule,
    MedicalRecordsModule,
    HealthSyncModule,
    FoodLogModule,
  ],
})
export class AppModule {}
