import { NextResponse } from 'next/server'
import { ApiFailure, ApiSuccess } from '@/types/api'

export function success<TData>(data: TData, status = 200) {
  const body: ApiSuccess<TData> = { data, error: null }
  return NextResponse.json(body, { status })
}

export function failure(message: string, status: number, details?: string[]) {
  const body: ApiFailure = {
    data: null,
    error: { message, details }
  }
  return NextResponse.json(body, { status })
}
