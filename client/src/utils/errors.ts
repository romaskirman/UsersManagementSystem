export function getErrorMessage(error: any, fallback: string) {
  return error?.response?.data?.message || fallback;
}

export function getErrorStatus(error: any) {
  return error?.response?.status;
}