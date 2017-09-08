import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// I created this example interceptor after following the instructions here: https://angular.io/guide/http
@Injectable()
export class MyInterceptor implements HttpInterceptor {
	// intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
	// 	return next.handle(req);
	// }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Since requests are immutable, they cannot be modified directly. To mutate them, use clone().
		// This is a duplicate. It is exactly the same as the original.
		const dupReq = req.clone();

		// Change the URL and replace 'http://' with 'https://'
		const secureReq = req.clone({ url: req.url.replace('http://', 'https://') });

		return next.handle(secureReq);
	}
}
