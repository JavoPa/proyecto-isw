# Proyecto ingeniería de software

## Descripción

- Software para facilitar y optimizar el proceso de solicitud, revisión, y asignación de becas a estudiantes, garantizando una gestión eficiente y transparente de las becas municipale

## Requisitos funcionales

# Postulación y Renovación
- Que un postulante pueda ver las becas disponibles y sus requisitos, para poder postular solamente a una beca, siendo capaz de subir los archivos requeridos dentro del tiempo establecido de 2 semanas luego de la publicación de las becas, y pueda renovar sus becas o postular nuevamente con sus datos personales registrados, luego de esto la postulación se guarda en la base de datos. 
Estado y apelación

- Que el encargado de becas pueda ver las apelaciones y actualizar los motivos de rechazo de una beca, además, que un postulante pueda ver el estado de postulación en tiempo real para, en caso de ser rechazado, acceder a la apelación dentro de la fecha establecida, pudiendo ver los motivos del rechazo y siendo capaz de subir los documentos correspondientes en caso de incongruencia en la información o falta de documentos, y, en caso de ser aprobado, tener acceso a la información del proceso. Luego, al realizar la apelación, se guardan los documentos en la base de datos y, una vez terminado el proceso, se actualizan los datos.
Selección

- Como encargado de becas quiero poder ver la información y descargar los archivos subidos de los postulantes después del periodo de postulación para poder elaborar un informe con un puntaje y de esta forma aceptar o rechazar la postulación. Puede haber muchas postulaciones y las becas no tienen límite de cupos. Una vez hecho esto se muestra una lista de las becas asignadas y los puntajes.
Gestión

- Como encargado de becas quiero poder ver las becas existentes y sus requisitos para ser capaz de modificarlas si sus requisitos cambian de un año a otro, además el encargado debe poder crear nuevas becas junto a sus respectivos requisitos al igual que si una beca deja de impartirse, como encargado debo poder eliminarla del sistema para que nadie pueda postular a ella nuevamente. Solamente se podrán realizar estos cambios en una fecha antes de que de inicio el proceso de postulación. Una vez creada, modificada o eliminada una beca, dependiendo el caso, se realiza el cambio en la lista de becas de la base de datos.


### Como ejecutar:

Abrir terminal git

`git clone https://github.com/JavoPa/proyecto-isw.git`

`cd /backend` (ubicarse en la carpeta del proyecto y dentro del backend)

`npm install` (asegurarse de ejecutar este comando en la carpeta del backend)

Crear archivo `.env` con las variables de entorno, en la carpeta `/config`. Sigue la estructura del archivo `.env.example`

`npm start` (iniciar el servidor backend)

Abrir nueva terminal (powershell o git)

`cd /frontend` (ubicarse en la carpeta del frontend)

`npm install` (asegurarse de ejecutar este comando en la carpeta del frontend)

`npm run dev` (iniciar el servidor frontend)

[Mas info](./backend/Backend.md)


## [Ver el backend](./backend/Backend.md)
## [Ver el frontend](./frontend/Frontend.md)
