import assert from "node:assert/strict";
import test from "node:test";

import { findByteSequence } from "../src/search-bytes.mjs";

test("reports overlapping matches in ascending byte order", () => {
  const result = findByteSequence({
    haystack: new Uint8Array([4, 4, 4, 4]),
    needle: new Uint8Array([4, 4]),
  });
  assert.deepEqual(result, {
    type: "ByteSequenceSearch",
    relation: "contains",
    matches: [
      { byteOffset: 0, byteLength: 2 },
      { byteOffset: 1, byteLength: 2 },
      { byteOffset: 2, byteLength: 2 },
    ],
  });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.matches), true);
  assert.equal(Object.isFrozen(result.matches[0]), true);
});

test("accepts Buffer carriers and reports absence without synthetic evidence", () => {
  const result = findByteSequence({
    haystack: Buffer.from([0, 255, 2]),
    needle: Buffer.from([255, 3]),
  });
  assert.deepEqual(result, {
    type: "ByteSequenceSearch",
    relation: "absent",
    matches: [],
  });
});

test("rejects non-byte carriers and an empty needle", () => {
  assert.throws(() => findByteSequence({ haystack: [1], needle: new Uint8Array([1]) }), /Uint8Array/u);
  assert.throws(() => findByteSequence({ haystack: new Uint8Array([1]), needle: new Uint8Array() }), /nonempty/u);
});
