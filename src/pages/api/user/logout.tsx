import { getCookie } from '@/utils/cookies';
import prisma from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


/**
 * @returns Deletes the Cookie of the User from the Database
 */
export default async function handler(req : NextApiRequest, res : NextApiResponse) {
  if (req.method === 'GET') {
    const cookie = getCookie(req, "DM_c");
    if (!cookie) {
      return res.status(200).end();
    }
    const user = await prisma.cookies.findUnique({
      where: { cookie },
    });

    if (!user) {
      return res.status(200).end();
    }  
    
    await prisma.cookies.deleteMany({
      where: {
          user: user.user
      }
    });
      return res.status(200).end();
  } else {
  return res.status(200).end();
  }
}
