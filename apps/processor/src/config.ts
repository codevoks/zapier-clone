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
  kafkaClientId: process.env.KAFKA_CLIENT_ID ?? 'processor',
  consumerGroup: process.env.KAFKA_CONSUMER_GROUP ?? 'zap-worker',
  fromBeginning: process.env.KAFKA_FROM_BEGINNING === 'true',
  maxInfraRetries: intEnv('WORKER_MAX_INFRA_RETRIES', 3),
  infraRetryBaseDelayMs: intEnv('WORKER_INFRA_RETRY_BASE_DELAY_MS', 500),
}
