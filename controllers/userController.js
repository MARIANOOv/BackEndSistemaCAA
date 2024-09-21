import {userModel} from '../models/mysql/userModel.js';
import {validateUser, validateUserUpdate} from '../schemas/userSchema.js';
import jwt from 'jsonwebtoken';


import 'dotenv/config';

export class userController {

    static async getAll(req, res) {
        const users = await userModel.getAll()
        res.json(users)
    }
    static async getById(req, res) {
        const {id} = req.params
        const user = await userModel.getById({id})
        if(user) return res.status(200).json(user)
        res.status(404).json({message: 'Usuario no encontrado'})
    }

    static async login(req, res) {
        const user = await userModel.login({input: req.body})
        if(user){
            const token = jwt.sign({id: user.CedulaCarnet, role: user.Role}, process.env.JWT_SECRET, {expiresIn: '1d'})
            return res.status(200).json({token})
        }

        res.status(404).json({message: 'Usuario no encontrado'})
    }

    static async create(req, res) {

        const result = validateUser(req.body)
        if (result.success === false) {
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }
        const newUser= await userModel.create({input: req.body})
        if(newUser === false) return res.status(409).json({message: 'Dato repetido'})
        res.status(201).json(newUser)
    }

    static async delete(req, res) {
        const {id} = req.params
        const deletedUser = await userModel.delete({id})

        if(deletedUser === false) return res.status(404).json({message: 'Usuario no eliminado'})
        res.status(204).json({message: "Se elimino correctamente el usuario"})
    }

    static async update(req, res) {
        const result = validateUserUpdate(req.body)
        if (result.success === false) {
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }

        const {id} = req.params
        const updatedUser = await userModel.update({id, input: req.body})
        if(updatedUser) return res.json(updatedUser)
        res.status(404).json({message: 'Usuario no actualizado'})
    }
}
