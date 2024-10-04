import mysql from 'mysql2/promise'
import {DBConfig} from '../../DBConfig.js'
import {sendEmail} from "../../services/emailService.js";


const connection = await mysql.createConnection(DBConfig)

export class RoomModel {

    static async getAll () {
        const [rooms] = await connection.query(
            'SELECT * FROM sala',
        )
        return rooms
    }

    static async getById ({ id }) {
        const [room] = await connection.query(
            'SELECT * FROM sala WHERE idSala = ?',
            [id]
        )
        if(room.length === 0) {
            return null
        }

        return room[0]
    }

    static async getNameById ({ id }) {
        const [room] = await connection.query(
            'SELECT Nombre FROM sala WHERE idSala = ?',
            [id]
        )
        if(room.length === 0) {
            return null
        }

        return room[0]
    }

    static async create({ input }) {
        const {
            imagen,
            nombre,
            descripcion,
            restricciones,
            estado
        } = input;

        try {
            const [result] = await connection.query(
                'SELECT nombre FROM sala WHERE Nombre = ?',
                [nombre]
            );

            if (result.length > 0) {
                return false;
            }

            await connection.query(
                'INSERT INTO sala (Imagen, Nombre, Descripcion, Restricciones, Estado) VALUES (?, ?, ?, ?, ?)',
                [imagen, nombre, descripcion, restricciones, estado]
            );
        } catch (error) {
            throw new Error(error);
        }

        const [room] = await connection.query(
            `SELECT *
             FROM sala WHERE idSala = LAST_INSERT_ID();`
        );
        return room[0];
    }

    static async delete ({ id }) {
        try {
            await connection.query(
                'DELETE FROM sala WHERE idSala = ?',
                [id]
            )
        }
        catch (error) {
            throw new Error("Error al eliminar la sala")
        }
        return true
    }

    static async update({ id, input }) {
        const {
            imagen,
            nombre,
            descripcion,
            restricciones,
            estado
        } = input

        try {

            const [duplicate] = await connection.query(
                'SELECT nombre FROM sala WHERE Nombre = ?',
                [nombre]
            )
            if (duplicate.length > 0) {
                return false
            }

            const [result] = await connection.query(
                `UPDATE sala
       SET Imagen = COALESCE(?, Imagen),
           Nombre = COALESCE(?, Nombre),
           Descripcion = COALESCE(?, Descripcion),
           Restricciones = COALESCE(?, Restricciones),
           Estado = COALESCE(?, Estado)
       WHERE idSala = ?;`,
                [imagen, nombre, descripcion, restricciones, estado, id]
            );
            if (result.affectedRows === 0) {
                throw new Error('No se encontro la sala con ese id');
            }

            const [updatedRoom] = await connection.query(
                `SELECT *
                    FROM sala WHERE idSala = ?;`,
                [id]
            );

            return updatedRoom[0];
        } catch (error) {
            throw new Error("Error al actualizar la sala");
        }
    }

    static async lock() {
        try {

            const [result] = await connection.query(
                `UPDATE sala
                 SET Estado = 0;`
            );
            const [updatedRooms] = await connection.query(
                `SELECT *
                    FROM sala;`,
            );

            const [userDetails] = await connection.query(
                `SELECT Usuario.Nombre, Usuario.CorreoEmail
             FROM Usuario
             INNER JOIN Rol ON Usuario.idRol = Rol.idRol
             WHERE Rol.Nombre IN ('Administrador', 'Profesor', 'Estudiante');`
            );

            const emailSubject = 'Bloqueo de Salas';


            userDetails.forEach(({ Nombre, CorreoEmail }) => {
                const emailText = `
            Hola ${Nombre},
            
            Debido a temas administrativos, se ha bloqueado temporalmente la opción de reservar salas. Será notificado cuando esta opción vuelva a estar disponible.
            `;

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
        <!-- Mensaje de Bloqueo -->
        <p style="font-size: 16px; color: #555; line-height: 1.5; margin: 0; text-align: justify;">
          Hola ${Nombre}, debido a temas administrativos, se ha bloqueado temporalmente la opción de reservar salas. Será notificado cuando esta opción vuelva a estar disponible.
        </p>
      </td>
    </tr>
  </table>
</div>
`;

                // Enviar el correo a cada usuario
                sendEmail(
                    CorreoEmail,
                    emailSubject,
                    emailText,
                    emailHtml
                );
            });


            return updatedRooms;
        } catch (error) {
            throw new Error("Error al actualizar la sala");
        }
    }

    static async unLock() {
        try {

            const [result] = await connection.query(
                `UPDATE sala
                 SET Estado = 1;`
            );
            const [updatedRooms] = await connection.query(
                `SELECT *
                    FROM sala;`,
            );
            const [userDetails] = await connection.query(
                `SELECT Usuario.Nombre, Usuario.CorreoEmail
             FROM Usuario
             INNER JOIN Rol ON Usuario.idRol = Rol.idRol
             WHERE Rol.Nombre IN ('Administrador', 'Profesor', 'Estudiante');`
            );

            const emailSubject = 'Reactivación de reservas de Salas';

            // Enviar el correo solo a los usuarios con los roles especificados
            userDetails.forEach(({ Nombre, CorreoEmail }) => {
                const emailText = `
            Hola ${Nombre},
            
            Nos complace informarle que la opción de reservar salas ha sido reactivada. Ya puede realizar sus reservas nuevamente.
            `;

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
        <!-- Mensaje de Reactivación -->
        <p style="font-size: 16px; color: #555; line-height: 1.5; margin: 0; text-align: justify;">
          Hola ${Nombre}, nos complace informarle que la opción de reservar salas ha sido reactivada. Ya puede realizar sus reservas nuevamente.
        </p>
      </td>
    </tr>
  </table>
</div>
`;

                // Enviar el correo a cada usuario
                sendEmail(
                    CorreoEmail,
                    emailSubject,
                    emailText,
                    emailHtml
                );
            });



            return updatedRooms;
        } catch (error) {
            throw new Error("Error al actualizar la sala");
        }
    }

}