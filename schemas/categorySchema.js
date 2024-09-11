import z from 'zod'

const categorySchema = z.object({
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }).min(1).max(45)
})

export function validateCategory(input) {
    return categorySchema.safeParse(input)
}

export function validateCategoryUpdate(input) {
    return categorySchema.partial().safeParse(input)
}