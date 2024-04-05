import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const JWT_SECRET =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcxMjE0NDI5OSwiZXhwIjoxNzEyMTQ3ODk5fQ.Uu1Kw5V8jt8sGbHJ1j1z-AS2VIaf6epAtS4YOmx3QLg";

export const createUser = async (req: Request, res: Response) => {
  const { nom, prenoms, email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await prisma.user.create({
      data: {
        nom,
        prenoms,
        email,
        username,
        password: hashedPassword,
      },
    });
    res.json({ message: "success" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la liste de tâches" });
  }
};

export const connectUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("access_connect", JSON.stringify(token), {
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 heure
    });

    res.json({
      message: "Connexion réussie",
      id: user.id,
      username: user.username,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la connexion de l'utilisateur" });
  }
};

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  try {
    // Vérifier le token
    const decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string };
    // Passer à l'étape suivante du middleware
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Accès non autorisé. Token invalide." });
  }
};
