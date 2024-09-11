import z from 'zod'

const roomSchema = z.object({
    imagen: z.string({
        invalid_type_error: 'La imagen debe ser un string',
        required_error: 'La imagen es requerida'
    }).min(1).max(255),
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }).min(1).max(45),
    descripcion: z.string({
        invalid_type_error: 'La descripcion debe ser un string',
        required_error: 'La descripcion es requerida'
    }).min(1).max(250),
    restricciones: z.string({
        invalid_type_error: 'Las restricciones deben ser un string'
    }).min(1).max(250),
    estado: z.boolean({
        invalid_type_error: 'El estado debe ser un booleano',
        required_error: 'El estado es requerido'
    })
})

export function validateRoom(input) {
    return roomSchema.safeParse(input)
}

export function validateRoomUpdate(input) {
    return roomSchema.partial().safeParse(input)
}