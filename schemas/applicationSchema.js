import z from 'zod'

const userSchema = z.object({
    estado: z.string({
        invalid_type_error: 'El estado debe ser un string',
        required_error: 'El estado es requerido'
    }).min(6).max(45),
    idUsuario: z.number().int({
        invalid_type_error: 'El idUsuario debe ser un numero entero',
        required_error: 'El idUsuario es requerido'
    }).positive(),
    idActivo: z.number().int({
        invalid_type_error: 'El idActivo debe ser un numero entero',
        required_error: 'El idActivo es requerido'
    }).positive(),
    archivoSolicitud:  z.string({
        invalid_type_error: 'El archivoSolicitud debe ser un pdf',
        required_error: 'El archivoSolicitud es requerido'
    }),
    fechaInicio: z.string({
        invalid_type_error: 'La fechaInicio debe ser un date',
        required_error: 'La fechaInicio es requerida'
    }),
    fechaFin: z.string({
        invalid_type_error: 'La fechaFin debe ser un date',
        required_error: 'La fechaFin es requerida'
    })
})

export function validateApplication(input) {
    return userSchema.safeParse(input)
}

export function validateApplicationUpdate(input) {
    return userSchema.partial().safeParse(input)
}