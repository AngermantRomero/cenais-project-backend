import * as nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT),
    secure: process.env.NODEMAILER_SECURE === 'true',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  } as nodemailer.TransportOptions);
}

async function sendEmail(to: string, subject: string, htmlContent: string) {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Tu App" <${process.env.NODEMAILER_FROM_EMAIL}>`,
    to,
    subject,
    html: htmlContent,
  });
}

export async function sendActivationEmail(email: string, token: string) {
  const activationUrl = `${process.env.FRONTEND_URL}/auth/set-password?token=${token}`;
  const html = `
    <p>Hola,</p>
    <p>Gracias por registrarte. Haz clic en el siguiente enlace para activar tu cuenta:</p>
    <a href="${activationUrl}">Activar cuenta</a>
    <p>Este enlace expirará en 24 horas.</p>
  `;
  await sendEmail(email, 'Activa tu cuenta', html);
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetUrl = `${process.env.FRONTEND_URL}/auth/set-password?token=${token}`;
  const html = `
    <p>Hola,</p>
    <p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p>
    <a href="${resetUrl}">Cambiar contraseña</a>
    <p>Este enlace expirará en 24 horas.</p>
  `;
  await sendEmail(email, 'Cambio de contraseña', html);
}
