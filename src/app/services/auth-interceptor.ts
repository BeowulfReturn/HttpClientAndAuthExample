import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

// I created this example interceptor after following the instructions here: https://angular.io/guide/http
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private auth: AuthService) { }

	/*
		An interceptor that alters headers can be used for a number of different operations, including:

		Authentication/authorization
		Caching behavior; for example, If-Modified-Since
		XSRF protection
	*/
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// // Clone the request to add the new header.
		// const authReq = req.clone({ headers: req.headers.set('Authorization', this.auth.authorizationToken) });

		// The practice of cloning a request to set new headers is so common that a shortcut is provided,
		// so you can replace the above with:
		const authReq = req.clone({ setHeaders: { Authorization: this.auth.authorizationToken } });

		// Pass on the cloned request instead of the original request.
		return next.handle(authReq);
	}
}
