import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission USER
 * @returns Sends Chats of User
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method != "POST") {
        return res
            .status(401)
            .json({ error: true, message: "Unsupported method" });
    }

    const { gameId } = req.body;
    if (!gameId) {
        return res
            .status(200)
            .json({ error: true, message: "Invalid Data provided" });
    }

    const game: any = await prisma.game.findUnique({
        where: {
            id: gameId,
        },
    });

    if (!game) {
        return res.status(200).json({ error: true, message: "Invalid Game" });
    }
    const cookie = getCookie(req, "DM_c");

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
        return res.status(200).json({
            error: true,
            message: cookie
                ? "Unauthorized invalid Cookie"
                : "Unauthorized no Permission",
        });
    }

    let chats = [];
    for (let data of game.roleplayData) {
        if (
            data.type == "chat" &&
            (data.to.includes(user.username) || data.from == user.username)
        ) {
            chats.push(data);
        }
    }

    return res
        .status(200)
        .json({ chats: chats, error: false, message: "sucess" });
}
