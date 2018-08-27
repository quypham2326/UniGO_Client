import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from "rxjs";

@Injectable()
export class AuthorizedHttpClient {

  constructor(private http: Http) { }

  public authorizationHeader() {
    let headers = new Headers();
    let provider = localStorage.getItem('provider');
    let token = localStorage.getItem('token');
    if (provider) {
      headers.append('Provider', provider);
    }
    if (token) {
      headers.append('Authorization', token);
    }
    return headers;
  }

  get(url): Observable<any> {
    return this.http.get(url, {
      headers: this.authorizationHeader()
    }).map((res: Response) => res.json());
  }

  post(url, data): Observable<any> {
    return this.http.post(url, data, {
      headers: this.authorizationHeader()
    }).map((res: Response) => res.json());
  }
}