import z from 'zod'

const reservationSchema = z.object({
  fecha: z.string({
    required_error: 'La fecha es requerido'
  }),
  idSala: z.number().int({
    invalid_type_error: 'El idSala debe ser un numero entero',
  }).positive().nullable().optional(),
  idCubiculo: z.number().int({
    invalid_type_error: 'El idCubiculo debe ser un numero entero',
  }).positive().nullable().optional(),
  idUsuario: z.number().int({
    invalid_type_error: 'El idUsuario debe ser un numero entero',
    required_error: 'El idUsuario es requerido'
  }).positive(),
  observaciones: z.string({
    invalid_type_error: 'Las observaciones deben ser un string',
  }).min(1).max(250).nullable().optional(),
  refrigerio: z.boolean({
    invalid_type_error: 'El refrigerio debe ser un boleano',
  }).nullable().optional(),
})

export function validateReservation(input) {
  return reservationSchema.safeParse(input)
}

export function validateReservationUpdate(input) {
  return reservationSchema.partial().safeParse(input)
}
