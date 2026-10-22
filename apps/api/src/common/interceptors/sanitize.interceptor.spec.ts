import { describe, it, expect } from 'vitest';
import { SanitizeInterceptor } from './sanitize.interceptor.js';

describe('SanitizeInterceptor (XSS & Prototype Pollution Defense)', () => {
  const interceptor = new SanitizeInterceptor();

  it('1. should strip malicious script tags and inline script bodies', () => {
    const malicious = '<script>alert("XSS")</script>Hello German Learner';
    const clean = interceptor.sanitizeValue(malicious);
    expect(clean).toBe('Hello German Learner');
  });

  it('2. should strip inline javascript: pseudo-protocols', () => {
    const malicious = '<a href="javascript:doEvil()">Click here</a>';
    const clean = interceptor.sanitizeValue(malicious);
    expect(clean).not.toContain('javascript:');
  });

  it('3. should strip dangerous event handlers like onerror, onload, onclick', () => {
    const malicious = '<img src="x" onerror="alert(1)" onload="evil()" />';
    const clean = interceptor.sanitizeValue(malicious);
    expect(clean).not.toContain('onerror');
    expect(clean).not.toContain('onload');
  });

  it('4. should prevent prototype pollution keys (__proto__, constructor, prototype)', () => {
    const payload = JSON.parse('{"__proto__": {"isAdmin": true}, "name": "Valid Candidate"}');
    const clean = interceptor.sanitizeValue(payload);

    expect(clean.__proto__).not.toHaveProperty('isAdmin');
    expect(clean.name).toBe('Valid Candidate');
  });

  it('5. should recursively sanitize nested objects and arrays in request payloads', () => {
    const complexPayload = {
      notes: 'Applying for Ausbildung <script>alert(1)</script>',
      skills: ['German B1', '<iframe src="evil.com"></iframe>TypeScript'],
      meta: {
        coverLetter: 'Sehr geehrte Damen und Herren <script src="xss.js"></script>',
      },
    };

    const clean = interceptor.sanitizeValue(complexPayload);

    expect(clean.notes).toBe('Applying for Ausbildung ');
    expect(clean.skills[1]).toBe('TypeScript');
    expect(clean.meta.coverLetter).toBe('Sehr geehrte Damen und Herren ');
  });
});
