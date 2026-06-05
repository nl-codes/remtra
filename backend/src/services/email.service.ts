import { Resend } from "resend";
import { env } from "../config/env.config.js";

export interface SendEmailParams {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
}

const resend = new Resend(env.RESEND_API_KEY);

const buildEmailContent = (html?: string, text?: string) => {
    if (html) {
        return text ? { html, text } : { html };
    }

    if (text) {
        return { text };
    }

    throw new Error("Email requires either html or text content.");
};

export const sendEmail = async ({
    to,
    subject,
    html,
    text,
}: SendEmailParams): Promise<string> => {
    const content = buildEmailContent(html, text);

    try {
        const { data, error } = await resend.emails.send({
            from: env.EMAIL_FROM,
            to,
            subject,
            ...content,
        });

        if (error) {
            console.error("Resend email failed:", error);
            throw new Error(error.message);
        }

        console.log("Resend email sent successfully:", data);

        return data?.id ?? "";
    } catch (error) {
        console.error("Unexpected email send error:", error);
        throw error;
    }
};
