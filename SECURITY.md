# Política de seguridad

No se versionan `.env`, tokens, llaves de firma, credenciales Expo, secretos de API,
sesiones ni capturas con información personal. Reporte cualquier hallazgo por el
canal privado acordado con el mantenedor.

## Excepción temporal — `image-size` de Metro

- Aprobada: 2026-08-08.
- Revisión: 2026-08-22 y en cada actualización Expo/Metro.
- Advisories permitidos: `GHSA-w3rx-r6r6-pgpr` y `GHSA-5p2g-fcmc-qvqq`.

Los hallazgos afectan el parser ICNS/JXL/HEIF de `image-size@1.2.1`, transitivo del
empaquetador Metro. Al aprobar esta excepción no existía una versión corregida en npm:
el rango vulnerable cubría hasta la última `2.0.2`, y el fix automático proponía una
degradación incompatible de Expo 57 a 53.

El repositorio contiene únicamente assets PNG/SVG controlados; no acepta ICNS, JXL ni
HEIF externos. Metro se usa solo durante desarrollo/empaquetado local y no se ejecuta
dentro de la APK. `npm run audit:release` permite exclusivamente esos dos advisories y
falla si aparece cualquier raíz adicional o vulnerabilidad crítica.

La excepción se cierra al publicarse una actualización compatible corregida. En ese
momento se actualizan dependencias, se retira el filtro y se repiten Jest, Expo Doctor,
APK, SBOM y E2E móvil.
