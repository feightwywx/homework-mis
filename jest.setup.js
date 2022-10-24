// jest.setup.js
import { loadEnvConfig } from '@next/env'

export default async function setupJest() {
  loadEnvConfig(process.cwd())
}
