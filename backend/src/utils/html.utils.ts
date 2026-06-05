export const getResetPasswordHTML = (
    username: string,
    resetPasswordURL: string,
) => {
    const html = `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password</title>
        <style>
            body {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #0F172A;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }

            table,
            td {
                border-collapse: collapse;
            }
        </style>
    </head>

    <body style="background-color: #0F172A; margin: 0; padding: 0;">

        <table width="100%" border="0" cellspacing="0" cellpadding="0"
            style="background-color: #0F172A; min-height: 100vh;">
            <tr>
                <td align="center" valign="top" style="padding: 80px 20px;">

                    <table width="100%" border="0" cellspacing="0" cellpadding="0"
                        style="max-width: 600px; background-color: #0F172A;">

                        <tr>
                            <td align="center" style="padding-bottom: 31px;">
                                <img src="https://res.cloudinary.com/duhbs7hqv/image/upload/v1780571330/Logo_peuttw.png"
                                    alt="Logo" width="100px" height="100px"
                                    style="display: block; width: 100px; height: 100px; border: 0; object-fit: fill;" />
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding-bottom: 31px;">
                                <h1 style="color: #F8FAFC; font-size: 24px; font-weight: normal; margin: 0;">
                                    Reset Your Password
                                </h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 10px 10px 10px; color: #F8FAFC; font-size: 18px; text-align: left;">
                                Hi ${username},
                            </td>
                        </tr>

                        <tr>
                            <td
                                style="padding: 0 10px 40px 10px; color: #F8FAFC; font-size: 18px; line-height: 1.5; text-align: left;">
                                You are receiving this email because we received a request to reset the password to your
                                account.
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 0 10px 15px 10px; color: #F8FAFC; font-size: 18px;">
                                Tap the button below to reset your password:
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding-bottom: 40px;">
                                <table border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center" bgcolor="#EAB308" style="border-radius: 10px;">
                                            <a href="${resetPasswordURL}" target="_blank"
                                                style="display: inline-block; background-color: #EAB308; color: #0F172A; font-size: 24px; font-weight: normal; text-decoration: none; padding: 12px 32px; border-radius: 10px; border: 1px solid #EAB308;">
                                                Reset Your Password
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 10px 10px 10px; color: #F8FAFC; font-size: 18px; text-align: left;">
                                Or copy and paste the link below in your browser:
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 10px 60px 10px; text-align: left; word-break: break-all;">
                                <a href="${resetPasswordURL}" target="_blank"
                                    style="color: #EAB308; font-size: 18px; text-decoration: underline;">
                                    ${resetPasswordURL}
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td align="center"
                                style="border-top: 1px solid #1E293B; padding-top: 30px; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                                If you did not request for this, you can ignore this email. <br />
                                &copy; 2026 RemTra. All rights reserved.
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>

    </html>

    `;

    const text = `
    Hi ${username},

    You are receiving this email because we received a request to reset the password to your account.

    Please copy and paste the link below into your browser to reset your password:
    ${resetPasswordURL}

    If you did not request this, you can ignore this email. Your password will remain unchanged.

    © 2026 RemTra. All rights reserved.
        `.trim();

    return { html, text };
};
