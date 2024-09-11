import z from 'zod'

const resourceSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }).min(1).max(45)
})

export function validateResource(input) {
    return resourceSchema.safeParse(input)
}

export function validateResourceUpdate(input) {
    return resourceSchema.partial().safeParse(input)
}