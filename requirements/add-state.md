# Agregar Nuevo Estado REOPEN a la Orden

## Descripción
Implementar un nuevo estado de orden llamado `REOPEN` que permita reabrir órdenes que fueron previamente cerradas.

## Requisitos
- Crear el estado `REOPEN` en el modelo de datos de órdenes
- Definir las transiciones permitidas hacia y desde el estado `REOPEN`
- Implementar la lógica de negocio para permitir reapertura de órdenes
- Actualizar el flujo de estado del sistema
- Agregar validaciones apropiadas para la transición a `REOPEN`

## Criterios de Aceptación
- [ ] El estado `REOPEN` se puede asignar a una orden
- [ ] Las transiciones de estado son válidas según las reglas de negocio
- [ ] Se registran auditorías de cambios de estado
- [ ] Los tests unitarios cubren el nuevo estado