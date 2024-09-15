import {reservationModel} from '../models/mysql/reservationModel.js';
import {validateReservation, validateReservationUpdate} from '../schemas/reservationSchema.js';
export class reservationController {

  static async getAll(req, res) {
    const reservations = await reservationModel.getAll()
    res.json(reservations)
  }
  static async getById(req, res) {
    const {id} = req.params
    const reservation = await reservationModel.getById({id})
    if(reservation) return res.json(reservation)
    res.status(404).json({message: 'Reservación no encontrada'})
  }

  static async getByDate(req, res) {
    const {date} = req.params
    const reservations = await reservationModel.getByDate({date})
    if(reservations.length > 0) return res.json(reservations)
    res.status(404).json({message: 'No hay reservaciones en esa fecha'})
  }

  static async getByRoomId(req, res) {
    const {roomId} = req.params
    const reservations = await reservationModel.getByRoomId({roomId})
    if(reservations.length > 0) return res.json(reservations)
    res.status(404).json({message: 'No hay reservaciones para esta sala'})
  }

  static async getByCubicleId(req, res) {
    const {cubicleId} = req.params
    const reservations = await reservationModel.getByCubicleId({cubicleId})
    if(reservations.length > 0) return res.json(reservations)
    res.status(404).json({message: 'No hay reservaciones para este cubiculo'})
  }

  static async getByUserId(req, res) {
    const {userId} = req.params
    const reservations = await reservationModel.getByUserId({userId})
    if(reservations.length > 0) return res.json(reservations)
    res.status(404).json({message: 'No hay reservaciones asignadas a este usuario'})
  }

  static async create(req, res) {
    const result = validateReservation(req.body)
    if (result.success === false) {
      return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    const newReservation= await reservationModel.create({input: req.body})
    if(newReservation === false) return res.status(409).json({message: 'Dato repetido'})
    res.status(201).json(newReservation)
  }

  static async delete(req, res) {
    const {id} = req.params
    const deletedReservation = await reservationModel.delete({id})

    if(deletedReservation === false) return res.status(404).json({message: 'Reservación no eliminada'})
    res.status(204).json({message: "Se elimino correctamente la reservación"})
  }

  static async update(req, res) {
    const result = validateReservationUpdate(req.body)
    if (result.success === false) {
      return res.status(400).json({error: JSON.parse(result.error.message)})
    }

    const {id} = req.params
    const updatedReservation = await reservationModel.update({id, input: req.body})
    if(updatedReservation ) return res.json(updatedReservation)
    res.status(404).json({message: 'Reservación no actualizada'})
  }
}
