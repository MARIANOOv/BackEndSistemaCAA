import mysql from 'mysql2/promise'



const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'root',
    database: 'sistemacaa',
}

const connection = await mysql.createConnection(config)

export class categoryModel {

    static async getAll () {
        const [categories] = await connection.query(
            'SELECT * FROM categoria',
        )
        return categories
    }

    static async getById ({ id }) {
        const [category] = await connection.query(
            'SELECT * FROM categoria WHERE idCategoria = ?',
            [id]
        )
        if(category.length === 0) {
            return null
        }

        return category[0]
    }

    static async create ({ input }) {
        const {
            nombre,
        } = input
        try {

            const [result] = await connection.query(
                'SELECT nombre FROM categoria WHERE Nombre = ?',
                [nombre]
            )

            if (result.length > 0) {
                return false
            }

            await connection.query(
                'INSERT INTO categoria (Nombre) VALUES (?)',
                [nombre]
            )
        }
        catch (error) {
            throw new Error("Error al crear la Categoria")
        }

        const [category] = await connection.query(
            `SELECT *
             FROM categoria WHERE idCategoria = LAST_INSERT_ID();`
        )
        return category[0]
    }

    static async delete ({ id }) {
        try {
            await connection.query(
                'DELETE FROM categoria WHERE idCategoria = ?',
                [id]
            )
        }
        catch (error) {
            throw new Error("Error al eliminar la Categoria")
        }
        return true
    }

    static async update({ id, input }) {
        const {
            nombre
        } = input

        try {

            const [duplicate] = await connection.query(
                'SELECT nombre FROM categoria WHERE Nombre = ?',
                [nombre]
            )
            if (duplicate.length > 0) {
                return false
            }

            const [result] = await connection.query(
                `UPDATE categoria
       SET Nombre = COALESCE(?, Nombre)
       WHERE idCategoria = ?;`,
                [nombre, id]
            );
            if (result.affectedRows === 0) {
                throw new Error('No se encontro la categoria con ese id');
            }

            const [updatedCategory] = await connection.query(
                `SELECT *
                    FROM categoria WHERE idCategoria = ?;`,
                [id]
            );

            return updatedCategory[0];
        } catch (error) {
            throw new Error("Error al actualizar la Categoria");
        }
    }

}