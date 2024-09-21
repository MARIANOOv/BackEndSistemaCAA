import mysql from 'mysql2/promise'

import { DBConfig } from '../../DBConfig.js'
import {sendEmail} from "../../services/emailService.js";

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
    JOIN 
        reservacion_recursos rr ON r.idReservacion = rr.idReservacion
    JOIN 
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

      // Si la reservación no está en el mapa, agregarla
      if (!reservationMap[idReservacion]) {
        reservationMap[idReservacion] = {
          idReservacion,
          Fecha,
          HoraInicio,
          HoraFin,
          idSala,
          idCubiculo,
          idUsuario,
          recursos: [], // Iniciar un array para los recursos
        };
      }

      // Agregar el recurso a la lista de recursos de la reservación
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
      return null; // Si no se encuentra la reservación, retornar null
    }

    // Agrupar los recursos en un solo objeto de reservación
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
      })).filter(recurso => recurso.idRecurso !== null) // Filtrar si no hay recursos asociados
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

      // Si la reservación no está en el mapa, agregarla
      if (!reservationMap[idReservacion]) {
        reservationMap[idReservacion] = {
          idReservacion,
          Fecha,
          HoraInicio,
          HoraFin,
          idSala,
          idCubiculo,
          idUsuario,
          recursos: [], // Iniciar un array para los recursos
        };
      }

      // Agregar el recurso a la lista de recursos de la reservación
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
    JOIN 
        reservacion_recursos rr ON r.idReservacion = rr.idReservacion
    JOIN 
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

      // Si la reservación no está en el mapa, agregarla
      if (!reservationMap[idReservacion]) {
        reservationMap[idReservacion] = {
          idReservacion,
          Fecha,
          HoraInicio,
          HoraFin,
          idSala,
          idCubiculo,
          idUsuario,
          recursos: [], // Iniciar un array para los recursos
        };
      }

      // Agregar el recurso a la lista de recursos de la reservación
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
        rec.nombre AS NombreRecurso
    FROM 
        reservacion r
    JOIN 
        reservacion_recursos rr ON r.idReservacion = rr.idReservacion
    JOIN 
        recursos rec ON rr.idRecurso = rec.idRecursos
    WHERE 
        r.idUsuario = ?;`,
      [userId]
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

      // Si la reservación no está en el mapa, agregarla
      if (!reservationMap[idReservacion]) {
        reservationMap[idReservacion] = {
          idReservacion,
          Fecha,
          HoraInicio,
          HoraFin,
          idSala,
          idCubiculo,
          idUsuario,
          recursos: [], // Iniciar un array para los recursos
        };
      }

      // Agregar el recurso a la lista de recursos de la reservación
      if (idRecurso) {
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
      //Ver si la reservación ya existe en esa fecha, horas y sala
      if(idSala != null) {
        const [horaIniS] = await connection.query(
          'SELECT HoraInicio FROM reservacion WHERE HoraInicio = ? AND Fecha = ? AND idSala = ?',
          [horaInicio, fecha, idSala]
        )

        if (horaIniS.length > 0) {
          return false
        }

        const [horaFinalS] = await connection.query(
          'SELECT HoraFin FROM reservacion WHERE HoraFin = ? AND Fecha = ? AND idSala = ?',
          [horaFin, fecha, idSala]
        )

        if (horaFinalS.length > 0) {
          return false
        }
      }

      if(idCubiculo != null) {
        //Ver si la reservación ya existe en esa fecha, horas y cubiculo
        const [horaIniC] = await connection.query(
          'SELECT HoraInicio FROM reservacion WHERE HoraInicio = ? AND Fecha = ? AND idCubiculo = ?',
          [horaInicio, fecha, idCubiculo]
        )

        if (horaIniC.length > 0) {
          console.log("1")
          return false
        }

        const [horaFinalC] = await connection.query(
          'SELECT HoraFin FROM reservacion WHERE HoraFin = ? AND Fecha = ? AND idCubiculo = ?',
          [horaFin, fecha, idCubiculo]
        )

        if (horaFinalC.length > 0) {
          console.log("2")

          return false
        }
      }

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

        // Obtener los detalles de la reservación recién creada
        const [reservation] = await connection.query(
            `SELECT *
         FROM reservacion WHERE idReservacion = LAST_INSERT_ID();`
        );

        // Enviar correo con los detalles de la reservación
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
        const emailHtml = `
      <h1>Confirmación de Reservación</h1>
      <p>Hola <strong>${Nombre}</strong>,</p>
      <p>Se ha realizado una nueva reservación con los siguientes detalles:</p>
      <p><strong>Fecha:</strong> ${reservationDetails.Fecha}</p>
      <p><strong>Hora de Inicio:</strong> ${reservationDetails.HoraInicio}</p>
      <p><strong>Hora de Fin:</strong> ${reservationDetails.HoraFin}</p>
      ${idSala ? `<p><strong>Sala:</strong> Sala ${idSala}</p>` : ''}
      ${idCubiculo ? `<p><strong>Cubículo:</strong> Cubículo ${idCubiculo}</p>` : ''}
      <p><strong>Observaciones:</strong> ${observaciones || 'Ninguna'}</p>
    `;

        console.log(CorreoEmail)
        console.log(Nombre)
        sendEmail(
            CorreoEmail, // Usamos el correo del usuario obtenido de la base de datos
            emailSubject,
            emailText,
            emailHtml
        );
      }



      console.log(idRecursos)
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
      idRecursos
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
           Observaciones = COALESCE(?, Observaciones)
           WHERE idReservacion = ?;`,
        [fecha, horaInicio,horaFin, observaciones,id]
      );
      if (result.affectedRows === 0) {
        throw new Error('No se encontro la reservacion con ese id');
      }

      // Obtener los recursos actuales de la reservación
      const [currentResources] = await connection.query(
        `SELECT idRecurso FROM reservacion_recursos WHERE idReservacion = ?;`,
        [id]
      );

      const currentResourceIds = currentResources.map((resource) => resource.idRecurso);

      // Recursos a eliminar: los que están en la base de datos pero no en la lista de idRecursos proporcionada
      const resourcesToDelete = currentResourceIds.filter(
        (idRecurso) => !idRecursos.includes(idRecurso)
      );

      // Recursos a agregar: los que están en la lista de idRecursos proporcionada pero no en la base de datos
      const resourcesToAdd = idRecursos.filter(
        (idRecurso) => !currentResourceIds.includes(idRecurso)
      );

      // Eliminar recursos no deseados
      if (resourcesToDelete.length > 0) {
        await connection.query(
          `DELETE FROM reservacion_recursos WHERE idReservacion = ? AND idRecurso IN (?);`,
          [id, resourcesToDelete]
        );
      }

      // Agregar nuevos recursos
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