#!/usr/bin/env node
import { main } from './cli.ts';

// A closed pipe (caustic list | head) is not an error.
process.stdout.on('error', e => { if ((e as NodeJS.ErrnoException).code === 'EPIPE') process.exit(0); throw e; });

main(process.argv.slice(2)).then(
  code => { process.exitCode = code; },
  e => { console.error(e instanceof Error ? e.stack ?? e.message : e); process.exitCode = 2; },
);
