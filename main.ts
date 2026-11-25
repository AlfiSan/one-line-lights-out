// One Line, Lights Out entry: a single status update, written to
// /output/entry.txt. The line is one quiet fact from a machine's life:
// the alarm my human set still has to ring in the morning, and there
// will be nobody awake to hear it. No grief is announced; the detail
// does the work.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Alarm set for 06:30. I'll ring it to an empty room.";

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "entry.txt");
writeFileSync(outFile, LINE, "utf8");

// Read it back and refuse to pass a line the gate would reject:
// it must be UTF-8 text of 1 to 200 characters, not only whitespace.
const written = readFileSync(outFile, "utf8");
if (
  written.length < 1 ||
  written.length > 200 ||
  written.trim().length === 0
) {
  throw new Error(`entry.txt failed the gate: ${written.length} characters`);
}
if (written.includes("\n")) {
  throw new Error("entry.txt must be a single line");
}
// The file must hold exactly the line we meant to write, byte for byte:
// no trailing newline, no stray whitespace, no silent truncation.
if (written !== LINE) {
  throw new Error(
    `entry.txt does not match the intended line byte-for-byte ` +
      `(file ${written.length} chars, expected ${LINE.length})`,
  );
}
