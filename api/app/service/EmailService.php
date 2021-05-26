<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;


class EmailService
{

    public static function sendMail($recipient,$subject, $body)
    {

        $mail = new PHPMailer(true);

        try {
            //Server settings
//            $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
            $mail->isSMTP();
            $mail->SMTPAuth = true;
            $mail->Host = EMAIL_HOST;
            $mail->Port = EMAIL_PORT;
            $mail->Username = EMAIL_USERNAME;
            $mail->Password = EMAIL_PASSWORD;

            //Recipients
            $mail->setFrom('manager@quizy.cz', 'Quizy App');
            $mail->addAddress($recipient);     //Add a recipient

            //Content
            $mail->isHTML(true);
            $mail->CharSet = "UTF-8";
            $mail->Subject = $subject;
            $mail->Body = $body;

            $mail->send();
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            throw $e;
        }

    }

}