import {reservationModel} from '../models/mysql/reservationModel.js';
import {validateReservation, validateReservationUpdate} from '../schemas/reservationSchema.js';
import {sendEmail} from "../services/emailService.js";
import {format} from "date-fns";
import {es} from "date-fns/locale";
export class reservationController {

  static async getAll(req, res) {
    const reservations = await reservationModel.getAll()
    res.json(reservations)
  }
  static async getById(req, res) {
    const {id} = req.params
    const reservation = await reservationModel.getById({id})
    if(reservation) return res.json(reservation)
    res.status(404).json({message: 'Reservación no encontrada'})
  }

  static async getByDate(req, res) {
    const {date} = req.params
    const reservations = await reservationModel.getByDate({date})
    if(reservations.length > 0) return res.json(reservations)
    res.status(404).json({message: 'No hay reservaciones en esa fecha'})
  }

  static async getByRoomId(req, res) {
    const {roomId} = req.params
    const reservations = await reservationModel.getByRoomId({roomId})
    if(reservations.length > 0) return res.json(reservations)
    res.status(404).json({message: 'No hay reservaciones para esta sala'})
  }

  static async getByCubicleId(req, res) {
    const {cubicleId} = req.params
    const reservations = await reservationModel.getByCubicleId({cubicleId})
    if(reservations.length > 0) return res.json(reservations)
    res.status(404).json({message: 'No hay reservaciones para este cubiculo'})
  }

  static async getByUserId(req, res) {
    const {userId} = req.params
    const reservations = await reservationModel.getByUserId({userId})
    if(reservations.length > 0) return res.json(reservations)
    res.status(404).json({message: 'No hay reservaciones asignadas a este usuario'})
  }

  static async create(req, res) {
    const result = validateReservation(req.body)
    if (result.success === false) {
      return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    const newReservation= await reservationModel.create({input: req.body})
    if(newReservation === false) return res.status(409).json({message: 'Dato repetido'})
    res.status(201).json(newReservation)
  }

  static async delete(req, res) {
    const {id} = req.params
    const deletedReservation = await reservationModel.delete({id})

    if(deletedReservation === false) return res.status(404).json({message: 'Reservación no eliminada'})
    res.status(204).json({message: "Se elimino correctamente la reservación"})
  }

  static async update(req, res) {
    const result = validateReservationUpdate(req.body)
    if (result.success === false) {
      return res.status(400).json({error: JSON.parse(result.error.message)})
    }

    const {id} = req.params
    const updatedReservation = await reservationModel.update({id, input: req.body})
    if(updatedReservation ) return res.json(updatedReservation)
    res.status(404).json({message: 'Reservación no actualizada'})
  }
  static async shareReservation(req, res) {
    try {
      const { correosDestinatarios, nombreRemitente, reservationDetails, observaciones, idSala, idCubiculo, refrigerio } = req.body;

      // Verificar que todos los campos requeridos están presentes
      if (!correosDestinatarios || !Array.isArray(correosDestinatarios) || correosDestinatarios.length === 0 || !nombreRemitente || !reservationDetails || !reservationDetails.Fecha || !reservationDetails.HoraInicio || !reservationDetails.HoraFin) {
        return res.status(400).json({ message: 'Todos los campos son requeridos y deben ser válidos' });
      }

      const emailSubject = 'Invitación a Reunión';
      const emailText = `
            Hola,

            ${nombreRemitente} te ha invitado a una reunión con los siguientes detalles:
            Fecha: ${reservationDetails.Fecha}
            Hora de Inicio: ${reservationDetails.HoraInicio}
            Hora de Fin: ${reservationDetails.HoraFin}
            Sala: ${idSala ? `Sala ${idSala}` : 'N/A'}
            Cubículo: ${idCubiculo ? `Cubículo ${idCubiculo}` : 'N/A'}
            Observaciones: ${observaciones || 'Ninguna'}
        `;

      const formattedDate = format(new Date(reservationDetails.Fecha), 'EEEE, dd MMMM yyyy', { locale: es });

      const emailHtml = `
            <div style="padding: 20px; background-color: #f4f4f4;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px;">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <!-- Contenedor del Logo Centrador -->
                            <table border="0" cellpadding="0" cellspacing="0" style="text-align: center;">
                                <tr>
                                    <!-- Texto "TEC" -->
                                    <td style="background-color: #ffffff; padding: 10px 20px; color: #000000; font-family: 'Georgia', serif; font-size: 36px; font-weight: bold;">
                                        TEC
                                    </td>
                                    <!-- Línea Roja Separadora -->
                                    <td style="width: 5px; background-color: #c1272d;"></td>
                                    <!-- Texto "Tecnológico de Costa Rica" -->
                                    <td style="background-color: #ffffff; padding: 10px 20px; color: #000000; font-family: 'Georgia', serif; font-size: 18px;">
                                        Centro Academico<br>de Alajuela
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <!-- Asunto -->
                            <h1 style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${emailSubject}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0;">
                            <!-- Detalles de la reservación -->
                            <p style="font-size: 16px; color: #555; line-height: 1.5; margin: 0; text-align: justify;">
                                ${nombreRemitente} te ha invitado a una reunión con los siguientes detalles:
                            </p>
                            <p style="font-size: 16px; color: #555; line-height: 1.5; margin: 0; text-align: justify;">
                                <strong>Fecha:</strong> ${formattedDate}<br>
                                <strong>Hora de Inicio:</strong> ${reservationDetails.HoraInicio}<br>
                                <strong>Hora de Fin:</strong> ${reservationDetails.HoraFin}<br>
                                ${idSala ? `<strong>Sala:</strong> Sala ${idSala}<br>` : ''}
                                ${idCubiculo ? `<strong>Cubículo:</strong> Cubículo ${idCubiculo}<br>` : ''}
                                <strong>Observaciones:</strong> ${observaciones || 'Ninguna'}<br>
                                ${refrigerio ? '<strong>Refrigerio:</strong> Sí (Según disponibilidad)' : ''}
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        `;

      // Iterar sobre la lista de correos y enviar el correo a cada destinatario
      for (const correoDestinatario of correosDestinatarios) {
        await sendEmail(
            correoDestinatario,  // Correo destinatario
            emailSubject,        // Asunto del correo
            emailText,           // Texto plano del correo
            emailHtml            // HTML del correo
        );
      }

      // Responder con éxito
      res.json({ message: 'Correos enviados correctamente' });

    } catch (error) {
      // Manejo de errores
      console.error(error);
      res.status(500).json({ message: 'Error al enviar los correos' });
    }
  }

}
