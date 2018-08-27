import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Http, RequestOptions, Response, Headers } from "@angular/http";
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import { BaseService } from "../base-service/base.service";
import { Constants } from "../../constants";
import { User } from "../../model/User";
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';

@Injectable()
export class LoginService {
    public user: User;
    public isLoggedIn = false;
    public isRole: any;
    constructor(private _http: Http,
        private contants: Constants,
        private baseService: BaseService,
        private router: Router) { }
    public space = new BehaviorSubject<any>(null);

    public broadcastTextChange(value: any) {
        this.space.next(value);
    }

    public getUser(): User {
        return this.user;
    }

    public checkLogged(): boolean {
        return this.isLoggedIn;
    }
    public setLogin(isLoggedIn: boolean) {
        this.isLoggedIn = isLoggedIn;
    }
    public setRole(isRole: any) {
        this.isRole = isRole;
    }
    public checkRole() {
        return this.isRole;
    }
    register(apiUrl, data): Observable<any[]> {
        return this._http.post(apiUrl, data).map((res: Response) => res.json());
    }
    login(apiUrl, data): Observable<any> {
        return this._http.post(apiUrl, data).map((res: Response) => res.json());
    }
    loginProvider(apiUrl, data, headers): Observable<any> {
        return this._http.post(apiUrl, data, headers).map((res: Response) => res.json());
    }
    getAuthentication(apiUrl, headers): Observable<any> {
        return this._http.get(apiUrl, headers).map((res: Response) => res.json());
    }
    authentication(): Observable<boolean> {
        let token = localStorage.getItem('token');
        if (!token) {
            return Observable.of(false);
        }
        const requestOptions = {
            headers: this.authorizationHeader()
        };
        return this.getAuthentication(this.contants.USER_INFO, requestOptions)
            .map((res: Response) => {
                this.baseService.setUser(res);
                this.user = this.baseService.getUser();
                this.isLoggedIn = true;
                return this.isLoggedIn;
            }).catch((error: Response) => {
                // if (error.status == this.contants.UNAUTHORIZED ||
                //     error.status == this.contants.INTERNAL_SERVER_ERROR) {
                this.user = null;
                this.isLoggedIn = false;
                localStorage.removeItem("token");
                localStorage.removeItem("provider");
                // }
                return Observable.of(false);
            });
    }
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
}
