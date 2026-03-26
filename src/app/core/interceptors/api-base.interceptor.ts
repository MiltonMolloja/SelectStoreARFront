import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiBaseInterceptor: HttpInterceptorFn = (req, next) => {
  // Only prefix relative URLs (starting with /api)
  if (req.url.startsWith('/api')) {
    const apiReq = req.clone({
      url: `${environment.apiUrl}${req.url.substring(4)}`,
    });
    return next(apiReq);
  }
  return next(req);
};
