/**
 * Find into a Object instance for a key with a given value.
 * Returns the key.
 */
export function findKeyByValue(object, value) {
  if (!object || !value) return null;

  const objectKeys = Object.keys(object);
  for (let i = 0; i < objectKeys.length; i++) {
    const key = objectKeys[i];
    if (value === object[key]) return key;
  }

  return null;
}
