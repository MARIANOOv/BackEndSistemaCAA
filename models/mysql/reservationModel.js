import mysql from 'mysql2/promise'
import { DBConfig } from '../../DBConfig.js'
import {sendEmail} from "../../services/emailService.js";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const connection = await mysql.createConnection(DBConfig)

export class reservationModel {

  static async getAll () {
    const [reservations] = await connection.query(
      ` SELECT 
    r.idReservacion,
    r.Fecha,
    r.HoraInicio,
    r.HoraFin,
    r.idSala,
    r.idCubiculo,
    r.idUsuario,
    rr.idRecurso,
    rec.nombre AS NombreRecurso
    FROM 
        reservacion r
    LEFT JOIN 
        reservacion_recursos rr ON r.idReservacion = rr.idReservacion
    LEFT JOIN 
        recursos rec ON rr.idRecurso = rec.idRecursos;`
    )

    const reservationMap = {};

    reservations.forEach((row) => {
      const {
        idReservacion,
        Fecha,
        HoraInicio,
        HoraFin,
        idSala,
        idCubiculo,
        idUsuario,
        idRecurso,
        NombreRecurso,
      } = row;


      if (!reservationMap[idReservacion]) {
        reservationMap[idReservacion] = {
          idReservacion,
          Fecha,
          HoraInicio,
          HoraFin,
          idSala,
          idCubiculo,
          idUsuario,
          recursos: [],
        };
      }


      if (idRecurso) {
        reservationMap[idReservacion].recursos.push({
          idRecurso,
          NombreRecurso,
        });
      }
    });

    return Object.values(reservationMap);
  }


  static async getById({ id }) {
    const [resources] = await connection.query(
      `SELECT 
        r.idReservacion,
        r.Fecha,
        r.HoraInicio,
        r.HoraFin,
        r.idSala,
        r.idCubiculo,
        r.idUsuario,
        rr.idRecurso,
        rec.nombre AS NombreRecurso
     FROM 
        reservacion r 
     LEFT JOIN 
        reservacion_recursos rr ON r.idReservacion = rr.idReservacion
     LEFT JOIN 
        recursos rec ON rr.idRecurso = rec.idRecursos
     WHERE 
        r.idReservacion = ?;`,
      [id]
    );

    if (resources.length === 0) {
      return null;
    }


    const reservacion = {
      idReservacion: resources[0].idReservacion,
      Fecha: resources[0].Fecha,
      HoraInicio: resources[0].HoraInicio,
      HoraFin: resources[0].HoraFin,
      idSala: resources[0].idSala,
      idCubiculo: resources[0].idCubiculo,
      idUsuario: resources[0].idUsuario,
      recursos: resources.map((row) => ({
        idRecurso: row.idRecurso,
        NombreRecurso: row.NombreRecurso,
      })).filter(recurso => recurso.idRecurso !== null)
    };

    return reservacion;
  }


  static async getByDate({ date }) {

    const [reservations] = await connection.query(
      ` SELECT 
        r.idReservacion,
        r.Fecha,
        r.HoraInicio,
        r.HoraFin,
        r.idSala,
        r.idCubiculo,
        r.idUsuario,
        rr.idRecurso,
        rec.nombre AS NombreRecurso
    FROM 
        reservacion r
    JOIN 
        reservacion_recursos rr ON r.idReservacion = rr.idReservacion
    JOIN 
        recursos rec ON rr.idRecurso = rec.idRecursos
    WHERE 
        r.Fecha = ?;`,
      [date]
    )

    const reservationMap = {};

    reservations.forEach((row) => {
      const {
        idReservacion,
        Fecha,
        HoraInicio,
        HoraFin,
        idSala,
        idCubiculo,
        idUsuario,
        idRecurso,
        NombreRecurso,
      } = row;


      if (!reservationMap[idReservacion]) {
        reservationMap[idReservacion] = {
          idReservacion,
          Fecha,
          HoraInicio,
          HoraFin,
          idSala,
          idCubiculo,
          idUsuario,
          recursos: [],
        };
      }


      if (idRecurso) {
        reservationMap[idReservacion].recursos.push({
          idRecurso,
          NombreRecurso,
        });
      }
    });

    return Object.values(reservationMap);
  }

