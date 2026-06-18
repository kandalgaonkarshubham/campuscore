export interface UploadedFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export interface AppRequest {
  body: Record<string, unknown>;
  query: Record<string, unknown>;
  params: Record<string, string | string[]>;
  cookies?: Record<string, string>;
  file?: UploadedFile;
  user?: {
    id: number;
    username: string;
  };
}

export interface AppResponse {
  status(code: number): AppResponse;
  json(body: unknown): AppResponse;
  send(body?: unknown): AppResponse;
  cookie(name: string, value: string, options?: unknown): AppResponse;
  clearCookie(name: string, options?: unknown): AppResponse;
}

export type NextFn = (err?: unknown) => void;
