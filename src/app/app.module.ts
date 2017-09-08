import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LocalStorageService } from './services/local-storage.service';
import { AuthService } from './services/auth.service';

import { MyInterceptor } from './services/my-interceptor';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule
		, HttpClientModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: MyInterceptor,
			multi: true,
		}
		, LocalStorageService
		, AuthService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
