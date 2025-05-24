package com.example.cinemaplus.ticket.model.servce;

import com.example.cinemaplus.ticket.model.model.Ticket;
import com.example.cinemaplus.ticket.model.repository.TicketRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.PdfPTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Service
public class TicketPdfService {

    @Autowired
    private TicketRepository ticketRepository;

    public byte[] generatePdfForTickets(List<Ticket> tickets) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A6);
            PdfWriter.getInstance(document, out);
            document.open();

            for (Ticket t : tickets) {
                PdfPTable table = new PdfPTable(1);
                table.setWidthPercentage(100);

                Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD, Color.PINK);
                Paragraph title = new Paragraph("\uD83C\uDF9F\uFE0F Your Ticket", titleFont);
                title.setAlignment(Element.ALIGN_CENTER);
                document.add(title);

                document.add(Chunk.NEWLINE);

                Font boldFont = new Font(Font.HELVETICA, 12, Font.BOLD);
                Font normalFont = new Font(Font.HELVETICA, 12);

                // Movie
                document.add(new Paragraph("Movie: ", boldFont));
                document.add(new Paragraph(t.getProjection().getMovie().getTitle(), normalFont));
                document.add(Chunk.NEWLINE);

                // Hall
                document.add(new Paragraph("Hall: ", boldFont));
                document.add(new Paragraph(t.getProjection().getHall().getName(), normalFont));
                document.add(Chunk.NEWLINE);

                // Time (sa provjerom)
                document.add(new Paragraph("Time: ", boldFont));
                String formattedTime = formatStartTime(t.getProjection().getStartTime());
                document.add(new Paragraph(formattedTime, normalFont));
                document.add(Chunk.NEWLINE);

                // Seat
                document.add(new Paragraph("Seat: ", boldFont));
                String seat = (char)(64 + t.getSeat().getRowNumber()) + String.valueOf(t.getSeat().getSeatNumber());
                document.add(new Paragraph(seat, normalFont));
                document.add(Chunk.NEWLINE);

                // Price
                document.add(new Paragraph("Total: ", boldFont));
                document.add(new Paragraph(t.getPrice() + " BAM", normalFont));

                document.add(Chunk.NEWLINE);
                document.add(Chunk.NEWLINE);
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public byte[] generatePdfForReservation(Long reservationId) {
        List<Ticket> tickets = ticketRepository.findAllByReservationId(reservationId);
        if (tickets == null || tickets.isEmpty()) {
            return generateEmptyPdf("No tickets found for reservation: " + reservationId);
        }
        return generatePdfForTickets(tickets);
    }

    private String formatStartTime(Object startTimeObj) {
        try {
            if (startTimeObj == null) {
                return "N/A";
            } else if (startTimeObj instanceof Date) {
                return new SimpleDateFormat("dd/MM/yyyy, h:mm a").format((Date) startTimeObj);
            } else if (startTimeObj instanceof LocalDateTime) {
                return ((LocalDateTime) startTimeObj)
                        .atZone(ZoneId.systemDefault())
                        .format(DateTimeFormatter.ofPattern("dd/MM/yyyy, h:mm a"));
            } else {
                return "Unknown date format";
            }
        } catch (Exception e) {
            return "Invalid date";
        }
    }

    private byte[] generateEmptyPdf(String message) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A6);
            PdfWriter.getInstance(document, out);
            document.open();
            Font font = new Font(Font.HELVETICA, 12, Font.ITALIC, Color.RED);
            document.add(new Paragraph(message, font));
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
