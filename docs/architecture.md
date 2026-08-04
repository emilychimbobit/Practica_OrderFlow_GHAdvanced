# Arquitectura actual

OrderFlow está organizado en cuatro capas simples:

1. `domain`: entidades y constantes del dominio.
2. `repositories`: persistencia; actualmente solo existe una implementación en memoria.
3. `services`: reglas de aplicación y orquestación.
4. `http`: exposición de endpoints y traducción básica de errores.

## Dependencias permitidas

```text
http -> services -> repositories
              \-> domain
repositories -> domain
```

La capa de dominio no debe depender de HTTP ni de persistencia.

## Decisiones vigentes

- Los identificadores se generan en el servicio.
- El repositorio en memoria se utiliza para desarrollo y pruebas.
- Los importes se expresan en USD.
- El servidor no utiliza frameworks externos para reducir el tiempo de preparación del laboratorio.
- Las respuestas HTTP usan JSON.

## Restricciones

- No cambiar el contrato de endpoints existentes sin justificarlo.
- No agregar dependencias externas para resolver una tarea que puede implementarse con Node.js.
- No mover reglas de negocio al servidor HTTP.
- Toda regla nueva debe incluir pruebas automatizadas.
