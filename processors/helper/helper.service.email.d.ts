export interface IEmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}
export declare class EmailService {
    private transporter;
    private clientIsValid;
    constructor();
    private verifyClient;
    sendMail(mailOptions: IEmailOptions): false | undefined;
}
