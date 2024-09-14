import mysql from 'mysql2/promise'
import {DBConfig} from '../../DBConfig.js'
import bcrypt from 'bcrypt'


const connection = await mysql.createConnection(DBConfig)

export class applicationModel {

    static async getAll () {
        const [applications] = await connection.query(
            'SELECT * FROM solicitud',
        )
        return applications
    }

    static async getById ({ id }) {
        const [application] = await connection.query(
            'SELECT * FROM solicitud WHERE idSolicitud = ?',
            [id]
        )
        if(application.length === 0) {
            return null
        }
        return application[0]
    }

    static async create ({ input }) {
        const {
            estado,
            idUsuario,
            idActivo,
            archivoSolicitud,
            fechaInicio,
            fechaFin
        } = input
        try {

            //Validar que el usuario exista
            const [resultUser] = await connection.query(
                'SELECT cedulaCarnet FROM usuario WHERE CedulaCarnet = ?',
                [idUsuario]
            )
            if (resultUser.length <= 0) {
                return false
            }

            //Validar que el usuario exista
            const [resultAsset] = await connection.query(
                'SELECT NumeroPlaca FROM activo WHERE NumeroPlaca = ?',
                [idActivo]
            )
            if (resultAsset.length <= 0) {
                return false
            }

            const fechaInicioToDate= new Date(fechaInicio)
            const fechaFinToDate= new Date(fechaFin)

            await connection.query(
                'INSERT INTO solicitud (Estado, idUsuario, idActivo, archivoSolicitud, FechaInicio, FechaFin) VALUES (?, ?, ?, ?, ?, ?)',
                [estado, idUsuario, idActivo, archivoSolicitud, fechaInicioToDate, fechaFinToDate]
            )

        }
        catch (error) {
            throw new Error("Error al crear la solicitud")
        }

        const [application] = await connection.query(
            `SELECT *
             FROM solicitud WHERE idSolicitud = LAST_INSERT_ID();`
        )
        return application[0]
    }

    static async delete ({ id }) {
        try {
            await connection.query(
                'DELETE FROM solicitud WHERE idSolicitud = ?',
                [id]
            )
        }
        catch (error) {
            throw new Error("Error al eliminar la solicitud")
        }
        return true
    }

    static async update({ id, input }) {
        const {
            estado
        } = input
        try {

            const [result] = await connection.query(
                `UPDATE solicitud
                   SET Estado = (?)  
                   WHERE idSolicitud = ?;`,
                [estado, id]
            );
            if (result.affectedRows === 0) {
                throw new Error('No se encontro la solicitud con ese id');
            }

            const [updatedApplication] = await connection.query(
                `SELECT *
                    FROM solicitud WHERE idSolicitud = ?;`,
                [id]
            );

            return updatedApplication[0];
        } catch (error) {
            throw new Error(error);
        }
    }
}