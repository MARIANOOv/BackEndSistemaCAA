import {userModel} from '../models/mysql/userModel.js';
import {validateUser, validateUserUpdate} from '../schemas/userSchema.js';
import jwt from 'jsonwebtoken';
import {sendEmail} from "../services/emailService.js";

export class userController {

    static async getAll(req, res) {
        const users = await userModel.getAll()
        res.json(users)
    }
    static async getById(req, res) {
        const {id} = req.params
        const user = await userModel.getById({id})
        if(user) return res.json(user)
        res.status(404).json({message: 'Usuario no encontrado'})
    }

    // En el controlador userController.js
    static async create(req, res) {
        const result = validateUser(req.body);
        if (result.success === false) {
            return res.status(400).json({ message: JSON.parse(result.error.message) });
        }

        const newUser = await userModel.create({ input: req.body });

        // Si el modelo retorna un mensaje de error, responde con un 409 (conflicto) y el mensaje adecuado
        if (typeof newUser === 'string') {
            return res.status(409).json({ message: newUser });
        }

        // Si la creación fue exitosa, responde con el nuevo usuario creado
        res.status(201).json(newUser);
    }


    static async delete(req, res) {
        const {id} = req.params
        const deletedUser = await userModel.delete({id})

        if(deletedUser === false) return res.status(404).json({message: 'Usuario no eliminado'})
        res.status(204).json({message: "Se elimino correctamente el usuario"})
    }

    static async update(req, res) {
        const result = validateUserUpdate(req.body);
        if (result.success === false) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }

        const { id } = req.params;
        const updatedUser = await userModel.update({ id, input: req.body });

        // Si el modelo retorna un mensaje de error, envíalo como respuesta
        if (typeof updatedUser === 'string') {
            // Responde con el mensaje de error específico
            return res.status(409).json({ message: updatedUser });
        }

        // Si no hubo errores, envía una respuesta de éxito
        return res.json({ message: 'Usuario actualizado correctamente' });
    }

    static async login(req, res) {

        const user = await userModel.login({input: req.body})

        if(!user) return res.status(404).json({message: 'Credenciales incorrectas'})

        if(user.Estado === 1){
            return res.status(403).json({message: 'Su cuenta se encuentra bloqueada, comuniquese con la administración'})
        }
        else{

            const token = jwt.sign({id: user.CedulaCarnet,role:user.RolNombre}, 'OKDIJITOCUALQUIERCOSAQUEDIGAMARIANO', {expiresIn: '1d'})
            return res.json(token)
        }

    }

    static async sendAllEmail(req, res) {
        try {

            const { asunto, descripcion } = req.body;


            if (!asunto || !descripcion) {
                return res.status(400).json({ message: 'Asunto y descripción son requeridos' });
            }


            const emails = await userModel.getAllEmails();


            for (let i = 0; i < emails.length; i++) {
                const { CorreoEmail } = emails[i];


                const emailSubject = asunto;
                const emailText = descripcion;
                const emailHtml = `
  <div style="padding: 20px; background-color: #f4f4f4;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <!-- Contenedor del Logo Centrador -->
          <table border="0" cellpadding="0" cellspacing="0" style="text-align: center;">
            <tr>
              <!-- Texto "TEC" -->
              <td style="background-color: #ffffff; padding: 10px 20px; color: #000000; font-family: 'Georgia', serif; font-size: 36px; font-weight: bold;">
                TEC
              </td>
              <!-- Línea Roja Separadora -->
              <td style="width: 5px; background-color: #c1272d;"></td>
              <!-- Texto "Tecnológico de Costa Rica" -->
              <td style="background-color: #ffffff; padding: 10px 20px; color: #000000; font-family: 'Georgia', serif; font-size: 18px;">
                Centro Académico<br>de Alajuela
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px 0;">
          <!-- Asunto -->
          <h1 style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${asunto}</h1>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 10px 0;">
          <!-- Descripción -->
          <p style="font-size: 16px; color: #555; line-height: 1.5; margin: 0; text-align: justify;">
            ${descripcion}
          </p>
        </td>
      </tr>
    </table>
  </div>
`;









                // Enviar el correo electrónico
                await sendEmail(
                    CorreoEmail,  // Correo del usuario actual en la iteración
                    emailSubject,  // Asunto del correo
                    emailText,     // Texto plano del correo
                    emailHtml      // HTML del correo
                );
            }

            // Responder con éxito
            res.json({ message: 'Correos enviados correctamente' });

        } catch (error) {
            // Manejo de errores
            console.error(error);
            res.status(500).json({ message: 'Error al enviar los correos' });
        }
    }


}
