# ADR de Dependencias y Vigencia (App)

Ultima actualizacion: 2026-08-11

Este documento mapea que decisiones arquitectonicas del ciclo historico siguen afectando a la app.

## Vigentes para app

- ADR-010 (web) no aplica directo a app.
- ADR-011 (Expo movil) vigente.
- ADR-012 (Spec-Driven Development) vigente.
- ADR-013 (Trunk-based) vigente.
- ADR-016 (Trazabilidad) vigente.

## Parciales para app

- ADR-006 (autenticacion/RBAC) aplica solo como restriccion: en legacy-only existe pseudo-sesion, no autenticacion segura.
- ADR-004 (Kong) aplica para pruebas integradas contra gateway.

## Historicos no activos en app para este ciclo

- ADR-001, ADR-007, ADR-008, ADR-014, ADR-015, ADR-017.

## Regla de cambio

Si la app cambia una decision de arquitectura o rompe una vigencia:

1. Actualizar este archivo.
2. Actualizar el checklist de cierre de app.
3. Reflejar el cambio en PR con evidencia.
