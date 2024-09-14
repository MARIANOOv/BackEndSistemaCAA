import {applicationModel} from '../models/mysql/applicationModel.js';
import {validateApplication, validateApplicationUpdate} from '../schemas/applicationSchema.js';

export class applicationController {

    static async getAll(req, res) {
        const applications = await applicationModel.getAll()
        res.json(applications)
    }

    static async getById(req, res) {
        const {id} = req.params
        const application = await applicationModel.getById({id})
        if(application) return res.json(application)
        res.status(404).json({message: 'Solicitud no encontrada'})
    }

    static async create(req, res) {

        const result = validateApplication(req.body)
        if (result.success === false) {
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }
        const newApplication= await applicationModel.create({input: req.body})
        if(newApplication === false) return res.status(409).json({message: 'Dato repetido'})
        res.status(201).json(newApplication)
    }

    static async delete(req, res) {
        const {id} = req.params
        const deletedApplication = await applicationModel.delete({id})

        if(deletedApplication === false) return res.status(404).json({message: 'Solicitud no eliminada'})
        res.status(204).json({message: "Se elimino correctamente la solicitud"})
    }

    static async update(req, res) {
        const result = validateApplicationUpdate(req.body)
        if (result.success === false) {
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }

        const {id} = req.params
        const updatedApplication = await applicationModel.update({id, input: req.body})
        if(updatedApplication) return res.json(updatedApplication)
        res.status(404).json({message: 'Solicitud no actualizada'})
    }
}
