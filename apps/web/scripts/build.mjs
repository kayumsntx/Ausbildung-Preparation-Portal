import { spawnSync } from 'node:child_process';

// Force NODE_ENV=production during `next build` to prevent React dual-instance
// dispatcher crashes (`Cannot read properties of null (reading 'useContext')`)
// when hosting providers set a non-standard NODE_ENV during the build step.
const result = spawnSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
  },
});

process.exit(result.status ?? 1);

