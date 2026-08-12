export function isAdministrator(user) {
  return user?.role?.name === "ADMIN";
}

export const MOBILE_ADMIN_SCOPE = Object.freeze({
  urgentIndicators: true,
  denseConfiguration: false,
  auditBuilder: false,
  reportBuilder: false,
});
