# Proyecto ingeniería de software

## Descripción

- Software para facilitar y optimizar el proceso de solicitud, revisión, y asignación de becas a estudiantes, garantizando una gestión eficiente y transparente de las becas municipale

*Aviso:
Trabajar cada uno en su branch (rama) nombrada con su respectivo requisito.
Al hacer cambios en la base del backend deben subirla a su rama y luego, cuando corroboren que su funcionalidad este lista, solicitar un pull request al main y realizar el merge si no hay conflictos.

### Como comenzar:

`git clone https://github.com/JavoPa/proyecto-isw.git`

`cd proyecto-isw/backend` (ubicarse en la carpeta del proyecto y dentro del backend)

`git checkout -b BRANCH` (cambiar BRANCH por el nombre de su rama)

`npm install` (asegurarse de ejecutar este comando en la carpeta del backend)

Crear archivo `.env` con las variables de entorno, en la carpeta `/config`. Sigue la estructura del archivo `.env.example`

Correr el servidor `npm start`

[Mas info](./backend/Backend.md)

### Comandos:

`cd` #entrar en una carpeta

`ls` #ver directorios

`git checkout -b Branch` #crear una rama llamada Branch e ir a ella

`git checkout Branch` #ir a la rama Branch

`git add carpeta/` #cargar un archivo nuevo o cargar cambios del archivo

`git add .` #cargar todos los cambios y/o todos los archivos nuevos

`git status` #ver los cambios hechos

`git commit -m` "Comentario" #preparar para subir los cambios con un comentario

`git push --set-upstream origin Branch` #finalmente subir los cambios en la Branch correspondiente

`git fetch`

`git pull` #Efectuar estos dos ultimos comandos para actualizar tu repo local en base al repo de la nube

*Hagan commit con cada funcionalidad o modificacion importante a su branch poniendo un comentario descriptivo

git pull origin branch  #Esto trae los cambios mas recientes de la rama main y los fusionara con la rama branch

## [Ver el backend](./backend/Backend.md)
## [Ver el frontend](./frontend/Frontend.md)
