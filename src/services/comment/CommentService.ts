import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateCommentRequest { serviceId: number; userId: number; text: string; }
interface UpdateCommentRequest { commentId: number; userId: number; text: string; }
interface DeleteCommentRequest { commentId: number; userId: number; }

export class CommentService {
  
  async create({ serviceId, userId, text }: CreateCommentRequest) {
    if (!userId) throw new Error('Invalid userId');
    
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new Error('Service not found');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    return await prisma.comment.create({
      data: { serviceId, userId, text },
      select: { id: true, serviceId: true, userId: true, text: true, createdAt: true },
    });
  }

  async listByService(serviceId: number) {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new Error("Service not found");

    return await prisma.comment.findMany({
      where: { serviceId },
      select: {
        id: true, text: true, createdAt: true,
        user: { select: { id: true, name: true } },
        subcomments: {
          select: {
            id: true, text: true, createdAt: true,
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async update({ commentId, text, userId }: UpdateCommentRequest) {
    if (!commentId) throw new Error("Comment ID is required");
    if (!text) throw new Error("Comment text is required");

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== userId) {
      throw new Error("Only the comment author can update this comment");
    }

    return await prisma.comment.update({
      where: { id: commentId },
      data: { text },
      include: {
        user: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
    });
  }

  async delete({ commentId, userId }: DeleteCommentRequest) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { subcomments: true },
    });

    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== userId) throw new Error("Only the comment author can delete this comment");
    
    if (comment.subcomments.length > 0) {
      throw new Error("Cannot delete comment with associated subcomments");
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return { message: "Comment deleted successfully" };
  }
}