import mysql from 'mysql2/promise'
import {DBConfig} from '../../DBConfig.js'
import bcrypt from 'bcrypt'


const connection = await mysql.createConnection(DBConfig)

export class userModel {

    static async getAll () {
        const [users] = await connection.query(
            'SELECT * FROM usuario',
        )
        return users
    }

    static async getById ({ id }) {
        const [user] = await connection.query(
            'SELECT * FROM usuario WHERE CedulaCarnet = ?',
            [id]
        )
        if(user.length === 0) {
            return null
        }

        return user[0]
    }

    static async create ({ input }) {
        const {
            cedulaCarnet,
            nombre,
            correoEmail,
            correoInstitucional,
            contrasena,
            telefono,
            telefono2,
            direccion,
            idRol
        } = input
        try {
            //Cedula o carnet no repetido
            const [resultCedula] = await connection.query(
                'SELECT cedulaCarnet FROM usuario WHERE CedulaCarnet = ?',
                [cedulaCarnet]
            )
            if (resultCedula.length > 0) {
                return false
            }

            //Correo Email no repetido
            const [resultEmail] = await connection.query(
                'SELECT correoEmail FROM usuario WHERE CorreoEmail = ?',
                [correoEmail]
            )
            if (resultEmail.length > 0) {
                return false
            }
            //Telefono no repetido
            const [resultTelefono] = await connection.query(
                'SELECT telefono FROM usuario WHERE Telefono = ?',
                [telefono]
            )
            if (resultTelefono.length > 0) {
                return false
            }

            //Validar que el rol exista
            const [resultRole] = await connection.query(
                'SELECT idRol FROM rol WHERE idRol = ?',
                [idRol]
            )
            if (resultRole.length <= 0) {
                return false
            }

            const hashedPassword = await bcrypt.hash(contrasena, 10)

            await connection.query(
                'INSERT INTO Usuario (CedulaCarnet, Nombre, CorreoEmail, CorreoInstitucional, Contrasena, Telefono, Telefono2, Direccion, idRol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [cedulaCarnet, nombre, correoEmail, correoInstitucional, hashedPassword, telefono, telefono2, direccion, idRol]
            )
        }
        catch (error) {
            throw new Error("Error al crear usuario")
        }

        const [user] = await connection.query(
            `SELECT *
             FROM usuario WHERE CedulaCarnet = ?;`,
            [cedulaCarnet]
        )
        return user[0]
    }

    static async delete ({ id }) {
        try {
            await connection.query(
                'DELETE FROM usuario WHERE CedulaCarnet = ?',
                [id]
            )
        }
        catch (error) {
            throw new Error("Error al eliminar el usuario")
        }
        return true
    }

    static async update({ id, input }) {
        const {
            nombre,
            correoEmail,
            correoInstitucional,
            contrasena,
            telefono,
            telefono2,
            direccion,
            idRol
        } = input
        try {

            //Correo Email no repetido
            const [resultEmail] = await connection.query(
                'SELECT correoEmail FROM usuario WHERE CorreoEmail = ?',
                [correoEmail]
            )
            if (resultEmail.length > 0) {
                return false
            }
            //Telefono no repetido
            const [resultTelefono] = await connection.query(
                'SELECT telefono FROM usuario WHERE Telefono = ?',
                [telefono]
            )
            if (resultTelefono.length > 0) {
                return false
            }
            let hashedPassword = contrasena
            if(contrasena){
                 hashedPassword = await bcrypt.hash(contrasena, 10)
            }


            const [result] = await connection.query(
                `UPDATE usuario
       SET Nombre = COALESCE(?, Nombre),
           CorreoEmail = COALESCE(?, CorreoEmail),
           CorreoInstitucional = COALESCE(?, CorreoInstitucional),
           Contrasena = COALESCE(?, Contrasena),
           Telefono = COALESCE(?, Telefono),
           Telefono2 = COALESCE(?, Telefono2),
           Direccion = COALESCE(?, Direccion),
           idRol = COALESCE(?, idRol)
           
       WHERE CedulaCarnet = ?;`,
                [nombre, correoEmail, correoInstitucional, hashedPassword, telefono, telefono2, direccion, idRol, id]
            );
            if (result.affectedRows === 0) {
                throw new Error('No se encontro el usuario con ese id');
            }

            const [updatedUser] = await connection.query(
                `SELECT *
                    FROM usuario WHERE CedulaCarnet = ?;`,
                [id]
            );

            return updatedUser[0];
        } catch (error) {
            throw new Error("Error al actualizar usuario");
        }
    }

}