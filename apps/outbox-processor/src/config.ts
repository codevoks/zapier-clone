function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is missing or invalid.`)
  }
  return value
}

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const parsed = Number.parseInt(raw, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

export const config = {
  kafkaBrokers: requireEnv('KAFKA_BROKERS').split(',').map(b => b.trim()),
  kafkaTopic: process.env.KAFKA_TOPIC ?? 'zap-events',
  kafkaClientId: process.env.KAFKA_CLIENT_ID ?? 'outbox-processor',
  pollIntervalMs: intEnv('OUTBOX_POLL_INTERVAL_MS', 500),
  batchSize: intEnv('OUTBOX_BATCH_SIZE', 10),
  maxAttempts: intEnv('OUTBOX_MAX_ATTEMPTS', 5),
}
