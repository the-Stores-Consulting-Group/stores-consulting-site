import { spawnSync } from 'node:child_process';

const optionsResult = spawnSync(process.execPath, ['scripts/build-editor-options.mjs'], {stdio:'inherit'});
if (optionsResult.status !== 0) process.exit(optionsResult.status ?? 1);
const task = process.argv[2];
const commands = {
  dev: 'astro dev',
  build: 'astro build',
  check: 'astro check',
};

if (!commands[task]) {
  console.error('Usage: node scripts/run-with-tina.mjs <dev|build|check> [Astro arguments]');
  process.exit(2);
}

const quote = (value) => `'${value.replaceAll("'", "'\\''")}'`;
const baseCommand = [commands[task], ...process.argv.slice(3).map(quote)].join(' ');
const astroCommand = task === 'dev' ? `${baseCommand} && astro dev logs --follow` : baseCommand;

const clientId = process.env.TINA_PUBLIC_CLIENT_ID || process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
const cloudConfigured = Boolean(clientId && process.env.TINA_TOKEN);
const args = [
  task === 'dev' ? 'dev' : 'build',
  ...(task === 'dev' ? [] : [cloudConfigured ? '--content=local' : '--local']),
  '--noTelemetry',
  // Builds always read local content, so they never need TinaCloud's branch
  // index/schema check; skipping it avoids hanging on branches TinaCloud
  // hasn't indexed yet (e.g. new agent/preview branches).
  ...(task === 'dev' ? [] : ['--skip-cloud-checks']),
  '-c',
  astroCommand,
];

const result = spawnSync('tinacms', args, {
  stdio: 'inherit',
  shell: false,
  env: process.env,
});

if (result.error) throw result.error;
if (result.status) process.exit(result.status);
// --content=local keeps builds deterministic but skips TinaCloud search indexing.
// Upload a separate branch index only after the application build succeeds.
if (task === 'build' && cloudConfigured) {
  if (!process.env.TINA_SEARCH_TOKEN) {
    console.error('TINA_SEARCH_TOKEN is required to publish the editor search index.');
    process.exit(1);
  }
  const search = spawnSync('tinacms', ['search-index'], {stdio:'inherit', shell:false, env:process.env});
  if (search.error) throw search.error;
  process.exit(search.status ?? 1);
}
process.exit(result.status ?? 1);
