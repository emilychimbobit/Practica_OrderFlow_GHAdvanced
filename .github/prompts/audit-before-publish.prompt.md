---
agent: 'agent'
description: 'Audita el repositorio local antes de publicarlo en GitHub'
---

Actúa como responsable técnico preparando este repositorio para su primera publicación en GitHub.

Antes de ejecutar comandos o modificar archivos:

1. Inspecciona la estructura completa del repositorio.
2. Revisa `README.md`, `package.json`, `.gitignore`, `.editorconfig`, `.github/copilot-instructions.md`, `AGENTS.md`, `docs/` y `tests/`.
3. Comprueba si existe un repositorio Git local mediante `git status` y `git remote -v`.
4. Busca riesgos de publicación:
   - secretos, tokens, contraseñas o API keys;
   - archivos `.env`;
   - certificados o claves privadas;
   - logs, temporales, archivos generados o dependencias;
   - datos personales o información interna;
   - binarios grandes;
   - URLs o credenciales embebidas.
5. No muestres el valor de ningún posible secreto. Reporta únicamente archivo, línea aproximada y tipo de riesgo.
6. Comprueba que el proyecto pueda instalarse, ejecutarse y probarse con las instrucciones documentadas.
7. Ejecuta las pruebas existentes sin modificar código.
8. Revisa si faltan archivos básicos:
   - `README.md`;
   - `.gitignore`;
   - `LICENSE`, solo si se ha decidido publicar con licencia;
   - `CONTRIBUTING.md`;
   - plantilla de pull request;
   - documentación de branching y commits.

Entrega primero un informe con:

- estado actual;
- bloqueadores críticos;
- archivos que deberían excluirse;
- archivos que deberían crearse o corregirse;
- comandos que propones ejecutar;
- riesgos residuales;
- decisión recomendada: `LISTO`, `LISTO CON CAMBIOS` o `NO PUBLICAR`.

No inicialices Git, no crees el repositorio remoto, no hagas commit y no hagas push hasta recibir aprobación explícita.
