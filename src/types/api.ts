export interface ApiError {
  message: string
  details?: string[]
}

export interface ApiSuccess<TData> {
  data: TData
  error: null
}

export interface ApiFailure {
  data: null
  error: ApiError
}

export type ApiResponse<TData> = ApiSuccess<TData> | ApiFailure
