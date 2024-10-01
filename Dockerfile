# Usar la imagen oficial de Node.js
FROM node:18-alpine

# Crear un directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install --production

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto que usa la aplicación (3000, o el que uses en tu app)
EXPOSE 3000

# Definir la variable de entorno para producción
ENV NODE_ENV=production

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]
