import { AuthService } from './auth.service';
export type AuthBody = {
    email: string;
    password: string;
};
export type CreateUser = {
    name: string;
    email: string;
    phone: string;
    adress: string;
    password: string;
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(authRegister: CreateUser): Promise<{
        name: string;
        email: string;
        phone: string;
        adress: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date | null;
        id: number;
    }>;
    login(authBody: AuthBody): Promise<{
        access_token: string;
    }>;
    authenticated(): Promise<void>;
}
