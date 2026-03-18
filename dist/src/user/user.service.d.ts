import { PrismaService } from './prisma.service';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUsers(): Promise<{
        name: string;
        email: string;
        password: string;
        phone: string;
        adress: string;
        role: import("@prisma/client").$Enums.Role;
        id_user: number;
    }[]>;
}
