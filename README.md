# OrderFlow — GitHub Copilot Advanced Lab

OrderFlow es una API pequeña de gestión de pedidos creada para los laboratorios de una capacitación avanzada de GitHub Copilot.

El repositorio **funciona**, pero contiene decisiones mejorables de arquitectura, reglas de negocio dispersas, cobertura parcial y requisitos ambiguos. No corrijas todo al inicio: cada hallazgo será utilizado durante la capacitación.

## Requisitos

- Node.js 20 o superior.
- Git.
- GitHub Copilot habilitado en el IDE.

## Ejecutar

```bash
npm test
npm start
```

La API quedará disponible en `http://localhost:3000`.

## Endpoints iniciales

- `GET /health`
- `GET /orders`
- `GET /orders/:id`
- `POST /orders`
- `POST /orders/:id/cancel`

## Estructura

```text
src/
├── domain/
├── repositories/
├── services/
└── http/

docs/
requirements/
labs/
tests/
```

## Regla del laboratorio

Antes de modificar código, revisa la documentación, los tests y el requerimiento asignado. Copilot debe proponer un plan verificable antes de implementar.
