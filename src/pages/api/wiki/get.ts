import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: true, message: "Method not allowed" });
  }

  const cookie = getCookie(req, "DM_c");

  const { id } = req.query;

  if (typeof id !== "string") {
    return res
      .status(400)
      .json({ error: true, message: "Invalid ID parameter" });
  }

  let user:
    | {
        pw: string;
        username: string;
        email: string;
        roles: string;
        canUpload: boolean;
        activated: boolean;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
      }
    | undefined = undefined;

  if (cookie) {
    user = await checkCookie(cookie);
  }

  if (!user || !(await checkRoleUser("user", user))) {
    return res.status(403).json({
      error: true,
      message: cookie
        ? "Unauthorized: invalid cookie"
        : "Unauthorized: no permission",
    });
  }

  try {
    const entry = await prisma.wikiEntry.findUnique({ where: { id: id } });
    if (!entry) {
      return res.status(404).json({ error: true, message: "Entry not found" });
    }
    return res.status(200).json(entry);
  } catch (error) {
    console.error("Database error:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}
