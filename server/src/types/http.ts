export interface JsonResponse {
  status(code: number): JsonResponse;
  json(body: unknown): JsonResponse;
  send(body?: unknown): JsonResponse;
}
