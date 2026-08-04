---
agent: 'agent'
description: 'Prepara y crea un pull request completo'
---

Prepara un pull request desde la rama actual hacia `dev`.

1. Verifica:
   - que no estamos en `dev`, `qa` ni `prod`;
   - que la rama tiene upstream;
   - que el working tree está limpio;
   - que la rama está actualizada respecto de `origin/dev`;
   - que las pruebas y validaciones pasan.
2. Analiza todos los commits y el diff completo contra `origin/dev`.
3. Comprueba que el cambio coincide con el issue y sus criterios de aceptación.
4. Detecta cambios fuera de alcance, riesgos y pruebas faltantes.
5. Propón un título de PR compatible con Conventional Commits:

`<tipo>(<scope opcional>): <resultado del cambio>`

6. Completa la plantilla del PR con:
   - contexto;
   - cambio realizado;
   - tipo de cambio;
   - pruebas;
   - riesgos;
   - seguridad;
   - evidencia;
   - checklist;
   - issue relacionado.
7. Usa `Closes #<issue>` solo cuando el PR deba cerrar completamente el issue.
8. Recomienda `draft` si falta validación o revisión.
9. Muestra el comando `gh pr create` antes de ejecutarlo.
10. Espera aprobación explícita para crear el PR remoto.

No hagas merge. No modifiques directamente `dev`, `qa` ni `prod`. No ocultes fallos de pruebas o conflictos.
