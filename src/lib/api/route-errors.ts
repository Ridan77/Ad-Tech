export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown error'
}

export function isInvalidIdError(error: unknown): boolean {
  return error instanceof Error && error.message.toLowerCase().includes('invalid client id')
}
