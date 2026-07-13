import fs from 'fs';
let code = fs.readFileSync('src/lib/dashboard.ts', 'utf8');
code = code.replace(/, '([^']+)\s\([^)]+\)'\]/g, ", '$1']");
fs.writeFileSync('src/lib/dashboard.ts', code);
