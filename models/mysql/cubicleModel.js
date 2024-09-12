import mysql from 'mysql2/promise'

import { DBConfig } from '../../DBConfig.js'

const connection = await mysql.createConnection(DBConfig)

export class cubicleModel {

    static async getAll () {
        const [cubicles] = await connection.query(
            'SELECT * FROM cubiculo',
        )
        return cubicles
    }

    static async getById ({ id }) {
        const [cubicle] = await connection.query(
            'SELECT * FROM cubiculo WHERE idCubiculo = ?',
            [id]
        )
        if(cubicle.length === 0) {
            return null
        }

        return cubicle[0]
    }

    static async create ({ input }) {
        const {
            nombre,
            ventana
        } = input
        try {

            const [result] = await connection.query(
                'SELECT nombre FROM cubiculo WHERE Nombre = ?',
                [nombre]
            )

            if (result.length > 0) {
                return false
            }

            await connection.query(
                'INSERT INTO cubiculo (Nombre, Ventana) VALUES (?, ?)',
                [nombre, ventana]
            )
        }
        catch (error) {
            throw new Error("Error al crear el cubiculo")
        }

        const [cubicle] = await connection.query(
            `SELECT *
             FROM cubiculo WHERE idCubiculo = LAST_INSERT_ID();`
        )
        return cubicle[0]
    }

    static async delete ({ id }) {
        try {
            await connection.query(
                'DELETE FROM cubiculo WHERE idCubiculo = ?',
                [id]
            )
        }
        catch (error) {
            throw new Error("Error al eliminar el cubiculo ")
        }
        return true
    }

    static async update({ id, input }) {
        const {
            nombre,
            ventana
        } = input

        try {
            const [duplicate] = await connection.query(
                'SELECT nombre FROM cubiculo WHERE Nombre = ?',
                [nombre]
            )
            if (duplicate.length > 0) {
                return false
            }

            const [result] = await connection.query(
                `UPDATE cubiculo
       SET Nombre = COALESCE(?, Nombre),
           Ventana = COALESCE(?, Ventana)
       WHERE idCubiculo = ?;`,
                [nombre, ventana, id]
            );

            if (result.affectedRows === 0) {
                throw new Error('No se encontro el cubiculo con ese id');
            }

            const [updatedCubicle] = await connection.query(
                `SELECT *
                    FROM cubiculo WHERE idCubiculo = ?;`,
                [id]
            );

            return updatedCubicle[0];
        } catch (error) {
            throw new Error("Error al actualizar el cubiculo");
        }
    }

}