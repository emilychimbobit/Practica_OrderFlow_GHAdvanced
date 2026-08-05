---
name: analyze-orderflow-change
description: Analiza un cambio sin editar archivos.
argument-hint: "[requerimiento]"
agent: 'ask'
---

Analiza: `${input:requirement:Describe el cambio}`

Entrega comportamiento actual, comportamiento esperado, reglas, archivos afectados, riesgos, casos borde, preguntas y estrategia de pruebas.

No modifiques archivos. Aunque Ask no dispone de ediciÃ³n, esta instrucciÃ³n tambiÃ©n define el contrato de salida y evita generar un parche no solicitado.