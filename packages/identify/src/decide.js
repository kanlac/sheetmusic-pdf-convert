import {subsetFree, classifyExporter, profileEvidence, detectProfile} from './sources.js';
import {reason} from './messages.js';

function pageKind(page, rules) {
  const painted = page.paintedFonts.map(subsetFree);
  const musicFonts = painted.filter(font => rules.familyKinds[rules.families[font]] === 'music');
  const unknownFonts = painted.filter(font => !Object.hasOwn(rules.families, font));
  // Font fingerprints also identify legacy music font names.
  const prefixes = rules.exporters.flatMap(row => row.fontSets.flat());
  const candidateMusicFonts = unknownFonts.filter(font => !/text/i.test(font)
    && prefixes.some(prefix => font.startsWith(prefix)));
  let kind = 'unknown';
  const raster = page.rasterImagePaints ?? page.imagePaints;
  if (raster && (page.textShows || page.pathPaints)) kind = 'mixed';
  else if (musicFonts.length || candidateMusicFonts.length) kind = raster ? 'mixed' : 'vector';
  else if (page.complete && raster) kind = 'scan';
  else if (page.complete && page.pathPaints && !page.textShows) kind = 'outlined';
  return {...page, musicFonts, candidateMusicFonts, unknownFonts, kind};
}

function documentKind(pages) {
  // Text-only / empty front matter has no scan or outlined-notation evidence.
  const musicPages = pages.filter(page => !(page.complete && !page.pathPaints
    && !(page.rasterImagePaints ?? page.imagePaints) && page.kind === 'unknown'));
  const withoutCovers = musicPages.length && musicPages.every(page => page.kind === 'vector');
  const kinds = new Set((withoutCovers ? musicPages : pages).map(page => page.kind));
  if (kinds.size === 1) return [...kinds][0];
  return 'mixed';
}

function sourceEvidence(read, pages, rules) {
  const fonts = [...new Set(pages.flatMap(page => page.paintedFonts.map(subsetFree)))].sort();
  const evidence = {producer: read.producer, creator: read.creator, fonts};
  const exporter = classifyExporter(evidence, rules);
  const profiles = detectProfile(profileEvidence(evidence, rules), rules);
  const ids = [...new Set([...exporter.metadataSoftware, ...exporter.fontSoftware, ...profiles])].sort();
  return ids.map(id => ({id, name: rules.exporters.find(row => row.id === id)?.name || id,
    evidence: [exporter.metadataSoftware.includes(id) && 'metadata', exporter.fontSoftware.includes(id) && 'fonts',
      profiles.includes(id) && 'profile'].filter(Boolean)}));
}

function suitability(kind, evidence) {
  if (['scan', 'outlined', 'unreadable'].includes(kind)) return {status: 'unlikely', reasons: [reason(evidence)]};
  if (evidence === 'vector') return {status: 'likely', reasons: [reason('vector')]};
  return {status: 'unknown', reasons: [reason(evidence)]};
}

export function decide(read, rules) {
  const pages = read.pages.map(page => pageKind(page, rules));
  const kind = read.failure ? 'unreadable' : documentKind(pages);
  const evidence = read.failure || (pages.some(page => !page.complete) ? 'incomplete' : kind);
  return {schemaVersion: 1, dataVersion: rules.dataVersion,
    pdf: {kind, reasons: [reason(evidence)],
      bytes: read.size, pageCount: read.pageCount ?? null, pages,
      metadata: {producer: read.producer || '', creator: read.creator || ''}},
    sources: sourceEvidence(read, pages, rules), tutti: suitability(kind, evidence)};
}
