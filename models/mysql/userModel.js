import mysql from 'mysql2/promise'
import {DBConfig} from '../../DBConfig.js'
import bcrypt from 'bcrypt'
import {sendEmail} from "../../services/emailService.js";

const connection = await mysql.createConnection(DBConfig)

export class userModel {

    static async getAll () {
        const [users] = await connection.query(
            `SELECT 
        u.CedulaCarnet,
        u.Nombre,
        u.CorreoEmail,
        u.Contrasena,
        u.Telefono,
        u.Telefono2,
        u.Direccion,
        u.Estado,
        u.CorreoInstitucional,
        r.nombre AS NombreRol,
        r.idRol AS idRol
        FROM 
            usuario u
        JOIN 
            rol r ON u.idRol = r.idRol;`,
        )
        return users
    }

    static async getAllEmails() {
        const [emails] = await connection.query(
            `SELECT CorreoEmail FROM usuario`
        );
        return emails;
    }

    static async login ({ input }) {
        const { email, password} = input
        const [user] = await connection.query(
            `SELECT u.Contrasena, u.CedulaCarnet, u.Estado, r.nombre AS RolNombre
     FROM usuario u
     JOIN rol r ON u.idRol = r.idRol
     WHERE u.CorreoEmail = ? OR u.CorreoInstitucional = ?`,
            [email, email]
        )


        if(user.length === 0) {
            return null
        }
        const isValid = await bcrypt.compare(password, user[0].Contrasena)
        if (!isValid) {
            return null
        }
        return user[0]
    }

    static async getById ({ id }) {
        const [user] = await connection.query(
            'SELECT * FROM Usuario WHERE CedulaCarnet = ?',
            [id]
        )
        if(user.length === 0) {
            return null
        }
        return user[0]
    }


    // En el modelo userModel.js
    static async create({ input }) {
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
        } = input;

        try {
            const [resultCedula] = await connection.query(
              'SELECT cedulaCarnet FROM usuario WHERE cedulaCarnet = ?',
              [cedulaCarnet]
            );

            if (resultCedula.length > 0) {
                throw new Error('Usuario existente con esa cédula');
            }

            const [resultEmail] = await connection.query(
              'SELECT correoEmail FROM usuario WHERE correoEmail = ?',
              [correoEmail]
            );

            if (resultEmail.length > 0) {
                throw new Error('Usuario existente con ese correo');
            }

            const [resultTelefono] = await connection.query(
              'SELECT telefono FROM usuario WHERE telefono = ?',
              [telefono]
            );

            if (resultTelefono.length > 0) {
                throw new Error('Usuario existente con ese teléfono');
            }

            const [resultRole] = await connection.query(
              'SELECT idRol FROM rol WHERE idRol = ?',
              [idRol]
            );

            if (resultRole.length <= 0) {
                throw new Error('Rol no válido');
            }

            const hashedPassword = await bcrypt.hash(contrasena, 10);

            await connection.query(
              'INSERT INTO usuario (CedulaCarnet, Nombre, CorreoEmail, CorreoInstitucional, Contrasena, Telefono, Telefono2, Direccion, Estado, idRol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [cedulaCarnet, nombre, correoEmail, correoInstitucional, hashedPassword, telefono, telefono2, direccion, true, idRol]
            );

            const [user] = await connection.query(
              `SELECT * FROM usuario WHERE CedulaCarnet = ?;`,
              [cedulaCarnet]
            );

            return user[0];
        } catch (error) {
            return error.message; // Retorna el mensaje de error
        }
    }


    static async delete ({ id }) {
        try {
            await connection.query(
                'DELETE FROM usuario WHERE CedulaCarnet = ?',
                [id]
            )
        }
        catch (error) {
            throw new Error(error)
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
            estado,
            idRol
        } = input
        try {


            const [resultEmail] = await connection.query(
                'SELECT correoEmail FROM usuario WHERE CorreoEmail = ?',
                [correoEmail]
            )
            if (resultEmail.length > 0) {
                throw new Error('Usuario existente con ese correo');
            }

            const [resultTelefono] = await connection.query(
                'SELECT telefono FROM usuario WHERE Telefono = ?',
                [telefono]
            )
            if (resultTelefono.length > 0) {
                throw new Error('Usuario existente con ese teléfono');
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
           Estado = COALESCE(?, Estado),
           idRol = COALESCE(?, idRol)
           
       WHERE CedulaCarnet = ?;`,
                [nombre, correoEmail, correoInstitucional, hashedPassword, telefono, telefono2, direccion, estado, idRol, id]
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
            return error.message;
        }
    }

}