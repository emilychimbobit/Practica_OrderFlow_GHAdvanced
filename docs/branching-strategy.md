# Estrategia de branching de OrderFlow

## Estrategia seleccionada

OrderFlow utiliza un flujo de promoción con tres ramas persistentes:

- `dev` es la rama predeterminada y de integración.
- `qa` contiene los cambios promovidos para validación.
- `prod` representa la versión aprobada para producción.
- Todo cambio funcional se desarrolla en una rama corta.
- Cada rama se relaciona con un issue.
- Las ramas cortas se crean desde `dev` y regresan a `dev` mediante pull request.
- Los cambios se promueven mediante pull requests de `dev` a `qa` y de `qa` a `prod`.
- La rama se elimina después del merge.
- No se permiten commits funcionales directos sobre `dev`, `qa` ni `prod`.

Esta estrategia prioriza integración frecuente, trazabilidad y promociones controladas entre ambientes.

## Flujo obligatorio

1. Crear o seleccionar un issue.
2. Actualizar `dev`.
3. Crear una rama desde `dev`.
4. Implementar cambios pequeños y coherentes.
5. Crear commits atómicos.
6. Publicar la rama.
7. Abrir un pull request hacia `dev`.
8. Ejecutar CI y revisión.
9. Resolver conversaciones.
10. Realizar **squash merge**.
11. Eliminar la rama.
12. Promover el conjunto validado mediante pull request de `dev` a `qa`.
13. Promover la versión aprobada mediante pull request de `qa` a `prod`.

## Convención de ramas

Formato:

```text
<tipo>/<issue>-<descripcion-kebab-case>
```

Tipos:

| Tipo | Uso |
|---|---|
| `feat` | Nueva capacidad |
| `fix` | Corrección de defecto |
| `refactor` | Cambio interno sin modificar comportamiento |
| `test` | Pruebas |
| `docs` | Documentación |
| `chore` | Mantenimiento |
| `perf` | Rendimiento |
| `ci` | Integración continua |
| `build` | Build o dependencias |

Ejemplos:

```text
feat/42-order-priority
fix/51-cutoff-timezone
test/58-priority-boundaries
docs/63-api-usage
```

## Convención de commits

OrderFlow utiliza Conventional Commits:

```text
<tipo>(<scope opcional>): <descripción>
```

Ejemplos:

```text
feat(domain): calculate order priority
fix(service): preserve injected evaluation time
test(priority): cover cutoff boundary
docs(api): document priority response
ci(github): run tests on pull requests
```

Para cambios incompatibles:

```text
feat(api)!: replace priority boolean with priority level
```

El cuerpo debe explicar **por qué** cuando el encabezado no sea suficiente. Los footers pueden incluir:

```text
Closes #42
Refs #39
BREAKING CHANGE: priority is now returned as a string enum
```

## Tamaño del trabajo

Una rama debe contener una sola intención y permanecer abierta el menor tiempo posible.

Evitar:

- ramas personales permanentes;
- ramas de ambiente adicionales a `dev`, `qa` y `prod`;
- ramas con varias funcionalidades;
- PR con refactor, feature y actualización de dependencias sin relación;
- nombres como `emily`, `changes`, `develop2` o `final-final`.

## Estrategia de merge

Se recomienda **Squash and merge** para ramas cortas hacia `dev`.

El título del pull request se convierte en el commit integrado y debe cumplir Conventional Commits. Esto mantiene un historial lineal y una unidad lógica por pull request.

Las promociones `dev` -> `qa` y `qa` -> `prod` deben usar pull requests de promoción con los checks requeridos. No se deben copiar cambios manualmente entre ramas ni omitir `qa`.

## Reglas recomendadas para ramas persistentes

Configurar rulesets para `dev`, `qa` y `prod` con:

- pull request obligatorio;
- una aprobación mínima;
- aprobación del último push;
- descarte de aprobaciones obsoletas;
- resolución obligatoria de conversaciones;
- checks obligatorios;
- historial lineal;
- bloqueo de force push;
- bloqueo de eliminación;
- CODEOWNERS en rutas críticas cuando existan equipos propietarios;
- bypass limitado a responsables designados.

Para `qa` y `prod`, exigir además que las promociones procedan de la rama anterior del flujo. `prod` debe requerir la aprobación de las personas responsables de producción.

Checks iniciales de OrderFlow:

- instalación;
- `npm test`;
- validaciones de sintaxis o lint cuando se incorporen;
- análisis de seguridad cuando esté disponible.

## Cuándo revisar esta estrategia

Revisar esta estrategia si el producto necesita mantener varias versiones productivas, aplicar hotfixes a versiones anteriores o desplegar componentes con ciclos independientes. En esos casos puede ser necesario incorporar ramas de release y un procedimiento explícito para propagar correcciones hacia `dev`, `qa` y `prod`.
