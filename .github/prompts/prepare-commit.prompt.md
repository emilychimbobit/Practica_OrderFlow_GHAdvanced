---
agent: 'agent'
description: 'Prepara un commit atómico con Conventional Commits'
---

Prepara el siguiente commit sin ejecutarlo todavía.

1. Inspecciona:
   - `git status`;
   - `git diff`;
   - `git diff --staged`;
   - archivos no rastreados relevantes.
2. Verifica que los cambios pertenezcan a una sola intención.
3. Detecta:
   - secretos;
   - archivos generados;
   - dependencias accidentales;
   - cambios de formato masivos;
   - debugging temporal;
   - archivos fuera de alcance;
   - pruebas faltantes.
4. Ejecuta las validaciones aplicables del repositorio.
5. Recomienda dividir el commit si mezcla más de una intención.
6. Propón exactamente un mensaje con Conventional Commits:

`<tipo>(<scope opcional>): <descripción imperativa>`

Tipos permitidos:

- `feat`
- `fix`
- `docs`
- `test`
- `refactor`
- `perf`
- `build`
- `ci`
- `chore`
- `revert`

Reglas del mensaje:

- minúsculas;
- verbo o intención directa;
- sin punto final;
- máximo recomendado de 72 caracteres para el encabezado;
- scope concreto cuando aporte información;
- no usar mensajes genéricos como `changes`, `updates` o `fix stuff`.

Si existe un cambio incompatible, utiliza `!` y agrega un footer `BREAKING CHANGE:`.

Entrega:

- archivos que deberían incluirse;
- archivos que deberían excluirse;
- validaciones ejecutadas;
- mensaje propuesto;
- cuerpo opcional;
- referencia al issue, por ejemplo `Refs #42` o `Closes #42`;
- comando exacto de commit.

No ejecutes `git add` ni `git commit` hasta recibir aprobación.
