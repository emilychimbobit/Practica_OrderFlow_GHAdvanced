---
agent: 'agent'
description: 'Publica de forma controlada un repositorio local en GitHub'
---

Prepara la publicación de este repositorio local en GitHub.

Datos proporcionados por el usuario:

- Propietario u organización: `${input:owner:Escribe el usuario u organización de GitHub}`
- Nombre del repositorio: `${input:repository:Escribe el nombre del repositorio}`
- Visibilidad: `${input:visibility:private, internal o public}`
- Rama principal: `${input:defaultBranch:dev}`
- Descripción: `${input:description:Descripción breve del repositorio}`

Reglas:

1. Verifica primero que el repositorio pasó una auditoría de secretos y archivos excluidos.
2. Confirma el estado mediante:
   - `git status`;
   - `git branch --show-current`;
   - `git remote -v`;
   - `gh auth status`.
3. No publiques secretos, archivos `.env`, claves, certificados, logs ni dependencias.
4. Si Git todavía no está inicializado:
   - propone `git init -b ${input:defaultBranch:dev}`;
   - prepara el primer commit siguiendo Conventional Commits.
5. Si ya existe un remoto, no lo reemplaces automáticamente. Explica el conflicto y detente.
6. Utiliza GitHub CLI para crear el repositorio y publicar el código.
7. No ejecutes el comando final de creación o push hasta mostrar:
   - propietario;
   - nombre;
   - visibilidad;
   - rama;
   - lista de archivos incluidos;
   - mensaje del commit inicial;
   - comandos exactos.
8. Solicita aprobación humana antes de ejecutar cualquier operación remota.

Después de la aprobación, ejecuta el flujo apropiado. Como referencia, el comando esperado será similar a:

`gh repo create OWNER/REPOSITORY --VISIBILITY --source=. --remote=origin --push`

Al finalizar, valida:

- `git remote -v`;
- `git status`;
- rama upstream;
- URL del repositorio;
- commit publicado;
- pruebas locales.

Entrega un resumen de evidencia y los pasos de gobierno pendientes: rulesets de `dev`, `qa` y `prod`, pull requests obligatorios, revisiones y checks.
