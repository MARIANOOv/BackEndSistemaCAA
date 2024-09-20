import {RoomModel} from '../models/mysql/roomModel.js';
import {validateRoom, validateRoomUpdate} from '../schemas/roomSchema.js';
export class RoomController {

    static async getAll(req, res) {
        try {
            const rooms = await RoomModel.getAll();

            // Convertir los blobs a base64
            const roomsWithBase64Images = rooms.map((room) => {
                if (room.Imagen) {
                    // Convertir el blob a base64
                    const base64Image = room.Imagen.toString('base64');
                    return {
                        ...room,
                        Imagen: base64Image // Aquí asignamos la imagen convertida a base64
                    };
                } else {
                    return room;
                }
            });

            res.json(roomsWithBase64Images);
        } catch (error) {
            console.error('Error al obtener las salas:', error);
            res.status(500).json({ message: 'Error al obtener las salas' });
        }
    }

    static async getById(req, res) {
        const {id} = req.params
        const room = await RoomModel.getById({id})
        if(room) return res.json(room)
        res.status(404).json({message: 'Sala no encontrada'})
    }

    static async create(req, res) {

        // Obtener el buffer de la imagen (blob) desde req.file
        const imagen = req.file ? req.file.buffer : null;

        // Crear el objeto de la sala con todos los datos incluyendo la imagen
        const newRoom = await RoomModel.create({
            input: {
                imagen, // Aquí pasamos el blob de la imagen
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                restricciones: req.body.restricciones,
                estado: req.body.estado === 'true' || req.body.estado === '1', // Convertir estado a booleano
            }
        });

        const result = validateRoomUpdate(newRoom)
        if (result.success === false) {
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }

        if (newRoom === false) return res.status(409).json({message: 'Sala con ese nombre ya existe'});
        res.status(201).json(newRoom);
    }


    static async delete(req, res) {
        const {id} = req.params
        const deletedRoom = await RoomModel.delete({id})

        if(deletedRoom === false) return res.status(404).json({message: 'Sala no eliminada'})
        res.status(204).json({message: "Se elimino correctamente la sala"})
    }

    static async update(req, res) {
        try {
            // Si hay archivos (por ejemplo, imagen), agregarlos al cuerpo de la solicitud
            let updateData = req.body;
            if (req.file) {
                updateData.imagen = req.file.buffer;  // O req.file.path si guardas la imagen en el sistema de archivos
            }

            if (updateData.estado !== undefined) {
                updateData.estado = updateData.estado === 'true' || updateData.estado === '1';
            }

            // Validar los datos de la sala
            const result = validateRoomUpdate(updateData);
            if (result.success === false) {
                return res.status(400).json({ error: JSON.parse(result.error.message) });
            }

            const { id } = req.params;

            // Actualizar la sala en la base de datos
            const updatedRoom = await RoomModel.update({ id, input: updateData });
            if (updatedRoom) {
                return res.json(updatedRoom);
            }

            res.status(404).json({ message: 'Sala no actualizada' });
        } catch (error) {
            console.error('Error al actualizar la sala:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

}