  static async getByRoomId({ roomId }) {

    const [reservations] = await connection.query(
      ` SELECT 
        r.idReservacion,
        r.Fecha,
        r.HoraInicio,
        r.HoraFin,
        r.idSala,
        r.idCubiculo,
        r.idUsuario,
        rr.idRecurso,
        rec.nombre AS NombreRecurso
    FROM 
        reservacion r
    LEFT JOIN 
        reservacion_recursos rr ON r.idReservacion = rr.idReservacion
    LEFT JOIN 
        recursos rec ON rr.idRecurso = rec.idRecursos
    WHERE 
        r.idSala = ?;`,
      [roomId]
    )

    const reservationMap = {};

    reservations.forEach((row) => {
      const {
        idReservacion,
        Fecha,
        HoraInicio,
        HoraFin,
        idSala,
        idCubiculo,
        idUsuario,
        idRecurso,
        NombreRecurso,
      } = row;


      if (!reservationMap[idReservacion]) {
        reservationMap[idReservacion] = {
          idReservacion,
          Fecha,
          HoraInicio,
          HoraFin,
          idSala,
          idCubiculo,
          idUsuario,
          recursos: [],
        };
      }


      if (idRecurso) {
        reservationMap[idReservacion].recursos.push({
          idRecurso,
          NombreRecurso,
        });
      }
    });

    return Object.values(reservationMap);
  }

  static async getByCubicleId({ cubicleId }) {


    const [reservations] = await connection.query(
      ` SELECT 
        *
    FROM 
        reservacion 
    WHERE 
        idCubiculo = ?;`,
      [cubicleId]
    )


    return reservations;
  }

  static async getByUserId({ userId }) {

    const [reservations] = await connection.query(
        ` SELECT 
        r.idReservacion,
        r.Fecha,
        r.HoraInicio,
        r.HoraFin,
        r.idSala,
        r.idCubiculo,
        r.idUsuario,
        rr.idRecurso,
        rec.nombre AS NombreRecurso,
        r.Observaciones,
        r.Refrigerio
    FROM 
        reservacion r
    LEFT JOIN 
        reservacion_recursos rr ON r.idReservacion = rr.idReservacion
    LEFT JOIN 
        recursos rec ON rr.idRecurso = rec.idRecursos
    WHERE 
        r.idUsuario = ?;`,
        [userId]
    );

    const reservationMap = {};

    reservations.forEach((row) => {
      const {
        idReservacion,
        Fecha,
        HoraInicio,
        HoraFin,
        idSala,
        idCubiculo,
        idUsuario,
        idRecurso,
        NombreRecurso,
        Observaciones,
        Refrigerio,
      } = row;


      if (!reservationMap[idReservacion]) {
        reservationMap[idReservacion] = {
          idReservacion,
          Fecha,
          HoraInicio,
          HoraFin,
          idSala,
          idCubiculo,
          idUsuario,
          Observaciones: idSala ? Observaciones : null,
          Refrigerio: idSala ? Refrigerio : null,
          recursos: [],
        };
      }


      if (idSala && idRecurso) {
        reservationMap[idReservacion].recursos.push({
          idRecurso,
          NombreRecurso,
        });
      }
    });

    return Object.values(reservationMap);
  }



