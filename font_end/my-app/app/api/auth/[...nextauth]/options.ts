import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

// import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
    // CredentialsProvider({
    //   credentials: {
    //     emai: { label: "Nom d'utilisateur", type: "text" },
    //     password: { label: "Mot de passe", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     const { email, password }: any = credentials;

    //     // Vérifier si l'utilisateur existe
    //     const user = await prisma.user.findUnique({
    //       where: {
    //         email: email,
    //       },
    //     });

    //     if (!user) {
    //       // Créer un nouvel utilisateur
    //       const hashedPassword = await bcrypt.hash(password, 10);

    //       const newUser = await prisma.user.create({
    //         data: {
    //           email,
    //           password: hashedPassword,
    //         },
    //       });

    //       return newUser;
    //     } else {
    //       // Vérifier le mot de passe
    //       const passwordMatch = await bcrypt.compare(password, user.password);

    //       if (passwordMatch) {
    //         return user;
    //       } else {
    //         return null;
    //       }
    //     }
    //   },
    // }),
  ],
};
