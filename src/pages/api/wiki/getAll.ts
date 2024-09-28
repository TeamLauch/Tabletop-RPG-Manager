import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { cors, runMiddleware } from "@/utils/cors";

const secret = process.env.NEXT_PUBLIC_SECRET_TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // await runMiddleware(req, res, cors);
  if (req.method !== "GET") {
    return res.status(401).json({ error: true, message: "Unsupported method" });
  }

  // Verify token presence and validity
  const token = req.headers["x-token"];
  const cookie = getCookie(req, "DM_c");

  try {
    if (!token && !cookie) {
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized: Missing credentials" });
    }

    if (token) {
      // First, check if token is valid
      const expectedToken = crypto
        .createHmac("sha256", secret)
        .update("getServerSideProps")
        .digest("hex");
      if (token !== expectedToken) {
        throw new Error("Invalid token");
      }

      // Token is valid, proceed with fetching data
      const entries = await prisma.wikiEntry.findMany();
      return res.json(entries);
    }

    // If token is not present but cookie is, check user role
    if (cookie) {
      const user = await prisma.cookies.findUnique({ where: { cookie } });
      if (!user || !(await checkRole("user", user.user))) {
        return res.status(401).json({
          error: true,
          message: "Unauthorized: Insufficient permissions",
        });
      }

      // Cookie and user are valid, proceed with fetching data
      const entries = await prisma.wikiEntry.findMany();
      return res.json(entries);
    }
  } catch (error) {
    console.error("Authorization error:", error);
    return res
      .status(401)
      .json({ error: true, message: "Unauthorized: Invalid credentials" });
  }
}
