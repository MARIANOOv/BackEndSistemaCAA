import z from 'zod'

const cubicleSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }).min(1).max(45),
    ventana: z.boolean({
        invalid_type_error: 'La ventana debe ser un booleano',
        required_error: 'La ventana es requerida'
    })
})

export function validateCubicle(input) {
    return cubicleSchema.safeParse(input)
}

export function validateCubicleUpdate(input) {
    return cubicleSchema.partial().safeParse(input)
}