import z from 'zod'

const roleSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }).min(1).max(45)
})

export function validateRole(input) {
    return roleSchema.safeParse(input)
}

export function validateRoleUpdate(input) {
    return roleSchema.partial().safeParse(input)
}