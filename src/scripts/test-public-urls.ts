const BASE_URL = 'https://pertuto.com';

const PUBLIC_ROUTES = [
  { path: '/', expected: 'PerTuto' },
  { path: '/about', expected: 'About' },
  { path: '/pricing', expected: 'Pricing' },
  { path: '/contact', expected: 'Contact' },
  { path: '/services/k12', expected: 'K-12' },
  { path: '/services/professional', expected: 'Professional' },
  { path: '/services/university', expected: 'University' },
  { path: '/privacy', expected: 'Privacy' },
  { path: '/terms', expected: 'Terms' },
  { path: '/blog', expected: 'Blog' },
  { path: '/resources', expected: 'Resources' },
  { path: '/testimonials/submit', expected: 'Testimonial' },
  { path: '/login', expected: 'Sign In' },
];

async function checkRoute(route: { path: string, expected: string }) {
  try {
    const res = await fetch(`${BASE_URL}${route.path}`);
    if (!res.ok) {
      console.log(`❌ FAIL: ${route.path} (HTTP ${res.status})`);
      return false;
    }
    const text = await res.text();
    if (!text.includes(route.expected) && !text.toLowerCase().includes(route.expected.toLowerCase())) {
        console.log(`⚠️ WARN: ${route.path} (Missing token: ${route.expected})`);
    } else {
        console.log(`✅ PASS: ${route.path} (HTTP 200, Content verified)`);
    }
    return true;
  } catch (err: any) {
    console.log(`❌ FAIL: ${route.path} (Error: ${err.message})`);
    return false;
  }
}

async function runTests() {
  console.log(`Starting Pass 1 Smoke Tests against ${BASE_URL}...`);
  for (const route of PUBLIC_ROUTES) {
    await checkRoute(route);
  }
}

runTests();
