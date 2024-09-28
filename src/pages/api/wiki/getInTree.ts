import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { WikiEntry } from "@prisma/client";

const secret = process.env.NEXT_PUBLIC_SECRET_TOKEN;

interface WikiTreeNode {
  id: string;
  label: string;
  content: string;
  children: WikiTreeNode[];
}

const buildTree = (
  entries: WikiEntry[],
  parentId: string | null = null
): WikiTreeNode[] => {
  return entries
    .filter((entry) => entry.parentId === parentId)
    .map((entry) => ({
      id: entry.id,
      label: entry.title,
      content: entry.content,
      children: buildTree(entries, entry.id),
    }));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(401).json({ error: true, message: "Unsupported method" });
  }

  const token = req.headers["x-token"];
  const cookie = getCookie(req, "DM_c");

  try {
    if (!token && !cookie) {
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized: Missing credentials" });
    }

    if (token) {
      const expectedToken = crypto
        .createHmac("sha256", secret)
        .update("getServerSideProps")
        .digest("hex");
      if (token !== expectedToken) {
        throw new Error("Invalid token");
      }

      const entries = await prisma.wikiEntry.findMany();
      const tree = buildTree(entries);
      return res.json(tree);
    }

    if (cookie) {
      const user = await prisma.cookies.findUnique({ where: { cookie } });
      if (!user || !(await checkRole("user", user.user))) {
        return res.status(401).json({
          error: true,
          message: "Unauthorized: Insufficient permissions",
        });
      }

      const entries = await prisma.wikiEntry.findMany();
      const tree = buildTree(entries);
      return res.json(tree);
    }
  } catch (error) {
    console.error("Authorization error:", error);
    return res
      .status(401)
      .json({ error: true, message: "Unauthorized: Invalid credentials" });
  }
}
