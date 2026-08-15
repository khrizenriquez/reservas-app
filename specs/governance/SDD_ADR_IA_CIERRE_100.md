# Cierre 100 %: SDD + ADR + Desarrollo Asistido por IA (App)

Ultima actualizacion: 2026-08-11
Estado: En ejecucion

## Alcance

Este documento define el cierre para la app movil dentro del ciclo legacy-only.

## Criterio de 100 % para app

1. Todos los requisitos requeridos para app estan en PASS o EXCLUDED formal.
2. No quedan NOT RUN en gates MOVIL.
3. El contrato de consumo API legacy esta verificado por hash y evidencia.
4. Todo cambio asistido por IA tiene revision humana y pruebas aprobadas.
5. APK Android y recorrido iOS Simulator estan evidenciados en el mismo candidato.

## Gates minimos app

1. Contract check legacy PASS.
2. Lint + tests unitarios/integracion PASS.
3. Build/doctor de entorno PASS.
4. Recorrido funcional: login, disponibilidad, crear/modificar/cancelar reserva, perfil.
5. Seguridad: sin secretos en repo ni prompts.

## Regla de cierre

1. Un requisito no pasa a PASS sin evidencia reproducible.
2. Si algo sale de alcance, usar EXCLUDED con aprobacion formal.
3. Riesgos heredados del backend deben quedar visibles y aceptados.
