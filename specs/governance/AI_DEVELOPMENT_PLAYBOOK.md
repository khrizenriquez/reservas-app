# Playbook de Desarrollo Fuerte con IA (App)

Version: 1.0

## Principios

1. Especificacion primero.
2. Revision humana obligatoria.
3. Evidencia reproducible o no cuenta.
4. Cambios pequenos y verificables.
5. Transparencia de uso de IA en cada PR.

## Flujo de trabajo

1. Mapear cambio a requisito/gate movil.
2. Generar propuesta con IA.
3. Revisar manualmente seguridad, contrato y UX.
4. Ejecutar checks locales (contract/lint/test/build).
5. Registrar evidencia con SHA y comandos.
6. Abrir PR con checklist.

## Checklist obligatorio por PR asistido por IA

- [ ] Alcance definido por requisito o gate.
- [ ] Uso de IA declarado explicitamente.
- [ ] Revision humana completa.
- [ ] Contract/lint/tests/build PASS.
- [ ] Riesgos y limites documentados.
- [ ] Evidencia adjunta (comandos, resultados, SHAs).
- [ ] Sin secretos ni datos sensibles.
- [ ] Trazabilidad actualizada en specs/matriz.

## Plantilla de registro IA para PR

```
## Registro IA
- Herramienta IA utilizada:
- Tareas realizadas con IA:
- Archivos impactados:
- Riesgos identificados:
- Verificacion humana aplicada:
- Evidencia de validacion:
```
