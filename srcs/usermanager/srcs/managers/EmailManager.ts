import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import { config } from "./ConfigManager.ts";
import Logger from "../../../libs/helpers/loggers.ts";

interface NodeMailerProps {
	service?: string;
	host?: string;
	port: number;
	secure: boolean;
	auth: {
		user: string;
		pass: string;
	};
}

class EmailManager {
	private _transporter: Mail;

	public initialize() {
		const options: NodeMailerProps = {
			port: config.SmtpConfig.port,
			secure: config.SmtpConfig.secure,
			auth: config.SmtpConfig.auth,
			service: config.SmtpConfig.service,
			host: config.SmtpConfig.host,
		};
		this._transporter = nodemailer.createTransport(options);
		if (!this._transporter) {
			throw new Error("Failed to create email transporter. Check your SMTP configuration.");
		}
		this._transporter.verify((error, success) => {
			if (error) {
				Logger.error(`Email transporter verification failed: ${error.message}`);
				throw new Error(`Email transporter verification failed: ${error.message}`);
			} else {
				Logger.info("Email transporter is ready to send messages.");
			}
		});
	}

	public get transporter(): Mail {
		if (!this._transporter)
			this.initialize();
		return this._transporter;
	}

	public async sendMail(options: any) {
		this.transporter.sendMail(options);
	}
}

export default new EmailManager();
