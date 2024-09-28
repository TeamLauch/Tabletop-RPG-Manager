const bcrypt = require("bcrypt");
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/prisma";
import axios from 'axios';
import nodemailer from 'nodemailer';
import { User } from '@prisma/client';
import { HOSTNAME } from '@/utils/constants';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const sendMail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') {
        return res.status(405).json({ error: true, message: "Method Not Allowed" })
    }
    let { username } = req.body;
    username = username.toLowerCase();

    const user = await prisma.user.findUnique({
        where: { username: username },
    });
    if (!user) {
        return res.status(200).json({ error: true, message: "Username not found" });
    }

    if(!user.email){
        return res.status(200).json({ error: true, message: "No Mail found" });
    }

    const token = await prisma.registerTokens.create({
        data: {
            validTill: new Date(Date.now()+(1000 * 60 * 60)),
            userId: user.username,
        }
    });

    try {

        if (user.email == '') {
            return res.status(501).json({ error: true, message: 'User has no email in database' })
        }
        const to = user.email;
        if (to == null) {
            return res.status(501).json({ error: true, message: 'User has no email in database' })
        }
        const subject = 'Passwort zurückgesetzt'
        const html = '<h1>Dein Link zum zurücksetzen deines Passworts</h1><br><br><p>'+ HOSTNAME + '/resetPassword/'+ token.id + '</p>'
        sendMail(to, subject, html);
        return res.status(200).json({ error: false, message: "success" })
    } catch (e) {
        return res.status(501).json({ error: true, message: "error while seinding email password successfully reverted" })
    }


}