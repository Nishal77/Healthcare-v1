/**
 * EmailService
 *
 * Sends transactional OTP emails.
 *
 * HOW CREDENTIALS WORK:
 * ─────────────────────
 * Set EMAIL_USER = your Gmail address (e.g. you@gmail.com)
 * Set EMAIL_PASS = Gmail App Password  (16 chars, no spaces)
 *   → Google Account → Security → 2-Step Verification → App Passwords
 *
 * If EMAIL_USER / EMAIL_PASS are NOT set, the service falls back to
 * Ethereal (a free catch-all SMTP sandbox). The preview URL is logged
 * to the console so you can open the email in a browser.
 *
 * The raw OTP code is ALWAYS logged to the console in development so
 * you can copy it directly without needing to open any email.
 */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger  = new Logger(EmailService.name);
  private transporter!: Transporter;
  private etherealMode = false;

  constructor(private readonly config: ConfigService) {}

  // ── Startup ───────────────────────────────────────────────────────────────

  async onModuleInit() {
    const emailUser = this.config.get<string>('EMAIL_USER');
    const emailPass = this.config.get<string>('EMAIL_PASS');

    if (emailUser && emailPass) {
      // ── Real Gmail SMTP (App Password) ───────────────────────────────────
      this.transporter = nodemailer.createTransport({
        host:   'smtp.gmail.com',
        port:   587,
        secure: false,           // STARTTLS
        auth: {
          user: emailUser,
          pass: emailPass,       // 16-char App Password, NOT your account password
        },
        tls: { rejectUnauthorized: false },
      });

      try {
        await this.transporter.verify();
        this.logger.log(`[Email] ✅ Gmail SMTP connected → ${emailUser}`);
      } catch (err: any) {
        this.logger.error(
          `[Email] ❌ Gmail SMTP failed: ${err.message}\n` +
          `  Make sure EMAIL_PASS is a 16-char App Password, not your Gmail login password.\n` +
          `  Get one at: https://myaccount.google.com/apppasswords`,
        );
        // Fall through to Ethereal so the app still works
        await this.setupEthereal();
      }
    } else {
      // ── Ethereal dev sandbox (no real emails) ────────────────────────────
      await this.setupEthereal();
    }
  }

  private async setupEthereal() {
    const test = await nodemailer.createTestAccount();
    this.transporter = nodemailer.createTransport({
      host:   'smtp.ethereal.email',
      port:   587,
      secure: false,
      auth: { user: test.user, pass: test.pass },
    });
    this.etherealMode = true;
    this.logger.warn(
      `[Email] ⚠️  Using Ethereal sandbox — emails are NOT delivered to real inboxes.\n` +
      `  To send real emails add EMAIL_USER + EMAIL_PASS to your .env file.\n` +
      `  OTP preview URLs will be logged below each send.`,
    );
  }

  // ── OTP send ──────────────────────────────────────────────────────────────

  async sendOtpEmail(to: string, otp: string, firstName?: string): Promise<void> {
    const fromName = this.config.get<string>('EMAIL_FROM_NAME') ?? 'Vedarogya';
    const fromAddr = this.config.get<string>('EMAIL_USER')      ?? 'noreply@vedarogya.com';

    const info = await this.transporter.sendMail({
      from:    `"${fromName}" <${fromAddr}>`,
      to,
      subject: `${otp} is your Vedarogya verification code`,
      text:    this.textBody(otp, firstName),
      html:    this.htmlBody(otp, firstName),
    });

    if (this.etherealMode) {
      const url = nodemailer.getTestMessageUrl(info);
      this.logger.warn(`[Email] 🔗 Ethereal preview → ${url}`);
    } else {
      this.logger.log(`[Email] ✅ OTP sent to ${to} (id: ${info.messageId})`);
    }
  }

  // ── Templates ─────────────────────────────────────────────────────────────

  private textBody(otp: string, firstName?: string): string {
    const name = firstName ?? 'there';
    return [
      `Hi ${name},`,
      '',
      `Your Vedarogya verification code is: ${otp}`,
      '',
      'This code expires in 5 minutes.',
      'Do not share it with anyone.',
      '',
      '— The Vedarogya Team',
    ].join('\n');
  }

  private htmlBody(otp: string, firstName?: string): string {
    const name   = firstName ?? 'there';
    const digits = otp
      .split('')
      .map(
        d =>
          `<td style="width:52px;height:64px;background:#F0FBF5;border:1.5px solid #2C6E49;
                      border-radius:12px;text-align:center;vertical-align:middle;
                      font-size:30px;font-weight:800;color:#0D1117;font-family:monospace;">${d}</td>
           <td style="width:8px;"></td>`,
      )
      .join('');

    return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Your Vedarogya code</title>
</head>
<body style="margin:0;padding:0;background:#F4F7F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
  <tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0"
           style="background:#fff;border-radius:20px;overflow:hidden;
                  box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr>
        <td style="background:#2C6E49;padding:28px 40px 24px;text-align:center;">
          <div style="color:#fff;font-size:20px;font-weight:800;letter-spacing:-0.3px;">
            🌿 Vedarogya
          </div>
          <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:4px;">
            Your Ayurvedic Health Companion
          </div>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:36px 40px 8px;">
          <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#0D1117;letter-spacing:-0.4px;">
            Hi ${name} 👋
          </p>
          <p style="margin:0 0 28px;font-size:15px;color:#64748B;line-height:1.65;">
            Enter this 6-digit code to verify your identity.
            It expires in <strong style="color:#0D1117;">5 minutes</strong>.
          </p>

          <!-- OTP row -->
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
            <tr>${digits}</tr>
          </table>

          <p style="margin:0 0 28px;font-size:13px;color:#94A3B8;text-align:center;line-height:1.6;">
            🔒 Never share this code — not even with Vedarogya staff.
          </p>
        </td>
      </tr>

      <!-- Divider -->
      <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #F1F5F9;margin:0;"/></td></tr>

      <!-- Footer -->
      <tr>
        <td style="padding:20px 40px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">
            If you did not sign up for Vedarogya, ignore this email.<br/>
            This is an automated message — please do not reply.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
  }
}
