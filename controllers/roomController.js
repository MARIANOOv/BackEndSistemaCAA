import {RoomModel} from '../models/mysql/roomModel.js';

export class RoomController {
    static async getAll(req, res) {
        const rooms = await RoomModel.getAll()
        res.json(rooms)
    }
    static async getById(req, res) {
        const {id}= req.params
        const rooms = await RoomModel.getById({id})
        if(rooms) return res.json(rooms)
        res.status(404).json({message: 'Room not found'})
    }
    static async create(req, res) {


        //VALIDAR CON ZOD


        const newRoom= await RoomModel.create({input: req.body})

        res.status(201).json(newRoom)
    }
    static async delete(req, res) {
        const {id} = req.params
        const deletedRoom = await RoomModel.delete({id})

        if(deletedRoom === false) return res.status(404).json({message: 'Sala no eliminada'})
        res.status(204).json({message: "Se elimino correctamente la sala"})
    }

    static async update(req, res) {
        const {id} = req.params
        const updatedRoom = await RoomModel.update({id, input: req.body})
        if(updatedRoom) return res.json(updatedRoom)
        res.status(404).json({message: 'Sala no actualizada'})
    }
}
