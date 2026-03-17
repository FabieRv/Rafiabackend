import { AuthBody, CreateUser } from './auth.controller';
import { PrismaService } from 'src/user/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(authRegister: CreateUser): Promise<{
        name: string;
        email: string;
        phone: string;
        adress: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date | null;
        id_user: number;
    }>;
    login(authBody: AuthBody): Promise<{
        access_token: string;
    }>;
    private hashPassword;
    private isPasswordValid;
    private authenticateUser;
    changePassword(userId: number, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
}
