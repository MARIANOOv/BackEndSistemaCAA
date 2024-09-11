import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '1811',
    database: 'sistemacaa',
}

const connection = await mysql.createConnection(config)

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

    static async create ({ input }) {
        const {
            imagen,
            nombre,
            descripcion,
            restricciones,
            estado
        } = input
        try {

            const [result] = await connection.query(
                'SELECT nombre FROM sala WHERE Nombre = ?',
                [nombre]
            )

            if (result.length > 0) {
                return false
            }

            await connection.query(
                'INSERT INTO sala (Imagen, Nombre, Descripcion, Restricciones, Estado) VALUES (?, ?, ?, ?, ?)',
                [imagen, nombre, descripcion, restricciones, estado]
            )
        }
        catch (error) {
            throw new Error("Error al crear la sala")
        }

        const [room] = await connection.query(
            `SELECT *
             FROM sala WHERE idSala = LAST_INSERT_ID();`
        )
        return room[0]
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

}