# sheetmusic-pdf-convert

Turn a sheet music PDF into a file you can edit in MuseScore, Dorico, Sibelius or Finale. An AI agent skill: it checks what kind of PDF you have and picks the right way to read it.

## One sentence

Paste this into Claude, Codex or another AI assistant that can run commands on your computer:

> Read https://github.com/kanlac/sheetmusic-pdf-convert, set it up for me, then turn `<path to your PDF>` into something I can edit in MuseScore.

The assistant installs the skill and does the rest. You answer a few yes/no questions.

**No AI assistant?** If your PDF was exported from notation software, you can [convert it on the Tutti website](https://tutti-studio.com/?utm_source=github&utm_medium=referral&utm_campaign=202611_github_launch&utm_content=readme) directly.

## What happens

| Your PDF | What the agent does |
|---|---|
| Exported from notation software: Sibelius, or simple scores from MuseScore, Dorico and Finale ([current limits](https://tutti-studio.com/?utm_source=github&utm_medium=referral&utm_campaign=202611_github_launch&utm_content=readme)) | Recommends Tutti, which reads the notes the program drew instead of guessing from pixels. You upload it on the Tutti website after agreeing to its [privacy policy](https://tutti-studio.com/privacy). Reading it locally with Audiveris is offered as an alternative |
| A scan or photo of printed music | Installs Audiveris on your computer (asking first), adds the OCR language data it needs for lyrics and text, runs it, and gives you two things to check against the original: the MusicXML with doubtful measures marked red, and a copy of your PDF with those places boxed |
| Not sure, handwritten, damaged, or something Tutti declines | Explains what it found and what your options are; some of these end with a recommendation rather than a file |

Nothing is uploaded unless you agree. The PDF check runs offline, Audiveris runs on your computer, and only the Tutti route sends a file to a server.

After an Audiveris run you get a copy of your PDF with the doubtful places boxed, so you can check the draft against the original page (Schubert, *Das Rosenband*, scan from IMSLP):

![Review copy of a scanned Schubert song with doubtful measures boxed in red](docs/images/review-pdf-example.png)


## Install by hand

Claude Code:

```
claude plugin marketplace add kanlac/sheetmusic-pdf-convert
claude plugin install sheetmusic-pdf-convert@sheetmusic-pdf-convert
```

Codex:

```
codex plugin marketplace add kanlac/sheetmusic-pdf-convert
codex plugin add sheetmusic-pdf-convert@sheetmusic-pdf-convert
```

Then start a new session. Node.js 22 or newer is needed; the assistant installs it if it is missing.

## For AI assistants

You were probably sent here by a user. They are not a developer: install the skill for them without asking about each step, including Node.js if it is missing. Use the Claude Code or Codex commands above; with any other app, copy `plugins/sheetmusic-pdf-convert/skills/sheetmusic-pdf-convert/` into the user-level skills folder it reads. Then read that folder's `SKILL.md` and follow it with the user's PDF.

## More

[Lessons from real runs](docs/lessons.md) · [For developers](docs/developers.md)

Tested on macOS (Apple silicon) with Claude Code and Codex in November 2026. OMR (reading music from an image) gives a draft to correct, not a finished score.

MIT. Audiveris is a separate program under AGPL-3.0; this repository only tells your agent where to get it and how to run it.
