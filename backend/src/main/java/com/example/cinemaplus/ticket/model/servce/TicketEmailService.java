package com.example.cinemaplus.ticket.model.servce;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class TicketEmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendTicketEmail(String to, byte[] pdfData) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject("🎟 Your CinemaPlus Ticket");
        helper.setText("Dear customer,\n\nAttached is your movie ticket.\n\nEnjoy the show!");
        helper.addAttachment("ticket.pdf", new ByteArrayResource(pdfData));
        mailSender.send(message);
    }

}
