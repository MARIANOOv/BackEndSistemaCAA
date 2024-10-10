import {assetModel} from '../models/mysql/assetModel.js';
import {validateAsset, validateAssetUpdate} from '../schemas/assetSchema.js';
export class assetController {

    static async getAll(req, res) {
        const assets = await assetModel.getAll()
        res.json(assets)
    }
    static async getById(req, res) {
        const {id} = req.params
        const asset = await assetModel.getById({id})
        if(asset) return res.json(asset)
        res.status(404).json({message: 'Activo no encontrado'})
    }

    static async getByCategory(req, res) {
        const {id} = req.params
        const asset = await assetModel.getByCategory({id})
        if(asset) return res.json(asset)
        res.status(404).json({message: 'Activos con esa categoria no encontrados'})
    }

    static async create(req, res) {

        const result = validateAsset(req.body)
        if (result.success === false) {
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }
        const newAsset= await assetModel.create({input: req.body})
        if(newAsset === false) return res.status(409).json({message: 'Activo con numero de serie o placa ya existe, tambien puede faltar la categoria a la que pertenece'})
        res.status(201).json(newAsset)
    }

    static async delete(req, res) {
        const {id} = req.params
        const deletedAsset = await assetModel.delete({id})

        if(deletedAsset === false) return res.status(404).json({message: 'Activo no eliminado'})
        res.status(204).json({message: "Se elimino correctamente el Activo"})
    }

    static async update(req, res) {
        const result = validateAssetUpdate(req.body)
        if (result.success === false) {
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }

        const {id} = req.params
        const updatedAsset = await assetModel.update({id, input: req.body})
        if(updatedAsset) return res.json(updatedAsset)
        res.status(404).json({message: 'Activo no actualizado'})
    }
}
