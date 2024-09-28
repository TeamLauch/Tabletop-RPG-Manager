const bcrypt = require("bcrypt");
import { getCookie } from "@/utils/cookies";
// MiliSeconds, Seconds, Minutes, Hours

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
/**
 * @permission User
 * @returns Changes Password
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method == "POST") {
    let { token, newPassword } = req.body;
    const t = await prisma.registerTokens.findUnique({
        where: {
            id: token
        },
        include: {
            user: true
        }
    })
    if(!t || !t.user || t.validTill < new Date(Date.now())){  
        if(t && t.validTill < new Date(Date.now())){
            await prisma.registerTokens.delete({
                where:{
                    id: t.id
                }
            });
        }
      return res.status(200).json({ error: true, message: "INVALID TOKEN" });
    }
    let salt = bcrypt.genSaltSync(10);
    let pw = bcrypt.hashSync(newPassword, salt);

    await prisma.user.update({
    where: {
          username: t.user.username,
        },
        data: {
          pw: pw,
          updatedBy: "ResetSystem",
        },
      });
      await prisma.registerTokens.delete({
        where:{
            id: t.id
        }
      });
      return res.status(200).json({ error: false, message: "success" });
  } else {
    return res.status(405).end();
  }
}