  static async create ({ input }) {
    const {
      fecha,
      horaInicio,
      horaFin,
      idSala,
      idCubiculo,
      idUsuario,
      observaciones,
      refrigerio,
      idRecursos,
    } = input

    try {


      const fechaToDate = new Date(fecha)

      const [result] = await connection.query(
        'INSERT INTO reservacion (Fecha,HoraInicio,HoraFin,idSala,idCubiculo,idUsuario,Observaciones,Refrigerio) VALUES (?,?,?,?,?,?,?,?)',
        [fechaToDate, horaInicio, horaFin, idSala, idCubiculo, idUsuario, observaciones, refrigerio]
      )

      const [userDetails] = await connection.query(
          'SELECT Nombre, CorreoEmail FROM Usuario WHERE CedulaCarnet = ?',
          [idUsuario]
      );

      if (userDetails.length > 0) {
        const { Nombre, CorreoEmail } = userDetails[0];


        const [reservation] = await connection.query(
            `SELECT *
         FROM reservacion WHERE idReservacion = LAST_INSERT_ID();`
        );


        const reservationDetails = reservation[0];
        const emailSubject = 'Confirmación de Reservación';
        const emailText = `
      Hola ${Nombre},
      
      Se ha realizado una nueva reservación con los siguientes detalles:
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
          Se ha realizado una nueva reservación con los siguientes detalles:
        </p>
        <p style="font-size: 16px; color: #555; line-height: 1.5; margin: 0; text-align: justify;">
          <strong>Fecha:</strong> ${formattedDate}<br>
          <strong>Hora de Inicio:</strong> ${reservationDetails.HoraInicio}<br>
          <strong>Hora de Fin:</strong> ${reservationDetails.HoraFin}<br>
          ${idSala ? `<strong>Sala:</strong> Sala ${idSala}<br>` : ''}
          ${idCubiculo ? `<strong>Cubículo:</strong> Cubículo ${idCubiculo}<br>` : ''}
          ${observaciones ? `<strong>Observaciones:</strong> ${observaciones}<br>` : ''} 
          ${refrigerio ? '<strong>Refrigerio:</strong> Sí (Según disponibilidad)' : ''}
        </p>
      </td>
    </tr>
  </table>
</div>
`;

        sendEmail(
            CorreoEmail,
            emailSubject,
            emailText,
            emailHtml
        );
      }




      if (Array.isArray(idRecursos) && idRecursos.length > 0) {
        const insertPromises = idRecursos.map(idRecurso => {
          return connection.query(
            'INSERT INTO reservacion_recursos (idReservacion, idRecurso) VALUES (?, ?)',
            [result.insertId, idRecurso]
          );
        });
        await Promise.all(insertPromises);
      }
    }

    catch (error) {
      throw new Error(error);
    }

    const [reservation] = await connection.query(
      `SELECT *
             FROM reservacion WHERE idReservacion = LAST_INSERT_ID();`
    )
    return reservation[0]
  }



  static async delete ({ id }) {
    try {
      await connection.query(
        'DELETE FROM reservacion_recursos WHERE idReservacion = ?',
        [id]
      )
      await connection.query(
        'DELETE FROM reservacion WHERE idReservacion = ?',
        [id]
      )
    }
    catch (error) {
      throw new Error()
    }
    return true
  }



  static async update({ id, input }) {
    const {
      fecha,
      horaInicio,
      horaFin,
      observaciones,
      idRecursos,
      refrigerio
    } = input
    try {
      const [horaIni] = await connection.query(
        'SELECT HoraInicio FROM reservacion WHERE HoraInicio = ? AND Fecha = ?',
        [horaInicio, fecha]
      )

      if (horaIni.length > 0) {
        console.log("1")
        return false
      }

      const [horaFinal] = await connection.query(
        'SELECT HoraFin FROM reservacion WHERE HoraFin = ? AND Fecha = ?',
        [horaFin, fecha]
      )

      if (horaFinal.length > 0) {
        console.log("2")
        return false
      }

      const [result] = await connection.query(
        `UPDATE reservacion
           SET Fecha = COALESCE(?, Fecha),
           HoraInicio = COALESCE(?, HoraInicio),
           HoraFin = COALESCE(?, HoraFin),
           Observaciones = COALESCE(?, Observaciones),
           Refrigerio = COALESCE(?, Refrigerio)
           WHERE idReservacion = ?;`,
        [fecha, horaInicio,horaFin, observaciones,refrigerio,id]
      );
      if (result.affectedRows === 0) {
        throw new Error('No se encontro la reservacion con ese id');
      }


      const [currentResources] = await connection.query(
        `SELECT idRecurso FROM reservacion_recursos WHERE idReservacion = ?;`,
        [id]
      );

      const currentResourceIds = currentResources.map((resource) => resource.idRecurso);


      const resourcesToDelete = currentResourceIds.filter(
        (idRecurso) => !idRecursos.includes(idRecurso)
      );


      const resourcesToAdd = idRecursos.filter(
        (idRecurso) => !currentResourceIds.includes(idRecurso)
      );


      if (resourcesToDelete.length > 0) {
        await connection.query(
          `DELETE FROM reservacion_recursos WHERE idReservacion = ? AND idRecurso IN (?);`,
          [id, resourcesToDelete]
        );
      }


      if (resourcesToAdd.length > 0) {
        const insertPromises = resourcesToAdd.map((idRecurso) => {
          return connection.query(
            `INSERT INTO reservacion_recursos (idReservacion, idRecurso) VALUES (?, ?);`,
            [id, idRecurso]
          );
        });

        await Promise.all(insertPromises);
      }

      return 1;
    } catch (error) {
      throw new Error(error);
    }
  }

}