import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

export function isAdminOrSupport(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;
  const sessionCookie = req.cookies.session;
  
  let token: string | undefined;

  if (authToken) {
    const [, bearerToken] = authToken.split(" ");
    token = bearerToken;
  } else if (sessionCookie) {
    token = sessionCookie;
  }

  if (!token) {
    return res.status(401).json({ error: "Sessão ou token não fornecidos" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado no .env");
    }

    const payload = verify(token, process.env.JWT_SECRET) as JwtPayload;

    if (!payload.role || typeof payload.role !== "string") {
      return res.status(401).json({
        error: "Role não encontrada ou inválida no token",
        message: "O token deve conter uma role válida (ADMIN, SUPPORT, etc.).",
      });
    }

    const role = payload.role;

    if (role === "ADMIN" || role === "SUPPORT") {
      return next();
    } else {
      return res.status(403).json({
        error: "Acesso não autorizado",
        message: "Somente usuários com role ADMIN ou SUPPORT têm permissão.",
      });
    }
  } catch (err) {
    console.error("Erro ao verificar token em isAdminOrSupport:", err);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}