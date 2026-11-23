# Lessons from real runs


We ran real scans through Audiveris and agents end to end, and wrote down what went wrong. These are the ones that look reasonable and cost the most:

- **Reading the music off the page image itself.** An agent asked to "convert" a scan may look at it and write MusicXML by hand. It invents pitches and rhythms with full confidence, which is worse than OMR and harder to catch.
- **Sending an exported PDF to OMR.** People call any PDF a "scan". If the PDF came out of notation software, OMR throws away exact data that is sitting in the file.
- **Running Audiveris without OCR language data.** It still exports notes, but every lyric, tempo word and instrument name silently disappears (same scan: 95 lyric syllables with the data, 0 without). The "fast" and "best" Tesseract models don't work here; Audiveris needs the legacy ones.
- **Feeding it a title or text page.** One page without music can make the whole run end with no export at all.
- **Believing exit code 0.** Files come out with a bar missing from one part, a staff split into extra parts, or only one surviving fragment. The skill counts measures per part before calling anything done.
- **Turning Audiveris's log into bar numbers.** `Measure{#11P2}` is an internal label, not "bar 11 of the second instrument". The skill points to the page instead of inventing a precise location.
- **Fighting a bad phone photo.** Installing image tools or uploading pages to online services rarely rescues it. The skill runs once, then gives retake advice or names tools made for photos.

## What to expect

OMR (reading music from an image) gives you a draft to correct. In our test batch of real scans (songs for voice and piano, 1–4 pages), Audiveris produced a file every time, but most needed structural fixes such as a missing bar or a staff split in two, and our synthetic phone-style photos failed to export. Clean scans of simple music work best. The red marks show where Audiveris itself noticed trouble; in our tests they caught only a minority of the measures that had wrong notes, so treat them as a starting point, not a list of every error.

Tested on macOS (Apple silicon) with Claude Code and Codex in November 2026. On Windows and Linux the agent adapts the same steps, but we have not tested them.

