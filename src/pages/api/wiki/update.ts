import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const secret = process.env.NEXT_PUBLIC_SECRET_TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(401).json({ error: true, message: "Unsupported method" });
  }

  // Verify token presence and validity
  const token = req.headers["x-token"];

  try {
    const cookie = getCookie(req, "DM_c");
    if (!cookie) {
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized invalid Cookie" });
    }
    const user = await prisma.cookies.findUnique({
      where: { cookie },
    });

    if (!user || !(await checkRole("editor", user.user))) {
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized no Permission" });
    }

    const { title, content, id, parentId } = req.body;
    const entry = await prisma.wikiEntry.update({
      where: { id: id },
      data: {
        title,
        content,
        updatedBy: user.user,
        updatedAt: new Date(),
        parentId: parentId || null,
      },
    });
    res.status(200).json(entry);
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }
}
