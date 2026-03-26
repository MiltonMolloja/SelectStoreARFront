import { HttpInterceptorFn } from '@angular/common/http';

/** Send cookies with every request (httpOnly JWT cookie) */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({ withCredentials: true });
  return next(authReq);
};
