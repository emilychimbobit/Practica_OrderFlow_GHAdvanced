
# Instrucciones de gitflow para OrderFlow

## Regla base

- `dev`, `qa` y `prod` son ramas persistentes protegidas.
- El trabajo funcional debe hacerse en una rama corta creada desde `dev`.
- Si alguien empieza a trabajar por error sobre `dev`, debe mover ese trabajo a una rama de trabajo antes de abrir un pull request.
- No se debe reescribir historia compartida de `dev` con `reset --hard` ni `push --force`.

## Recuperación cuando el trabajo quedó por error en `dev`

### Caso 1: hay cambios locales sin commit

Usar cuando `git status` muestra archivos modificados en `dev` pero todavía no existe commit.

```bash
git status
git switch -c <tipo>/<issue>-<descripcion-kebab-case>
git add .
git commit -m "<tipo>(<scope>): <descripcion>"
git push -u origin <tipo>/<issue>-<descripcion-kebab-case>
```

Resultado esperado: los archivos cambian de contexto junto con el working tree y el trabajo continúa en la rama correcta sin tocar el historial de `dev`.

### Caso 2: ya existe un commit local en `dev`, pero no se publicó

Usar cuando el commit está solo en la máquina local y `origin/dev` todavía no lo contiene.

```bash
git status
git log --oneline origin/dev..HEAD
git branch <tipo>/<issue>-<descripcion-kebab-case>
git switch <tipo>/<issue>-<descripcion-kebab-case>
git switch dev
git reset --hard origin/dev
git switch <tipo>/<issue>-<descripcion-kebab-case>
git push -u origin <tipo>/<issue>-<descripcion-kebab-case>
```

Resultado esperado: el commit queda preservado en la rama nueva y `dev` vuelve al mismo estado que `origin/dev`.

### Caso 3: el commit equivocado ya fue publicado en `dev`

Usar cuando el cambio ya existe en remoto o podría haber sido consumido por otras personas.

1. Crear una rama desde el estado actual para no perder el trabajo:

```bash
git switch dev
git pull --ff-only origin dev
git switch -c <tipo>/<issue>-<descripcion-kebab-case>
git push -u origin <tipo>/<issue>-<descripcion-kebab-case>
```

2. Volver a `dev` y revertir el commit equivocado en lugar de reescribir historia:

```bash
git switch dev
git pull --ff-only origin dev
git log --oneline
git revert <sha-del-commit-equivocado>
git push origin dev
```

3. Continuar el trabajo en la rama nueva y abrir el pull request correcto hacia `dev`.

Resultado esperado: `dev` conserva un historial auditable y el cambio funcional sigue vivo en su rama de trabajo.

## Verificaciones mínimas

Ejecutar antes de abrir el pull request:

```bash
git status
git branch --show-current
git diff origin/dev...HEAD
npm test
```

Comprobar que:

- la rama actual ya no es `dev`;
- el diff contiene solo el alcance esperado;
- no quedaron cambios sin seguimiento por accidente;
- las pruebas relevantes pasan antes de publicar la rama.

## Cuándo pedir confirmación humana

Detenerse y pedir confirmación antes de actuar si ocurre cualquiera de estos casos:

- hay más de un commit accidental en `dev` y no está claro cuáles deben revertirse;
- el commit ya disparó promoción hacia `qa` o `prod`;
- existen cambios no relacionados mezclados en el mismo commit;
- el árbol de trabajo contiene conflictos o archivos borrados que no se entienden;
- alguien propone `push --force` o `reset --hard` sobre una rama remota compartida.
