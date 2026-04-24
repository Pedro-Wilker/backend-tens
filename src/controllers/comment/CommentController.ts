import { Request, Response } from 'express';
import { CommentService } from '../../services/comment/CommentService';

export class CommentController {
  private commentService = new CommentService();

  async create(req: Request, res: Response) {
    const { serviceId, text } = req.body;
    const userId = Number(req.user_id);

    if (!userId) return res.status(401).json({ error: 'User not authenticated' });

    try {
      const newComment = await this.commentService.create({ serviceId: Number(serviceId), userId, text });
      return res.status(201).json(newComment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    const serviceId = Number(req.params.serviceId);
    
    try {
      const comments = await this.commentService.listByService(serviceId);
      return res.json(comments);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    const commentId = Number(req.params.commentId);
    const { text } = req.body;
    const userId = Number(req.user_id);

    if (!userId) return res.status(401).json({ error: "User not authenticated" });

    try {
      const updatedComment = await this.commentService.update({ commentId, text, userId });
      return res.status(200).json(updatedComment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    const commentId = Number(req.params.commentId);
    const userId = Number(req.user_id);

    if (!userId) return res.status(401).json({ error: "User not authenticated" });

    try {
      const result = await this.commentService.delete({ commentId, userId });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}