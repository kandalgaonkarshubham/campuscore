import type { Request, RequestHandler, Response } from 'express';
import type { AppRequest, AppResponse, NextFn } from '../types/http';

type AsyncAppHandler = (req: AppRequest, res: AppResponse) => Promise<void>;
type SyncAppHandler = (req: AppRequest, res: AppResponse) => void;

export function toRequestHandler(handler: AsyncAppHandler): RequestHandler {
  return ((req: Request, res: Response, next: NextFn) => {
    void handler(req as unknown as AppRequest, res as unknown as AppResponse).catch((error) =>
      next(error),
    );
  }) as RequestHandler;
}

export function toSyncRequestHandler(handler: SyncAppHandler): RequestHandler {
  return ((req: Request, res: Response, next: NextFn) => {
    try {
      handler(req as unknown as AppRequest, res as unknown as AppResponse);
    } catch (error) {
      next(error);
    }
  }) as RequestHandler;
}
