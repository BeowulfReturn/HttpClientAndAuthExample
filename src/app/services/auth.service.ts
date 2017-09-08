import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/shareReplay';

import { LocalStorageService } from './local-storage.service';

import { environment } from '../../environments/environment';

// Test commit!
@Injectable()
export class AuthService {
	private requestOptions: RequestOptions;
	private _authenticated_user;
	public authorizationToken: string;

	constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
		this.getAuthenticatedUser();
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error); // Rethrow the error so the calling method can also handle it.
	}

	private async getAuthenticatedUser() {
		this._authenticated_user = await this.localStorageService.get('authenticated_user');

		this.createRequestOptions();
	}

	private async getAuthorizationToken() {
		this.authorizationToken = await this.localStorageService.get('authorizationToken');
		if (!this.authorizationToken) {
			// TODO: Get the uathorization token from the api.
		}
	}

	getAuthorizationHeader(): HttpHeaders {
		return new HttpHeaders().set('Authorization', this.authorizationToken);
	}

	createRequestOptions() {
		const headers = new Headers();
		// headers.append("Authorization", "Basic " + btoa(AuthSettings.CLIENT_ID + ":" + AuthSettings.CLIENT_SECRET));
		// this.http.defaults.headers.common.Authorization = 'Token '+_authenticated_user.token;
		if (this._authenticated_user) {
			headers.append('Authorization', 'Token ' + this._authenticated_user.token);
		}

		// headers.append('Content-Type', 'application/x-www-form-urlencoded');
		headers.append('Content-Type', 'application/json');

		// let headers = new Headers({'Content-Type': 'application/json'});
		// headers.append('Authorization','Bearer ')
		this.requestOptions = new RequestOptions({ headers: headers });
	}

	signUp(email: string, password: string) {
		const url = 'api/signup';
		return this.http.post<User>(url, { email, password }).shareReplay();
	}

	login(details, callback) {
		const url = `${environment.apiUrl}/api/auth/login/`;
		this.http.post(url, JSON.stringify(details), this.requestOptions).subscribe((response: Response) => {
			this._authenticated_user = JSON.parse(response.text());
			this.localStorageService.set('authenticated_user', this._authenticated_user);

			callback(this._authenticated_user);
		}, (error) => {
			callback(null, error);
		});
	}

	register(details, callback) {
		const url = `${environment.apiUrl}/api/auth/register/`;
		this.http.post(url, JSON.stringify(details), this.requestOptions).subscribe((response: Response) => {
			this._authenticated_user = JSON.parse(response.text());
			this.localStorageService.set('authenticated_user', this._authenticated_user);

			callback(this._authenticated_user);
		}, (error) => {
			callback(null, error);
		});
	}

	logout() {
		const url = `${environment.apiUrl}/api/auth/logout/`;
		return this.http.delete(url, this.requestOptions)
			// .map((response: Response) => {
			// 	const results = JSON.parse(response.text())
			// })
			.catch((error: Response) =>
				this.handleError(error)
			)
			.subscribe(() => {
				this.requestOptions.headers.delete('Authorization');
				this.localStorageService.remove('authenticated_user');
			});
	}
}

interface User {
	email: string;
	password: string;
}
