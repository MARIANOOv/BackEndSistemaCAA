import mysql from 'mysql2/promise'



const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '12345678',
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

    }

    static async create ({ input }) {

    }

    static async delete ({ id }) {

    }

    static async update ({ id, input }) {

    }
}