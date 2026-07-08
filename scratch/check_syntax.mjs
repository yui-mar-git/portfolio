import fs from 'fs';
const content = fs.readFileSync('src/pages/portfolio/roguelike/index.astro', 'utf8');
const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  let script = scriptMatch[1]
    .replace(/import\s+.*?from\s+['"].*?['"];/g, '')
    .replace(/import\.meta\.url/g, "'foo'");
  try {
    new Function(script);
    console.log('No syntax errors in script');
  } catch (e) {
    console.error('Syntax error:', e);
  }
} else {
  console.log('No script found');
}
