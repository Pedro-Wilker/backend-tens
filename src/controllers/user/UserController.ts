import { Request, Response } from 'express';
import { UserService } from '../../services/user/UserService';
import { Role } from '@prisma/client';

interface AuthRequest extends Request {
    user_id?: string;
}

export class UserController {
  private userService = new UserService();

  async create(req: Request, res: Response) {
    const { name, password, email, number, analfabeto } = req.body;
    const user = await this.userService.create({ email, name, password, number, analfabeto });
    return res.status(201).json(user);
  }

  async delete(req: AuthRequest, res: Response) {
    const userId = Number(req.params.userId);
    const currentUserId = Number(req.user_id);
    if (!currentUserId) return res.status(401).json({ error: "User not authenticated" });

    const result = await this.userService.delete({ userId, currentUserId });
    return res.status(200).json(result);
  }

  async auth(req: Request, res: Response) {
    const { email, password } = req.body;
    const auth = await this.userService.auth({ email, password });
    return res.json(auth);
  }

  async detail(req: AuthRequest, res: Response) {
    const userId = Number(req.user_id);
    const user = await this.userService.detail(userId);
    return res.json(user);
  }

  async getDetailedProfile(req: AuthRequest, res: Response) {
    const userId = Number(req.user_id);
    const user = await this.userService.getDetailedProfile(userId);
    return res.json(user);
  }

  async update(req: AuthRequest, res: Response) {
    const userId = Number(req.params.userId);
    const currentUserId = Number(req.user_id);
    const { name, email, number, password, role } = req.body;

    if (!currentUserId) return res.status(401).json({ error: "User not authenticated" });

    const updatedUser = await this.userService.update({
      userId, currentUserId, name, email, number, password, role
    });
    return res.status(200).json(updatedUser);
  }

  async requestProviderRole(req: Request, res: Response) {
    const { userId, roleSelection } = req.body;
    if (!userId || isNaN(Number(userId))) return res.status(400).json({ error: 'Invalid User ID' });

    const user = await this.userService.requestProviderRole({ userId: Number(userId), roleSelection });
    return res.status(200).json(user);
  }

  async approveProvider(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    const approvedProvider = await this.userService.approveProvider(userId);
    return res.json(approvedProvider);
  }

  async getByRole(req: Request, res: Response) {
    const role = req.params.role as Role;
    const users = await this.userService.getByRole(role);
    return res.json(users);
  }

  async listProviderAwait(req: Request, res: Response) {
    const providersAwait = await this.userService.getByRole(Role.PROVIDERAWAIT);
    return res.json(providersAwait);
  }
}