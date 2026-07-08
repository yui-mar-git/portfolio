import fs from 'fs';
const content = fs.readFileSync('src/pages/portfolio/roguelike/index.astro', 'utf8');
const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  let script = scriptMatch[1]
    .replace(/import\s+.*?from\s+['"].*?['"];/g, '')
    .replace(/import\.meta\.url/g, "'foo'");
  fs.writeFileSync('scratch/test_script.cjs', script);
}
