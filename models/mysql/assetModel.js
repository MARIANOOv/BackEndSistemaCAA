import mysql from 'mysql2/promise'
import {DBConfig} from '../../DBConfig.js'


const connection = await mysql.createConnection(DBConfig)

export class assetModel {

    static async getAll () {
        const [assets] = await connection.query(
            'SELECT * FROM activo',
        )
        return assets
    }

    static async getById ({ id }) {
        const [asset] = await connection.query(
            'SELECT * FROM activo WHERE NumeroPlaca = ?',
            [id]
        )
        if(asset.length === 0) {
            return null
        }

        return asset[0]
    }
    static async getByCategory ({ id }) {
        const [assets] = await connection.query(
            'SELECT * FROM activo WHERE idCategoria = ?',
            [id]
        )
        if(assets.length === 0) {
            return null
        }
        return assets
    }

    static async create ({ input }) {
        const {
            numeroPlaca,
            nombre,
            descripcion,
            modelo,
            numeroSerie,
            marca,
            idEstado,
            condicion,
            idCategoria
        } = input
        try {

            const [resultPlaca] = await connection.query(
                'SELECT numeroPlaca FROM activo WHERE NumeroPlaca = ?',
                [numeroPlaca]
            )

            if (resultPlaca.length > 0) {
                return false
            }
            const [resultSerie] = await connection.query(
                'SELECT numeroSerie FROM activo WHERE NumeroSerie = ?',
                [numeroSerie]
            )

            if (resultSerie.length > 0) {
                return false
            }


            const [resultEstado] = await connection.query(
                'SELECT idEstado FROM estado WHERE idEstado = ?',
                [idEstado]
            )
            if(resultEstado.length <= 0) {
                return false
            }


            const [resultCategoria] = await connection.query(
                'SELECT idCategoria FROM categoria WHERE idCategoria = ?',
                [idCategoria]
            )
            if(resultCategoria.length <= 0) {
                return false
            }


            await connection.query(
                'INSERT INTO activo (NumeroPlaca,Nombre,Descripcion,Modelo,NumeroSerie,Marca,idEstado,Condicion,idCategoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [numeroPlaca, nombre, descripcion, modelo, numeroSerie, marca, idEstado, condicion, idCategoria]
            )
        }
        catch (error) {
            throw new Error("Error al crear el activo")
        }

        const [asset] = await connection.query(
            `SELECT *
             FROM activo WHERE NumeroPlaca = ?;`,
            [numeroPlaca]
        )
        return asset[0]
    }

    static async delete ({ id }) {
        try {
            await connection.query(
                'DELETE FROM activo WHERE NumeroPlaca = ?',
                [id]
            )
        }
        catch (error) {
            throw new Error("Error al eliminar el activo")
        }
        return true
    }

    static async update({ id, input }) {
        const {
            nombre,
            descripcion,
            modelo,
            marca,
            idEstado,
            condicion,

        } = input

        try {




            if(idEstado != null){

                const [existEstado] = await connection.query(
                    'SELECT idEstado FROM estado WHERE idEstado = ?',
                    [idEstado]
                )


                if(existEstado.length <= 0) {
                    return false
                }
            }



            const [result] = await connection.query(
                `UPDATE activo
       SET Nombre = COALESCE(?, Nombre),
           Descripcion = COALESCE(?, Descripcion),
           Modelo = COALESCE(?, Modelo),
           Marca = COALESCE(?, Marca),
           idEstado = COALESCE(?, idEstado),
           Condicion = COALESCE(?, Condicion)
       WHERE NumeroPlaca = ?;`,
                [nombre, descripcion, modelo, marca, idEstado, condicion, id]
            );
            if (result.affectedRows === 0) {
                throw new Error('No se encontro activo con ese id');
            }

            const [updatedAsset] = await connection.query(
                `SELECT *
                    FROM activo WHERE NumeroPlaca = ?;`,
                [id]
            );

            return updatedAsset[0];
        } catch (error) {
            throw new Error("Error al actualizar el activo");
        }
    }

}