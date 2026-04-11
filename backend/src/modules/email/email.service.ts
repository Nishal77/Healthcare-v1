/**
 * EmailService
 *
 * Sends transactional emails (OTP, welcome, etc.) via SMTP.
 * Credentials are injected from environment variables — never hard-coded.
 *
 * Transport: nodemailer with OAuth2 client-id / client-secret.
 * In development the transporter falls back to Ethereal (auto-catch account)
 * so you can preview emails without a real SMTP server.
 */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter!: Transporter;

  constructor(private readonly config: ConfigService) {}

  // ── Bootstrap ─────────────────────────────────────────────────────────────

  async onModuleInit() {
    const isDev  = this.config.get('app.nodeEnv') === 'development';
    const host   = this.config.get<string>('EMAIL_SMTP_HOST');
    const port   = parseInt(this.config.get<string>('EMAIL_SMTP_PORT') ?? '587', 10);
    const user   = this.config.get<string>('EMAIL_CLIENT_ID');
    const pass   = this.config.get<string>('EMAIL_CLIENT_SECRET');

    if (isDev && !host) {
      // ── Dev fallback: Ethereal catch-all (no real emails sent) ────────────
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host:   'smtp.ethereal.email',
        port:   587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.logger.warn(
        `[Email] No SMTP configured — using Ethereal test account: ${testAccount.user}`,
      );
    } else {
      // ── Production / staging: real SMTP with OAuth2 credentials ──────────
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
        tls: {
          // Required by most modern SMTP providers (Supabase, Gmail, etc.)
          rejectUnauthorized: false,
        },
      });

      // Verify connection on startup
      try {
        await this.transporter.verify();
        this.logger.log(`[Email] SMTP connected → ${host}:${port}`);
      } catch (err) {
        this.logger.error(`[Email] SMTP connection failed: ${(err as Error).message}`);
        // Non-fatal — app still starts, emails will fail gracefully
      }
    }
  }

  // ── OTP Email ─────────────────────────────────────────────────────────────

  async sendOtpEmail(to: string, otp: string, firstName?: string): Promise<void> {
    const fromName  = this.config.get<string>('EMAIL_FROM_NAME') ?? 'Vedarogya';
    const fromAddr  = this.config.get<string>('EMAIL_FROM')      ?? 'noreply@vedarogya.com';

    const info = await this.transporter.sendMail({
      from:    `"${fromName}" <${fromAddr}>`,
      to,
      subject: `${otp} is your Vedarogya verification code`,
      text:    this.otpTextBody(otp, firstName),
      html:    this.otpHtmlBody(otp, firstName),
    });

    // In dev, log the Ethereal preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      this.logger.log(`[Email] OTP preview → ${previewUrl}`);
    } else {
      this.logger.log(`[Email] OTP sent to ${to} (messageId: ${info.messageId})`);
    }
  }

  // ── Plain-text fallback ───────────────────────────────────────────────────

  private otpTextBody(otp: string, firstName?: string): string {
    const name = firstName ?? 'there';
    return [
      `Hi ${name},`,
      '',
      `Your Vedarogya verification code is: ${otp}`,
      '',
      'This code expires in 5 minutes.',
      'Do not share it with anyone.',
      '',
      'If you did not request this, ignore this email.',
      '',
      '— The Vedarogya Team',
    ].join('\n');
  }

  // ── HTML email template ───────────────────────────────────────────────────

  private otpHtmlBody(otp: string, firstName?: string): string {
    const name   = firstName ?? 'there';
    const digits = otp.split('').join('</td><td style="width:10px"></td><td>');
    return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Verify your email — Vedarogya</title>
</head>
<body style="margin:0;padding:0;background:#F8FAF9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAF9;padding:40px 16px;">
    <tr><td align="center">

      <!-- Card -->
      <table width="520" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:20px;overflow:hidden;
                    box-shadow:0 4px 24px rgba(0,0,0,0.07);">

        <!-- Green header bar -->
        <tr>
          <td style="background:#2C6E49;padding:32px 40px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,0.15);
                        border-radius:50%;width:56px;height:56px;line-height:56px;
                        font-size:28px;margin-bottom:12px;">🌿</div>
            <div style="color:#ffffff;font-size:22px;font-weight:700;
                        letter-spacing:-0.3px;">Vedarogya</div>
            <div style="color:rgba(255,255,255,0.75);font-size:13px;margin-top:4px;">
              Your Ayurvedic Health Companion
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px 16px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;
                      color:#0D1117;letter-spacing:-0.4px;">
              Verify your email, ${name}
            </p>
            <p style="margin:0 0 28px;font-size:15px;color:#64748B;line-height:1.6;">
              Enter this 6-digit code in the Vedarogya app to complete your registration.
              The code expires in <strong>5 minutes</strong>.
            </p>

            <!-- OTP boxes -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
              <tr>
                <td style="background:#F0FBF5;border:1.5px solid #2C6E49;border-radius:12px;
                           width:48px;height:60px;text-align:center;vertical-align:middle;
                           font-size:28px;font-weight:800;color:#0D1117;letter-spacing:-1px;">
                  ${digits}
                </td>
              </tr>
            </table>

            <p style="margin:0 0 28px;font-size:13px;color:#94A3B8;line-height:1.6;
                      text-align:center;">
              🔒 &nbsp;Do not share this code with anyone, including Vedarogya staff.
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 40px;">
            <hr style="border:none;border-top:1px solid #F1F5F9;margin:0;"/>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px 32px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">
              If you did not create a Vedarogya account, you can safely ignore this email.<br/>
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
