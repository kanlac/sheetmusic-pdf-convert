# Reading the identifier and choosing a route

`node scripts/identify.mjs <file.pdf> --json` works offline and never uploads anything. Exit code 0 means it produced a result (including "unknown"); 1 means the file could not be read as a PDF; 2 means a usage or file-access error.

## The three answers

**`pdf.kind`** (also given per page in `pdf.pages[].kind`):

| Value | Meaning |
|---|---|
| `vector` | Music is drawn with music fonts, as notation software does when it exports a PDF |
| `scan` | Pages are images: a scanner, a camera, or a PDF saved from photos |
| `outlined` | Vector drawing but no fonts: the symbols were turned into shapes |
| `mixed` | Some pages of one kind, some of another. Often harmless (a scanned or decorated cover before a vector score), sometimes a real mix |
| `unknown` | Not enough evidence either way (for example an unrecognized music font) |
| `unreadable` | Not a PDF, empty, password-protected or broken; see `pdf.reasons` |

**`sources`**: notation programs the metadata or fonts point to. There can be several; that is normal for scores assembled from different files.

**`tutti.status`**: `likely`, `unlikely` or `unknown`, with `reasons`. The verdict is based on the PDF content.

## Routes

| Situation | Route |
|---|---|
| Music pages preserve music-font characters | Tutti (`tutti.md`), with Audiveris as the local alternative |
| Music pages are scans, photos or outlines | Audiveris (`audiveris.md`) on the user's computer |
| The music pages are unclear | Check the per-page evidence or ask how the PDF was made |
| `unreadable` | Explain the reason in `pdf.reasons` (for example, ask for the version without a password) |

For a `mixed` file, look at `pdf.pages` to see which pages hold the music before deciding. If only a cover or an instructions page differs, treat the file by its music pages. A full-page image with OCR text and no music-font evidence is a scan (IMSLP often adds OCR text). If some music pages preserve music fonts and others are scans, route each group of pages separately.

For handwritten music, see `omr-tools.md`.

## Several files

Identify every file first, then confirm one plan with the user, grouped by route. Give each file its own output folder named after the input, and never overwrite the originals.
