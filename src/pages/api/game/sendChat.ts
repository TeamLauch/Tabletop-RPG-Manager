import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission GAMEMASTER
 * @returns UPDATES a GAME
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
    const { chat, gameId } = req.body;

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

    if (!chat) {
        return res.status(200).json({ error: true, message: "Invalid ID" });
    }
    const game: any = await prisma.game.findUnique({
        where: {
            id: gameId,
        },
    });

    let users = [];
    for (let data of game.playerData) {
        if (!users.includes(data.owner)) {
            users.push(data.owner);
        }
    }

    if (
        !users.includes(user.username) &&
        game.gamemaster != user.username &&
        !game.gamemasters.includes(user.username)
    ) {
        return res
            .status(200)
            .json({ error: true, message: "Not part of Game" });
    }

    chat["from"] = user.username;
    chat["type"] = "chat";

    await prisma.game.update({
        data: {
            ...game,
            roleplayData: [...game.roleplayData, chat],
        },
        where: {
            id: gameId,
        },
    });
    return res.status(200).json({ error: false, message: "success" });
}
