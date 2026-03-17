import { UserService } from './user.service';
export declare class UserController {
    private readonly UserService;
    constructor(UserService: UserService);
    getUsers(): Promise<{
        name: string;
        email: string;
        password: string;
        phone: string;
        adress: string;
        role: import("@prisma/client").$Enums.Role;
        id_user: number;
    }[]>;
    getUser(userId: string): Promise<{
        name: string;
        email: string;
        password: string;
        phone: string;
        adress: string;
        role: import("@prisma/client").$Enums.Role;
        id_user: number;
    }[]>;
    getProfile(): string;
}
