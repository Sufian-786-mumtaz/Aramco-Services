import { EmailSignUp } from '@auth/interface/auth.interface';
import { User } from '@user/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async signUpEmail(user: EmailSignUp, token: string) {
    const mail = {
      from: `${process.env.SENDGRID_ACCOUNT_EMAIL}`,
      templateId: `${process.env.SENDGRID_TEM_ID_FOR_SIGN_UP_EMAIL}`,
      personalizations: [
        {
          to: { email: `${user?.email}` },
          dynamic_template_data: {
            subject: 'Register Your Account ✔',
            button_url: `${process.env.CLIENT_URL}sign-up/${token}`,
            name: `${user.name}`,
          },
        },
      ],
    };

    const transport = await SendGrid.send(mail);
    return transport;
  }

  async forgotPasswordEmail(user: User, token: string) {
    const mail = {
      from: `${process.env.SENDGRID_ACCOUNT_EMAIL}`,
      templateId: `${process.env.SENDGRID_TEM_ID_FOR_FORGOT_EMAIL}`,
      personalizations: [
        {
          to: { email: `${user?.email}` },
          dynamic_template_data: {
            subject: 'Forgot Password ✔',
            button_url: `${process.env.CLIENT_URL}reset-new-password/${token}`,
            name: `${user.firstName} ${user.lastName}`,
          },
        },
      ],
    };

    const transport = await SendGrid.send(mail);
    return transport;
  }

  async send(mail: any) {
    const transport = await SendGrid.send(mail);
    return transport;
  }
}
