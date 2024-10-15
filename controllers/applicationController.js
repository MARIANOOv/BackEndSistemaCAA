import { applicationModel } from '../models/mysql/applicationModel.js';
import { validateApplication, validateApplicationUpdate } from '../schemas/applicationSchema.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

export class applicationController {

    static async getAll(req, res) {
        const applications = await applicationModel.getAll();
        res.json(applications);
    }

    static async getById(req, res) {
        const { id } = req.params;
        const application = await applicationModel.getById({ id });
        if (application) return res.json(application);
        res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    static async getByUserId(req, res) {
        const { userId } = req.params;
        const applications = await applicationModel.getByUserId({ userId });
        if(applications.length > 0) return res.json(applications)
        res.status(404).json({message: 'No hay solicitudes realizadas por este usuario'})
    }

    static create = [
        upload.single('archivoSolicitud'),  // Middleware de multer para manejar el archivo
        async (req, res) => {
            // Convertir `idUsuario` e `idActivo` a números antes de la validación
            const idUsuario = parseInt(req.body.idUsuario, 10);
            const idActivo = parseInt(req.body.idActivo, 10);

            // Añadir `archivoSolicitud` temporalmente para pasar la validación del esquema
            const inputForValidation = {
                ...req.body,
                idUsuario,
                idActivo,
                archivoSolicitud: req.file ? req.file.path : undefined  // Añadir la ruta del archivo o `undefined`
            };

            // Validar datos del cuerpo de la solicitud
            const result = validateApplication(inputForValidation);
            if (result.success === false) {
                return res.status(400).json({ error: JSON.parse(result.error.message) });
            }

            // Verificar que el archivo haya sido subido
            if (!req.file) {
                return res.status(400).json({ error: 'El archivo PDF es obligatorio' });
            }

            // Construir el objeto `input` para el modelo después de la validación
            const input = {
                ...req.body,
                idUsuario,
                idActivo,
                archivoSolicitud: req.file.path  // Ruta del archivo guardado
            };

            // Crear la nueva solicitud en el modelo
            const newApplication = await applicationModel.create({ input });
            if (newApplication === false) {
                return res.status(409).json({ message: 'Dato repetido' });
            }
            res.status(201).json(newApplication);
        }
    ];



    static async delete(req, res) {
        const { id } = req.params;
        const deletedApplication = await applicationModel.delete({ id });

        if (deletedApplication === false) {
            return res.status(404).json({ message: 'Solicitud no eliminada' });
        }
        res.status(204).json({ message: "Se eliminó correctamente la solicitud" });
    }

    static async update(req, res) {
        const result = validateApplicationUpdate(req.body);
        if (result.success === false) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }

        const { id } = req.params;
        const updatedApplication = await applicationModel.update({ id, input: req.body });
        if (updatedApplication) return res.json(updatedApplication);
        res.status(404).json({ message: 'Solicitud no actualizada' });
    }
}
