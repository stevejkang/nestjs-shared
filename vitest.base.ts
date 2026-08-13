import swc from 'unplugin-swc';
import type { UserWorkspaceConfig } from 'vitest/config';
import { defineProject } from 'vitest/config';

export function createVitestProjectConfig(
  dirname: string,
): UserWorkspaceConfig {
  return defineProject({
    root: dirname,
    plugins: [
      swc.vite({
        jsc: {
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
        },
      }),
    ],
    test: {
      environment: 'node',
      include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
    },
  });
}
