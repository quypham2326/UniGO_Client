import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../../service/login/login.service';
import { BaseService } from '../../service/base-service/base.service';
import { Observable } from "rxjs";

@Injectable()
export class CheckLoginGuard implements CanActivate {
    constructor(private loginService: LoginService, private baseService: BaseService,
        private router: Router) {

    }

    canActivate() {
        var tmp = this;
        var observable = this.loginService.authentication()
            .map((rs: boolean) => {
                if (!rs) {
                    tmp.baseService.showLoginForm();
                }
                return rs;
            });
        return observable;
    }
}
