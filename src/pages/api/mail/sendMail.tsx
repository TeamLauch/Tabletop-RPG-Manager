import nodemailer from 'nodemailer';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

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
    if (req.method != "POST") {
        return res.status(401).json({ error: true, message: "Unsupported method" });
    }

    try {
        let { to, subject, html } = req.body;
        let toEmail: any = to.toLowerCase()
        let user = prisma.user.findFirst({
            where: {
                email: toEmail,
            }
        })
        if (!user) {
            return res.status(500).json({ error: true, message: "No User" })
        }
        sendMail(to, subject, html);
        return res.status(200).json({ error: false, message: "success" })
    } catch (e) {
        return res.status(500).json({ error: true, message: { e } })
    }
}




