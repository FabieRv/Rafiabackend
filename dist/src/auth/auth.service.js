"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../user/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        console.log('JWT SERVICE READY');
    }
    async register(authRegister) {
        const { name, email, password, phone, adress } = authRegister;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                name,
                email,
                adress,
                phone,
                password: hashedPassword,
            },
        });
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
    async login(authBody) {
        const { email, password } = authBody;
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException("l'utilisateur n'existe pas");
        }
        const isValid = await this.isPasswordValid(password, existingUser.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('le mot de pass est invalide');
        }
        return this.authenticateUser({
            userId: existingUser.id,
        });
    }
    async hashPassword(password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }
    async isPasswordValid(password, hashedPassword) {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        return isPasswordValid;
    }
    async authenticateUser({ userId }) {
        const payload = { sub: userId };
        return {
            access_token: await this.jwtService.sign(payload),
        };
    }
    async changePassword(userId, oldPassword, newPassword) {
        try {
            console.log('USER ID:', userId);
            console.log('OLD:', oldPassword);
            console.log('NEW:', newPassword);
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            console.log('USER FOUND:', user);
            if (!user)
                throw new Error('Utilisateur non trouvé');
            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
            console.log('OLD PASSWORD VALID:', isOldPasswordValid);
            if (!isOldPasswordValid)
                throw new Error('Ancien mot de passe incorrect');
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await this.prisma.user.update({
                where: { id: userId },
                data: { password: hashedNewPassword },
            });
            return { message: 'Mot de passe changé avec succès' };
        }
        catch (error) {
            console.error('CHANGE PASSWORD ERROR:', error);
            throw error;
        }
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('Email non trouvé');
        const token = this.jwtService.sign({ userId: user.id }, { expiresIn: '15m' });
        const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;
        console.log('Lien de réinitialisation :', resetLink);
        return { message: 'Lien de réinitialisation envoyé à votre email' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map