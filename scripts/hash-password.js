#!/usr/bin/env node
// Generates the SHA-256 hex hash of a password, used for the ADMIN_PASSWORD_HASH
// server environment variable. Run with:
//   node scripts/hash-password.js
// It prompts (hidden input) and prints the hash. Never commit the hash of your
// real password to git — put it in the hosting platform's env settings instead.

import { createHash } from 'crypto'
import { createInterface } from 'readline'
import { stdin as input, stdout as output } from 'process'

const rl = createInterface({ input, output })

function ask(query) {
  return new Promise((resolve) => {
    // Hide echoed input (best-effort on Windows/Linux terminals).
    rl.question(query, (answer) => resolve(answer))
  })
}

const password = await ask('Enter the admin password to hash: ')
const confirm = await ask('Confirm the admin password: ')
rl.close()

if (!password) {
  console.error('No password entered.')
  process.exit(1)
}
if (password !== confirm) {
  console.error('Passwords do not match.')
  process.exit(1)
}

const hash = createHash('sha256').update(password).digest('hex')
console.log('\nSHA-256 hash of the password:')
console.log(hash)
console.log('\nSet this value as ADMIN_PASSWORD_HASH in your server environment,')
console.log('and set ADMIN_USERNAME (default "admin") alongside it.')
