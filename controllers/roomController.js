import {RoomModel} from '../models/mysql/roomModel.js';
import {validateRoom, validateRoomUpdate} from '../schemas/roomSchema.js';
export class RoomController {

    static async getAll(req, res) {
        const rooms = await RoomModel.getAll()
        res.json(rooms)
    }
    static async getById(req, res) {
        const {id} = req.params
        const room = await RoomModel.getById({id})
        if(room) return res.json(room)
        res.status(404).json({message: 'Sala no encontrada'})
    }

    static async create(req, res) {

        const result = validateRoom(req.body)
        if (result.success === false) {
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }
        const newRoom= await RoomModel.create({input: req.body})
        if(newRoom === false) return res.status(409).json({message: 'Sala con ese nombre ya existe'})
        res.status(201).json(newRoom)
    }

    static async delete(req, res) {
        const {id} = req.params
        const deletedRoom = await RoomModel.delete({id})

        if(deletedRoom === false) return res.status(404).json({message: 'Sala no eliminada'})
        res.status(204).json({message: "Se elimino correctamente la sala"})
    }

    static async update(req, res) {
        const result = validateRoomUpdate(req.body)
        if (result.success === false) {
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }

        const {id} = req.params
        const updatedRoom = await RoomModel.update({id, input: req.body})
        if(updatedRoom) return res.json(updatedRoom)
        res.status(404).json({message: 'Sala no actualizada'})
    }
}
