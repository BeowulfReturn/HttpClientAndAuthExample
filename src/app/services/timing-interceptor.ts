import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { AuthService } from './auth.service';

// I created this example interceptor after following the instructions here: https://angular.io/guide/http

export class TimingInterceptor implements HttpInterceptor {
	constructor(private auth: AuthService) { }

	/*
		Because interceptors can process the request and response together, they can do things like log or time requests.
		Consider this interceptor which uses console.log to show how long each request takes:
	*/
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const started = Date.now();
		return next
			.handle(req)
			.do(event => {
				if (event instanceof HttpResponse) {
					const elapsed = Date.now() - started;
					console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
				}
			});
	}
}
