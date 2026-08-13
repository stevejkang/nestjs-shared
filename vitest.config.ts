import { existsSync, readdirSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

const packagesDir = 'packages';
const hasProjects =
  existsSync(packagesDir) &&
  readdirSync(packagesDir).some((entry) => !entry.startsWith('.'));

export default defineConfig({
  test: {
    ...(hasProjects ? { projects: ['packages/*'] } : {}),
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
    },
  },
});
