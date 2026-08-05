---
name: implement-orderflow-change
description: Implementa un requerimiento aprobado.
argument-hint: "[requerimiento y criterios]"
agent: 'orderflow-implementer'
---

Implementa: `${input:requirement:Describe el cambio aprobado}`

Usa `/orderflow-domain-rules` y `/orderflow-test-first` cuando correspondan. MantÃ©n alcance mÃ­nimo, agrega pruebas, ejecuta `npm test` y resume resultados.