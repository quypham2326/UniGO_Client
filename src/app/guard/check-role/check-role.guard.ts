import { Injectable, ViewContainerRef } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from "../../service/login/login.service";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Injectable()
export class CheckRoleGuard implements CanActivate {
  constructor(private loginService: LoginService, public toastr: ToastsManager,
    private router: Router) {
    //this.toastr.setRootViewContainerRef(vcr);
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.loginService.authentication().map((value) => {
      const role = this.loginService.getUser().role;
      console.log("CHECK ROLE");
      if (role != 'USER' && role != 'ADMIN') {
        console.log(role);
        this.toastr.warning('Vui lòng đăng nhập trước', '',
          { showCloseButton: true });
        return false;
      } else if (state.url.includes('/admin') && role != 'ADMIN') {
        this.router.navigate(['home']);
        return false;
      }
      return true;
    });
  }
}
