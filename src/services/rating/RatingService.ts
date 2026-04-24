import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateRatingRequest { serviceId: number; userId: number; rating: number; }

export class RatingService {
  
  async create({ serviceId, userId, rating }: CreateRatingRequest) {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new Error('Service not found');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const existingRating = await prisma.rating.findFirst({
      where: { serviceId, userId }
    });

    if (existingRating) throw new Error('You have already rated this service');
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');

    return await prisma.rating.create({
      data: { serviceId, userId, rating },
      select: { id: true, serviceId: true, userId: true, rating: true, createdAt: true },
    });
  }

  async detail(serviceId: number) {
    const serviceRatings = await prisma.rating.findMany({
      where: { serviceId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    if (serviceRatings.length === 0) {
      return { serviceRatings: [], serviceAverageRating: 0 };
    }

    const totalRatings = serviceRatings.length;
    const sumRatings = serviceRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    return {
      serviceRatings,
      serviceAverageRating: parseFloat(averageRating.toFixed(2))
    };
  }
}