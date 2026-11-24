// Source fingerprints adapted from Tutti browser precheck-core.js (MIT).

const regex = (spec) => new RegExp(spec.source, spec.flags);

export function subsetFree(name) {
  return typeof name === 'string' && name.length > 7 && name[6] === '+' ? name.slice(7) : name;
}

// vector/exporter.py classify()
export function classifyExporter({producer = '', creator = '', fonts = []}, knowledge) {
  const sorted = [...new Set(fonts)].sort();
  const byMeta = knowledge.exporters.filter(row => regex(row.meta).test(producer || '') || regex(row.meta).test(creator || '')).map(row => row.id);
  const byFonts = knowledge.exporters.filter(row => row.fontSets.some(group =>
    group.every(prefix => sorted.some(font => font.startsWith(prefix))))).map(row => row.id);
  return {metadataSoftware: byMeta, fontSoftware: byFonts};
}

// vector/engine_profile.py evidence()
export function profileEvidence({producer = '', creator = '', fonts = []}, knowledge) {
  const sorted = [...new Set(fonts)].sort();
  const families = [...new Set(sorted.filter(f => Object.hasOwn(knowledge.families, f)).map(f => knowledge.families[f]))].sort();
  return {
    meta: {producer: producer || '', creator: creator || ''},
    families,
  };
}

function evaluate(node, {metaOn, fontOn, ev}) {
  if (!node || typeof node !== 'object' || Array.isArray(node) || !Object.keys(node).length) return false;
  const results = [];
  if ('all_of' in node) results.push(node.all_of.every(sub => evaluate(sub, {metaOn, fontOn, ev})));
  if ('any_of' in node) results.push(node.any_of.some(sub => evaluate(sub, {metaOn, fontOn, ev})));
  if ('meta' in node) results.push(Boolean(metaOn) && Object.entries(node.meta).every(([key, spec]) => regex(spec).test(ev.meta[key] || '')));
  if ('font_family' in node) results.push(Boolean(fontOn) && ev.families.includes(node.font_family));
  return results.length ? results.every(Boolean) : false;
}

function topHits(knowledge, ev, metaOn, fontOn) {
  const hits = knowledge.profiles.filter(row => evaluate(row.detect, {metaOn, fontOn, ev}))
    .map(row => [row.specificity, row.id]);
  if (!hits.length) return [];
  const best = Math.max(...hits.map(([score]) => score));
  return hits.filter(([score]) => score === best).map(([, id]) => id).sort();
}

export function detectProfile(ev, knowledge) {
  const metaHits = topHits(knowledge, ev, true, false);
  if (metaHits.length > 1) return metaHits;
  const fontHits = topHits(knowledge, ev, false, true);
  return [...new Set([...metaHits, ...fontHits])].sort();
}
