function requireBytes(value, name) {
  if (!(value instanceof Uint8Array)) throw new TypeError(`${name} must be a Uint8Array or Buffer`);
}

/**
 * Find every overlapping occurrence of a byte sequence in a byte sequence.
 * This is import-only because its carriers do not have an implicit JSON form.
 */
export function findByteSequence({ haystack, needle } = {}) {
  requireBytes(haystack, "haystack");
  requireBytes(needle, "needle");
  if (needle.byteLength === 0) throw new TypeError("needle must be nonempty");

  const matches = [];
  const lastStart = haystack.byteLength - needle.byteLength;
  for (let byteOffset = 0; byteOffset <= lastStart; byteOffset += 1) {
    let equal = true;
    for (let index = 0; index < needle.byteLength; index += 1) {
      if (haystack[byteOffset + index] !== needle[index]) {
        equal = false;
        break;
      }
    }
    if (equal) matches.push(Object.freeze({ byteOffset, byteLength: needle.byteLength }));
  }
  return Object.freeze({
    type: "ByteSequenceSearch",
    relation: matches.length > 0 ? "contains" : "absent",
    matches: Object.freeze(matches),
  });
}
