export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
      .response?.data?.message === 'string'
  ) {
    const data = (error as { response: { data: { message: string; errors?: Record<string, string[]> } } })
      .response.data;
    if (data.errors) {
      const firstFieldError = Object.values(data.errors).flat()[0];
      if (firstFieldError) return firstFieldError;
    }
    return data.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string' && message.length > 0) return message;
  }

  return fallback;
}
