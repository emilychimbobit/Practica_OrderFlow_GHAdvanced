---
name: orderflow-domain-rules
description: Ãšsala cuando una tarea afecte creaciÃ³n, cancelaciÃ³n, totales, estados o invariantes de pedidos.
---

1. Revisa requisitos y tests antes de interpretar la regla.
2. Define estado inicial, estado final, precondiciones, invariantes, errores y efectos.
3. MantÃ©n reglas de negocio fuera de HTTP.
4. No delegues reglas de dominio al repositorio.
5. No dupliques validaciones sin justificaciÃ³n.
6. Verifica cero, negativos, redondeo y entradas no numÃ©ricas.
7. Para cancelaciones, verifica estados permitidos, idempotencia y estados terminales.
8. Agrega pruebas positivas, negativas y de borde.
9. Ejecuta pruebas focalizadas y luego `npm test`.