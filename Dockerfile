# Usar una imagen base con Node.js preinstalado
FROM node:16-alpine

# Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar todo el código de tu proyecto al contenedor
COPY . .

# Compilar el proyecto (si es necesario, dependiendo de tu configuración)
RUN npm run build

# Exponer el puerto en el que la app va a correr dentro del contenedor
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]
