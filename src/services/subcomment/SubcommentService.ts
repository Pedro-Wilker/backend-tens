import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateSubcommentRequest { commentId: number; userId: number; text: string; }
interface UpdateSubcommentRequest { subcommentId: number; userId: number; text: string; }
interface DeleteSubcommentRequest { subcommentId: number; userId: number; }

export class SubcommentService {
  
  async create({ commentId, userId, text }: CreateSubcommentRequest) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error("Parent comment not found");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    return await prisma.subcomment.create({
      data: { commentId, userId, text },
      select: { id: true, commentId: true, userId: true, text: true, createdAt: true, updatedAt: true },
    });
  }

  async listByComment(commentId: number) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error("Parent comment not found");

    return await prisma.subcomment.findMany({
      where: { commentId },
      select: {
        id: true, text: true, createdAt: true, updatedAt: true,
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async update({ subcommentId, text, userId }: UpdateSubcommentRequest) {
    if (!subcommentId) throw new Error("Subcomment ID is required");
    if (!text) throw new Error("Subcomment text is required");

    const subcomment = await prisma.subcomment.findUnique({ where: { id: subcommentId } });
    if (!subcomment) throw new Error("Subcomment not found");

    if (subcomment.userId !== userId) {
      throw new Error("Only the subcomment author can update this subcomment");
    }

    return await prisma.subcomment.update({
      where: { id: subcommentId },
      data: { text },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async delete({ subcommentId, userId }: DeleteSubcommentRequest) {
    const subcomment = await prisma.subcomment.findUnique({ where: { id: subcommentId } });
    
    if (!subcomment) throw new Error("Subcomment not found");
    if (subcomment.userId !== userId) throw new Error("Only the subcomment author can delete this subcomment");

    await prisma.subcomment.delete({ where: { id: subcommentId } });
    return { message: "Subcomment deleted successfully" };
  }
}