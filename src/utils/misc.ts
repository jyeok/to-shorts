export const getHumanReadableFileSize = (bytes: number, precision = 1) => {
  const THRESHOLD = 1000;

  if (Math.abs(bytes) < THRESHOLD) {
    return bytes + ' B';
  }

  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  let u = -1;
  const r = 10 ** precision;

  do {
    bytes /= THRESHOLD;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= THRESHOLD &&
    u < units.length - 1
  );

  return bytes.toFixed(precision) + ' ' + units[u];
};
