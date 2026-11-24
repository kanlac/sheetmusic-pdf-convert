# For developers


`packages/identify` is the PDF identifier the skill uses: plain ES modules that run in Node and the browser, no network access. It reports the kind of PDF (vector / scan / outlined / mixed / unknown / unreadable) with per-page evidence, the notation programs it probably came from, and a Tutti routing verdict based on the PDF content.

```js
import {identify} from './packages/identify/src/index.js';
import * as pdfLib from './packages/identify/vendor/pdf-lib.esm.min.js';
import rules from './packages/identify/data/identify-data.json' with {type: 'json'};

const result = await identify(pdfBytes, {pdfLib, rules});
```

Command line: `node plugins/sheetmusic-pdf-convert/skills/sheetmusic-pdf-convert/scripts/identify.mjs score.pdf --json`.

`packages/review` builds the offline Audiveris review helper into the same skill:

```sh
node plugins/sheetmusic-pdf-convert/skills/sheetmusic-pdf-convert/scripts/review.mjs score.mxl original.pdf --out-dir review
```

Node 22+ is required. The helper finds the matching `.omr` and single `.log` beside the score (or accepts `--omr` / `--log`). It writes a MusicXML copy with suspect measures in red, a PDF copy with review boxes or page notes, and a JSON summary; stdout includes the JSON and an English explanation. Existing files are never overwritten. Hints cover rhythm, unequal part measure counts and Audiveris diagnostics, including INFO messages. OMR mapping uses the exported systems and logical parts, and uncertain locations stay page-level. These hints miss errors such as pitches and accidentals; unmarked music still needs checking.

`npm test` runs the tests; `npm run build` rebuilds both single-file scripts bundled in the skill, and `npm run build:check` checks that they match the source.

