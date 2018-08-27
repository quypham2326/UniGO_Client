import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import * as $ from 'jquery';
import { AuthService } from 'angular2-social-login';
import { LoginService } from './service/login/login.service';
import { NgForm } from "@angular/forms";
import { Constants } from "./constants";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { User } from "./model/User";
import { BaseService } from "./service/base-service/base.service";
import { UniversityService } from "./service/university/university.service";
import { WaitingBoxComponent } from "./waiting-box/waiting-box.component";
import { Http, Headers } from '@angular/http';
import { error } from 'util';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})

export class AppComponent implements OnInit, OnDestroy {
    public user: User;
    sub: any;
    public title;
    public content;
    constructor(private auth: AuthService, private loginService: LoginService,
        private baseService: BaseService, private uniService: UniversityService,
        private contants: Constants, public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }
    ngOnInit() {
    }
    public login(provider: string) {
        this.sub = this.auth.login(provider).subscribe(
            (data) => {
                this.baseService.setUser(data);
                this.user = this.baseService.getUser();
                $('#myModal').hide();
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                let dataLogin = {
                    'username': this.user.email,
                    'image': this.user.image,
                    'name': this.user.name,
                    'providerId': this.user.id,
                    'providerName': this.user.providerName,
                    'token': this.user.token
                };
                let headers = new Headers();
                headers.append('Provider', provider);
                this.sendLoginRequest(dataLogin, headers, provider, null);
            }
        );
    }

    public sendLoginRequest(dataLogin, headers, provider, errorHandler) {
        this.loginService.loginProvider(this.contants.LOGIN_URL, dataLogin, {
            headers: headers
        }).subscribe((res: Response) => {
            if (res) {
                this.baseService.setUser(res);
                this.user = this.baseService.getUser();
                this.loginService.setLogin(true);
                this.loginService.setRole(this.user.role);
                this.loginService.broadcastTextChange(this.user);
                /* this.uniService.getQuestionByUser(this.user).subscribe(res => {
                     let count = 0;
                     for (let i = 0; i < res.length; i++) {
                         count = count + res[i].count;
                     }
                     this.uniService.broadcastTextChange(count);
                 });*/
                localStorage.setItem('token', this.user.token);
                if (provider) {
                    localStorage.setItem('provider', provider);
                } else {
                    localStorage.removeItem('provider');
                }
                window.location.reload();
            }
        }, error => {
            if (errorHandler) {
                errorHandler(error);
            }
        });
    }

    public onRegister(registerForm: NgForm) {
        let data = {
            'username': registerForm.value.nameRegister,
            'password': registerForm.value.passResgiter,
            'email': registerForm.value.registerEmail
        };
        this.loginService.register(this.contants.REGISTER, data).subscribe((response: any) => {
            if (response) {
                $('#myModal').hide();
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                this.toastr.success('Bạn đã đăng ký thành công', 'Thành công!');
                registerForm.onReset();
            }
        }, error => {
            if (error.status == this.contants.CONFLICT) {
                this.toastr.error('Tài khoản này đã tồn tại. Vui lòng thử lại', 'Thất bại');
                registerForm.onReset();
            } else {
                this.toastr.error('Vui lòng kiểm tra lại kết nối mạng', 'Thất bại');
            };
        });
        registerForm.onReset();
    }
    public onLogin(value) {
        let data = {
            'username': value.username,
            'password': value.password
        };
        this.sendLoginRequest(data, new Headers(), null, (error) => {
            if (error.status == this.contants.UNAUTHORIZED) {
                this.toastr.error('Username/Password không đúng. Vui lòng thử lại.', 'Thất bại!');
            } else {
                this.toastr.error('Vui lòng kiểm tra lại kết nối mạng', 'Thất bại');
            };
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
        $("#myModal").html("");
    }


}
