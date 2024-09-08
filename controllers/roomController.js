import {RoomModel} from '../models/mysql/roomModel.js';

export class RoomController {
    static async getAll(req, res) {
        const rooms = await RoomModel.getAll()
        res.json(rooms)
    }
}
