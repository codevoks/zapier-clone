'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getRequest } from '../../../../apiService'
import { TertiaryButton } from '../../../../components/buttons/TertiaryButton'

type ZapRunExecution = {
  id: string
  stepOrder: number
  status: 'PROCESSING' | 'SUCCESS' | 'FAIL'
  message: string | null
}

type ZapRun = {
  id: string
  status: 'PROCESSING' | 'SUCCESS' | 'FAIL'
  createdAt: string
  startedAt: string | null
  completedAt: string | null
  error: string | null
  zapRunExecutions: ZapRunExecution[]
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === 'SUCCESS'
      ? 'status-badge status-badge-success'
      : status === 'FAIL'
        ? 'status-badge status-badge-fail'
        : 'status-badge status-badge-processing'
  return <span className={className}>{status}</span>
}

function formatTimestamp(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

export default function ZapRunsPage() {
  const params = useParams()
  const zapId = params.zapId as string
  const [runs, setRuns] = useState<ZapRun[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const response = await getRequest({ path: `zap/${zapId}/runs`, data: {} })
        if (!cancelled) {
          if (response.status === 200) {
            setRuns(response.data.zapRuns)
          } else {
            setError('Could not load run history.')
          }
        }
      } catch {
        if (!cancelled) setError('Could not load run history.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [zapId])

  return (
    <div className="bg-secondary min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="txt-hero-sm text-primary-font">Execution history</h1>
        <TertiaryButton title="Back to zap" path={`/zap/${zapId}/edit`} />
      </div>

      {loading && <div className="text-primary-font">Loading...</div>}
      {error && <div className="text-primary-font">{error}</div>}

      {!loading && !error && runs.length === 0 && (
        <div className="text-primary-font">
          No runs yet. Trigger the webhook for this zap to see execution history here.
        </div>
      )}

      {!loading && !error && runs.length > 0 && (
        <div className="zaps-table-wrap">
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Run</th>
                  <th>Status</th>
                  <th>Triggered</th>
                  <th>Started</th>
                  <th>Completed</th>
                  <th>Steps</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {runs.map(run => (
                  <tr key={run.id}>
                    <td className="font-mono text-xs">{run.id.slice(0, 8)}</td>
                    <td>
                      <StatusBadge status={run.status} />
                    </td>
                    <td>{formatTimestamp(run.createdAt)}</td>
                    <td>{formatTimestamp(run.startedAt)}</td>
                    <td>{formatTimestamp(run.completedAt)}</td>
                    <td>
                      <div className="flex flex-col gap-1">
                        {run.zapRunExecutions.length === 0 && <span>—</span>}
                        {run.zapRunExecutions.map(step => (
                          <span key={step.id} className="flex items-center gap-2">
                            <span className="opacity-70">#{step.stepOrder}</span>
                            <StatusBadge status={step.status} />
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="max-w-[240px] truncate" title={run.error ?? undefined}>
                      {run.error ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
