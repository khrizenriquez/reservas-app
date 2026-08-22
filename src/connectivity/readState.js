export const readStatusFor = ({ hasRead, isOnline }) => {
  if (isOnline) return null;
  return hasRead ? "stale" : "offline";
};
