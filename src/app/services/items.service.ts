import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Response, Headers, RequestOptions } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/retry';

import { environment } from '../../environments/environment';

import { LocalStorageService } from './local-storage.service';

// I created this example service after following the instructions here: https://angular.io/guide/http
@Injectable()
export class ItemsService {
	private authenticatedUser;
	private authorizationToken: string;

	constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
		this.getAuthenticatedUser();
		this.getAuthorizationToken();
	}

	private handleError(err: HttpErrorResponse) {
		if (err.error instanceof Error) {
			// A client-side or network error occurred. Handle it accordingly.
			console.log('An error occurred:', err.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
		}

		return Observable.throw(err); // Rethrow the error so the calling method can also handle it.
	}

	private async getAuthenticatedUser() {
		this.authenticatedUser = await this.localStorageService.get('authenticatedUser');

	}

	private async getAuthorizationToken() {
		this.authorizationToken = await this.localStorageService.get('authorizationToken');
		if (!this.authorizationToken) {
			// TODO: Get the uathorization token from the api via login.
		}
	}

	private getAuthHttpHeaders(): HttpHeaders {
		const headers = new HttpHeaders().set('Authorization', this.authorizationToken);
		// HttpClient must default to applicaiton/json because it works without this setting:
		// Also note that instances of the header class are immutable so you need to do the following type of thing to add new header items.
		// headers = headers.set('Content-Type', 'application/json');
		// headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

		return headers;
	}

	getItems() {
		this.http.get<ItemsResponse>('/api/items')
			.retry(2)
			.subscribe(data => {
				// Read the result field from the JSON response.
				return data.results;
			});
	}

	getItemsFullResponse() {
		// Tell HttpClient that we want the full response via the observe option:
		this.http.get<MyJsonData>('/data.json', { observe: 'response' })
			.retry(2)
			.subscribe(resp => {
				// Here, resp is of type HttpResponse<MyJsonData>.
				// You can inspect its headers:
				console.log(resp.headers.get('X-Custom-Header'));
				// And access the body directly, which is typed as MyJsonData as requested.
				console.log(resp.body.someField);
			}, (err: HttpErrorResponse) => {
				this.handleError(err);
			});
	}

	getText() {
		this.http.get('/textfile.txt', { responseType: 'text' })
			// The Observable returned by get() is of type Observable<string>
			// because a text response was specified. There's no need to pass
			// a <string> type parameter to get().
			.subscribe(data => console.log(data));
	}

	addDeveloperWithoutAuth() {
		const body = { name: 'Brad' };

		this.http.post('/api/developers/add', body)
			// You still need to subscribe to initiate the post request.
			.subscribe();
	}

	addDeveloper() {
		const body = { name: 'Brad' };

		this.http.post('/api/items/add', body, {
			headers: this.getAuthHttpHeaders(),
		}).subscribe();
	}

	addDeveloperWithParams() {
		const body = { name: 'Brad' };

		// This will send the POST request to the URL /api/items/add?id=3.
		this.http
			.post('/api/items/add', body, {
				params: new HttpParams().set('id', '3'),
			})
			.subscribe();
	}

	sendSameRequestTwice() {
		const body = { name: 'Brad' };

		const req = this.http.post('/api/items/add', body); // 0 requests made - .subscribe() not called.
		req.subscribe(); // 1 request made.
		req.subscribe(); // 2 requests made.
	}


}

interface ItemsResponse {
	results: string[];
}

interface MyJsonData {
	someField: string;
}
