import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library auto-cleanup is not registered automatically without globals, so do it here.
afterEach(() => {
  cleanup();
});
