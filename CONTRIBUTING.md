# Contribuir a OrderFlow

## Principios

- Los cambios deben ser trazables a un issue.
- `dev`, `qa` y `prod` no reciben cambios funcionales directos.
- Cada pull request debe resolver una sola intención.
- No se deben publicar secretos ni datos sensibles.
- El código generado o sugerido por IA debe ser revisado, probado y entendido por quien lo entrega.

## Inicio de una tarea

```bash
git switch dev
git pull --ff-only origin dev
git switch -c feat/42-order-priority
git push -u origin feat/42-order-priority
```

Sustituye el tipo, número de issue y descripción según corresponda.

## Ramas

Formato:

```text
<tipo>/<issue>-<descripcion-kebab-case>
```

Ejemplos:

```text
feat/42-order-priority
fix/51-cutoff-timezone
docs/63-api-usage
```

## Commits

Formato:

```text
<tipo>(<scope opcional>): <descripción>
```

Tipos permitidos:

`feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, `revert`.

Ejemplos:

```text
feat(domain): calculate order priority
test(priority): cover vip and cutoff rules
fix(service): preserve creation timestamp
```

Los commits deben ser atómicos, revisables y compilar o pasar pruebas cuando sea técnicamente posible.

## Antes de abrir un pull request

Ejecuta:

```bash
npm test
git status
git diff origin/dev...HEAD
```

Comprueba:

- ausencia de secretos;
- cambios dentro del alcance;
- pruebas agregadas o actualizadas;
- documentación actualizada;
- working tree limpio;
- rama actualizada con `dev`.

## Pull requests

El título debe cumplir Conventional Commits.

Ejemplo:

```text
feat(domain): calculate order priority
```

La descripción debe explicar:

- contexto;
- cambio realizado;
- cómo se probó;
- riesgos;
- issue relacionado.

Usa `Closes #42` cuando el merge deba cerrar el issue.

## Revisión

Los autores no aprueban su propio cambio. Toda observación bloqueante debe resolverse antes del merge. Las conversaciones deben cerrarse con evidencia, no únicamente con “resuelto”.

## Merge y promoción

La estrategia predeterminada para ramas de trabajo es **Squash and merge** hacia `dev`. Después del merge:

```bash
git switch dev
git pull --ff-only origin dev
git branch -d feat/42-order-priority
git push origin --delete feat/42-order-priority
```

Los cambios validados se promueven mediante pull requests de `dev` a `qa` y de `qa` a `prod`. No hagas commits directos ni promociones que omitan una de estas ramas.
