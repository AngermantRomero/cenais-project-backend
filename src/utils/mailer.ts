import * as nodemailer from 'nodemailer';

export async function sendActivationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NOEMAILER_PORT,
    secure: process.env.NODEMAILER_SECURE,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  } as nodemailer.TransportOptions);
  const activationUrl = `${process.env.FRONTEND_URL}/auth/set-password?token=${token}`;

  await transporter.sendMail({
    from: `"Tu App" <${process.env.NODEMAILER_FROM_EMAIL}>`,
    to: email,
    subject: 'Activa tu cuenta',
    html: `
      <p>Hola,</p>
      <p>Gracias por registrarte. Haz clic en el siguiente enlace para activar tu cuenta:</p>
      <a href="${activationUrl}">Activar cuenta</a>
      <p>Este enlace expirará en 24 horas.</p>
    `,
  });
}
