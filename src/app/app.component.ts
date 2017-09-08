import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/shareReplay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private http: HttpClient) {
  }

  signUp(email: string, password: string) {
    const url = 'api/signup';
    return this.http.post<User>(url, { email, password }).shareReplay();
  }

}

interface User {
  email: string;
  password: string;
}
