import z from 'zod'

const stateSchema = z.object({

  tipo  : z.string({
    invalid_type_error: 'El tipo debe ser un string',
    required_error: 'El tipo es requerido'
  }).min(1).max(45)
})

export function validateState(input) {
  return stateSchema.safeParse(input)
}

export function validateStateUpdate(input) {
  return stateSchema.partial().safeParse(input)
}