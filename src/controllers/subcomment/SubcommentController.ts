import { Request, Response } from 'express';
import { SubcommentService } from '../../services/subcomment/SubcommentService';

interface AuthRequest extends Request {
  user_id?: string;
}

export class SubcommentController {
  private subcommentService = new SubcommentService();

  async create(req: AuthRequest, res: Response) {
    const commentId = Number(req.params.commentId);
    const { text } = req.body;
    const userId = Number(req.user_id);

    if (!userId) return res.status(401).json({ error: "User not authenticated" });

    try {
      const subcomment = await this.subcommentService.create({ commentId, userId, text });
      return res.status(201).json(subcomment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    const commentId = Number(req.params.commentId);

    try {
      const subcomments = await this.subcommentService.listByComment(commentId);
      return res.status(200).json(subcomments);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response) {
    const subcommentId = Number(req.params.subcommentId);
    const { text } = req.body;
    const userId = Number(req.user_id);

    if (!userId) return res.status(401).json({ error: "User not authenticated" });

    try {
      const updatedSubcomment = await this.subcommentService.update({ subcommentId, text, userId });
      return res.status(200).json(updatedSubcomment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    const subcommentId = Number(req.params.subcommentId);
    const userId = Number(req.user_id);

    if (!userId) return res.status(401).json({ error: "User not authenticated" });

    try {
      const result = await this.subcommentService.delete({ subcommentId, userId });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}