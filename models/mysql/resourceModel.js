import mysql from 'mysql2/promise'

import { DBConfig } from '../../DBConfig.js'

const connection = await mysql.createConnection(DBConfig)

export class resourceModel {

    static async getAll () {
        const [resources] = await connection.query(
            'SELECT * FROM recursos',
        )
        return resources
    }

    static async getById ({ id }) {
        const [resource] = await connection.query(
            'SELECT * FROM recursos WHERE idRecursos = ?',
            [id]
        )
        if(resource.length === 0) {
            return null
        }

        return resource[0]
    }

    static async create ({ input }) {
        const {
            nombre,
        } = input

        try {
            const [result] = await connection.query(
                'SELECT nombre FROM recursos WHERE Nombre = ?',
                [nombre]
            )

            if (result.length > 0) {
                return false
            }

            await connection.query(
                'INSERT INTO recursos (Nombre) VALUES (?)',
                [nombre]
            )
        }
        catch (error) {
            throw new Error("Error al crear el recurso")
        }

        const [resource] = await connection.query(
            `SELECT *
             FROM recursos WHERE idRecursos = LAST_INSERT_ID();`
        )
        return resource[0]
    }

    static async delete ({ id }) {
        try {
            await connection.query(
                'DELETE FROM recursos WHERE idRecursos = ?',
                [id]
            )
        }
        catch (error) {
            throw new Error("Error al eliminar el recurso")
        }
        return true
    }

    static async update({ id, input }) {
        const {
            nombre
        } = input

        try {
            const [duplicate] = await connection.query(
                'SELECT nombre FROM recursos WHERE Nombre = ?',
                [nombre]
            )
            if (duplicate.length > 0) {
                return false
            }

            const [result] = await connection.query(
                `UPDATE recursos
           SET Nombre = COALESCE(?, Nombre)
           WHERE idRecursos = ?;`,
                [nombre, id]
            );
            if (result.affectedRows === 0) {
                throw new Error('No se encontro el recurso con ese id');
            }

            const [updatedResource] = await connection.query(
                `SELECT *
                    FROM recursos WHERE idRecursos = ?;`,
                [id]
            );

            return updatedResource[0];
        } catch (error) {
            throw new Error("Error al actualizar el recurso");
        }
    }

}