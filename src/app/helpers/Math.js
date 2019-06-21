export function convertToBase(number, fromBase, toBase) {
  const parsedNumber = parseInt(number, fromBase);

  if (isNaN(parsedNumber)) return number;

  return parsedNumber.toString(toBase);
}
