import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
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
    return res.status(401).json({ error: "Sessão ou token não encontrados" });
  }

  try {
    const payload = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    (req as any).user_id = payload.sub;

    return next();
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}