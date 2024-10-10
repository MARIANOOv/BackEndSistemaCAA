import z from 'zod'

const assetSchema = z.object({
    numeroPlaca: z.number().int({
        invalid_type_error: 'El Numero de placa debe ser un numero entero',
        required_error: 'El Numero de placa es requerido'
    }).positive(),
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }).min(1).max(45),
    descripcion: z.string({
        invalid_type_error: 'La descripcion debe ser un string',
        required_error: 'La descripcion es requerida'
    }).min(1).max(255),
    modelo: z.string({
        invalid_type_error: 'El modelo debe ser un string',
        required_error: 'El modelo es requerido'
    }).min(1).max(45),
    numeroSerie: z.string({
        invalid_type_error: 'El numero de serie debe ser alfanumerico',
        required_error: 'El numero de serie es requerido'
    }).min(4).max(60),
    marca: z.string({
        invalid_type_error: 'La marca debe ser un string',
        required_error: 'La marca es requerida'
    }).min(1).max(45),
    idEstado: z.number().int({
        invalid_type_error: 'El idEstado debe ser un numero entero',
    }).positive(),
    idCategoria:  z.number().int({
        invalid_type_error: 'El idCategoria debe ser un numero entero',
        required_error: 'El idCategoria es requerido'
    }).positive()
})

export function validateAsset(input) {
    return assetSchema.safeParse(input)
}

export function validateAssetUpdate(input) {
    return assetSchema.partial().safeParse(input)
}