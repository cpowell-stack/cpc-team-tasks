import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Default to Gmail for now, or use env var
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export async function sendEmail({
    to,
    subject,
    text,
    html,
}: {
    to: string;
    subject: string;
    text: string;
    html?: string;
}) {
    if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
        console.log("Email credentials missing. Skipping email send.");
        console.log({ to, subject, text });
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_SERVER_USER,
            to,
            subject,
            text,
            html,
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
