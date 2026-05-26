export type ServiceResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; status: 400 | 404 | 409 | 500; message: string }
