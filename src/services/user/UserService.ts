import { PrismaClient, Role } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

interface CreateUserRequest { name: string; email: string; password?: string; number: string; analfabeto?: boolean; }
interface DeleteUserRequest { userId: number; currentUserId: number; }
interface AuthUserRequest { email: string; password?: string; }
interface UpdateUserRequest { userId: number; currentUserId: number; name?: string; email?: string; number?: string; password?: string; role?: Role; }
interface RoleSelectionRequest { userId: number; roleSelection: string; }

export class UserService {

    async create({ email, name, password, number, analfabeto }: CreateUserRequest) {
        if (!email) throw new Error("Email incorrect");
        if (!number) throw new Error("Number cannot be empty");
        if (!/^\d{10,11}$/.test(number)) throw new Error("O número de telefone deve ter 10 ou 11 dígitos.");
        if (!password) throw new Error("Password is required");

        if (await prisma.user.findUnique({ where: { email } })) throw new Error("User already exists with this email");
        if (await prisma.user.findUnique({ where: { number } })) throw new Error("User already exists with this number");

        const passwordHash = await hash(password, 8);

        return await prisma.user.create({
            data: { name, email, role: Role.CLIENT, passwordHash, number, analfabeto: analfabeto ?? false },
            select: { id: true, email: true, role: true, name: true, number: true, analfabeto: true },
        });
    }

    async delete({ userId, currentUserId }: DeleteUserRequest) {
        if (!userId) throw new Error("User ID is required");

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { services: true, comments: true, ratings: true },
        });

        if (!user) throw new Error("User not found");

        if (currentUserId !== userId) {
            const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
            if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPPORT")) {
                throw new Error("Only the user or an admin/support can delete this user");
            }
        }

        if (user.services.length > 0 || user.comments.length > 0 || user.ratings.length > 0) {
            throw new Error("Cannot delete user with associated services, comments, or ratings");
        }

        await prisma.user.delete({ where: { id: userId } });
        return { message: "User deleted successfully" };
    }

    async auth({ email, password }: AuthUserRequest) {
        if (!password) throw new Error("Password is required");

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("User/password incorrect");

        const passwordMatch = await compare(password, user.passwordHash);
        if (!passwordMatch) throw new Error("User/password incorrect");

        const token = sign(
            { name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { subject: String(user.id), expiresIn: "30d" }
        );

        return { id: user.id, name: user.name, email: user.email, role: user.role, token };
    }

    async detail(userId: number) {
        return await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, number: true, analfabeto: true },
        });
    }

    async getDetailedProfile(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                services: { include: { serviceDetails: true, ratings: true, subcategory: true } },
                comments: { include: { subcomments: true } },
                ratings: true,
            },
        });

        if (!user) throw new Error("Usuário não encontrado");

        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async update({ userId, name, email, number, password, role, currentUserId }: UpdateUserRequest) {
        if (!name && !email && !number && !password && !role) {
            throw new Error("At least one field must be provided to update");
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        if (currentUserId !== userId) {
            const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
            if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPPORT")) {
                throw new Error("Only the user or an admin/support can update this user");
            }
        }

        if (email && email !== user.email) {
            if (await prisma.user.findUnique({ where: { email } })) throw new Error("Email already exists");
        }

        if (number && number !== user.number) {
            if (await prisma.user.findUnique({ where: { number } })) throw new Error("Phone number already exists");
        }

        const updateData: any = { name, email, number };
        if (password) updateData.passwordHash = await hash(password, 8);

        if (role && currentUserId) {
            const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
            if (currentUser && (currentUser.role === "ADMIN" || currentUser.role === "SUPPORT")) {
                updateData.role = role;
            }
        }

        return await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, name: true, email: true, number: true, role: true, createdAt: true, updatedAt: true },
        });
    }
    async requestProviderRole({ userId, roleSelection }: RoleSelectionRequest) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        let newRole: Role = Role.CLIENT;

        if (roleSelection === 'PROVIDER') newRole = Role.PROVIDERAWAIT;
        else if (roleSelection !== 'CLIENT') throw new Error('Invalid role selection');

        return await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
            select: { id: true, email: true, role: true, name: true, number: true },
        });
    }

    async approveProvider(userId: number) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');
        if (user.role !== Role.PROVIDERAWAIT) throw new Error('User is not awaiting approval');

        return await prisma.user.update({
            where: { id: userId },
            data: { role: Role.PROVIDER },
            select: { id: true, email: true, role: true, name: true, number: true },
        });
    }

    async getByRole(role: Role) {
        return await prisma.user.findMany({
            where: { role },
            select: { id: true, name: true, email: true, role: true, number: true }
        });
    }
}