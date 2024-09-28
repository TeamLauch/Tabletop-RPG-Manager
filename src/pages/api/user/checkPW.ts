import { PrismaClient } from "@prisma/client";
const bcrypt = require("bcrypt");
import { setCookie } from "@/utils/cookies";
// MiliSeconds, Seconds, Minutes, Hours
const validTil = 1000 * 60 * 60 * 10;

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

/**
 * @returns Checks whether a Password is Valid and if it is performs a login for the user
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let { username, password } = req.body;
    username = username.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(200).json({ error: "Ungültiger Benutzername" });
    }

    if (!user.activated) {
      return res.status(200).json({ error: "Deaktivierter Benutzer" });
    }

    const passwordMatch = await bcrypt.compare(password, user.pw);

    if (!passwordMatch) {
      return res.status(200).json({ error: "Ungültiges Passwort" });
    }

    const cookie = await prisma.cookies.create({
      data: {
        user: user.username,
        validTill: new Date(Date.now() + validTil),
      },
    });

    setCookie(res, "DM_c", cookie.cookie, { path: "/", maxAge: validTil });
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}
