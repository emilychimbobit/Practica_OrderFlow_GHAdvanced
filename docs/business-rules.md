# Reglas de negocio conocidas

## Creación de pedidos

- Un pedido debe tener al menos un artículo.
- Cada artículo debe tener cantidad entera mayor que cero.
- El precio unitario debe ser mayor que cero.
- El correo del cliente es obligatorio.
- El total se calcula como la suma de `quantity * unitPrice`.

## Descuentos

- Clientes `STANDARD`: sin descuento.
- Clientes `GOLD`: 5 % cuando el subtotal es al menos EUR 200.
- Clientes `VIP`: 10 % cuando el subtotal es al menos EUR 500.
- El descuento máximo permitido por pedido es EUR 150.
- El total final nunca puede ser negativo.

## Estados

Estados permitidos:

- `PENDING`
- `CONFIRMED`
- `CANCELLED`

Solo un pedido `PENDING` puede cancelarse desde la API actual.

## Observaciones operativas

- Operaciones solicitó evitar cambios automáticos sobre pedidos cancelados.
- El equipo de auditoría pidió que las decisiones automáticas sean explicables.
- Las fechas se guardan en formato ISO 8601.
