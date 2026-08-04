---
agent: 'agent'
description: 'Convierte un requerimiento en issue y rama de trabajo'
---

Convierte el siguiente requerimiento en una unidad de trabajo trazable en GitHub:

`${input:requirement:Describe el cambio, error o mejora}`

Sigue este proceso:

1. Lee las instrucciones del repositorio, arquitectura, reglas de negocio y `CONTRIBUTING.md`.
2. Determina el tipo:
   - `feat`;
   - `fix`;
   - `refactor`;
   - `test`;
   - `docs`;
   - `chore`;
   - `perf`;
   - `ci`;
   - `build`.
3. No implementes todavía.
4. Redacta una propuesta de issue con:
   - título claro;
   - contexto;
   - problema u oportunidad;
   - alcance incluido;
   - fuera de alcance;
   - criterios de aceptación verificables;
   - riesgos;
   - dependencias;
   - estrategia de pruebas;
   - Definition of Done.
5. Propón un nombre de rama con esta forma:

`<tipo>/<numero-issue>-<descripcion-kebab-case>`

Ejemplos:

- `feat/42-order-priority`
- `fix/51-cutoff-timezone`
- `docs/63-api-usage`

6. Verifica que la rama se base en `dev` actualizada.
7. Muestra antes de ejecutar:
   - contenido del issue;
   - etiquetas sugeridas;
   - nombre de la rama;
   - comandos `gh` y `git`;
   - archivos que probablemente cambiarán.
8. Espera aprobación antes de crear el issue o la rama.

Después de aprobarse, utiliza un flujo equivalente a:

- crear el issue con GitHub CLI;
- actualizar `dev`;
- crear la rama desde `dev`;
- publicar la rama y configurar upstream.

No hagas cambios funcionales directos en `dev`, `qa` ni `prod`.
