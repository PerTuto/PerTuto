const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getValidRoutes(dir, baseRoute = '') {
  let routes = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name === 'api' || entry.name.startsWith('_')) continue;
      const newRoute = (entry.name.startsWith('(') && entry.name.endsWith(')'))
        ? baseRoute // Route groups e.g. (dashboard) don't add to path
        : `${baseRoute}/${entry.name}`;
      routes.push(...getValidRoutes(path.join(dir, entry.name), newRoute));
    } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
      let cleanRoute = baseRoute === '' ? '/' : baseRoute;
      routes.push(cleanRoute);
    }
  }
  return routes;
}

const appDir = path.join(__dirname, 'src/app');
const validRoutes = getValidRoutes(appDir);
console.log(`Registered ${validRoutes.length} valid Next.js routes.`);

const rawLinks = execSync(`grep -roh 'href="\\/[^"]*"' src | sort | uniq`, { encoding: 'utf-8' });
const links = rawLinks.split('\n')
  .filter(l => l.trim() !== '')
  .map(l => l.replace('href="', '').replace('"', ''));

console.log(`Found ${links.length} hardcoded internal links pointing to /... paths`);

function routeMatches(link, route) {
    if (link === route || link === route + '/') return true;
    
    // Convert NEXT.js dynamic segments to regex (e.g. /[tenantId]/courses -> /[^/]+/courses)
    let routeRegexStr = '^' + route.replace(/\[[^\]]+\]/g, '[^/]+') + '/?$';
    const routeRegex = new RegExp(routeRegexStr);
    
    const linkPath = link.split('?')[0].split('#')[0]; 
    return routeRegex.test(linkPath);
}

const brokenLinks = [];

for (const link of links) {
    // Ignore dynamic variables for static analysis
    if (link.includes('${')) continue;

    let isMatched = false;
    for (const route of validRoutes) {
        if (routeMatches(link, route)) {
            isMatched = true;
            break;
        }
    }

    if (!isMatched) {
        brokenLinks.push(link);
    }
}

console.log('\n--- 🚨 BROKEN / PLACEHOLDER LINKS FOUND ---');
brokenLinks.forEach(b => console.log(b));
