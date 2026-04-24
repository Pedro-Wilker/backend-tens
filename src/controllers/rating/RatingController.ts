import { Request, Response } from 'express';
import { RatingService } from '../../services/rating/RatingService';

export class RatingController {
  private ratingService = new RatingService();

  async create(req: Request, res: Response) {
    const { serviceId, rating } = req.body;
    const userId = Number((req as any).user_id);

    try {
      const newRating = await this.ratingService.create({ serviceId: Number(serviceId), userId, rating });
      return res.status(201).json(newRating);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async detail(req: Request, res: Response) {
    const serviceId = Number(req.params.serviceId);
    
    try {
      const ratingDetails = await this.ratingService.detail(serviceId);
      return res.status(200).json(ratingDetails);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}