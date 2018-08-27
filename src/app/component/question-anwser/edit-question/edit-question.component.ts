import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { RequestOptions, Headers } from "@angular/http";
import { UniversityService } from "../../../service/university/university.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastsManager } from "ng2-toastr";
import { BaseService } from "../../../service/base-service/base.service";
import { Constants } from "../../../constants";
import { Subscription } from "rxjs/Subscription";
declare var $: any;

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.less']
})
export class EditQuestionComponent implements OnInit {

  constructor(private uniService: UniversityService, private baseService: BaseService, private router: Router, private activateRoute: ActivatedRoute,
    private contants: Constants, private toastr: ToastsManager, private vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public qaId: number;
  public sub: Subscription;
  public userId: number;
  public question: any;
  public isCheck;
  ngOnInit() {
    document.documentElement.scrollTop = 0;
    this.sub = this.activateRoute.params.subscribe(params => {
      this.qaId = params['id'];
    });
    var seft = this;
    this.userId = this.baseService.getUser().id;
    $('#summernote').summernote({
      height: 200,
      toolbar: [
        ['style', ['bold', 'italic', 'underline']],
        ['fontsize', ['fontsize', 'color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['fullscreen', ['picture', 'fullscreen']]
      ],
      callbacks: {
        onImageUpload: function (files) {
          var image = $('<img id="load">').attr('src', '../../../assets/image/Eclipse.gif');
          $('#summernote').summernote("insertNode", image[0]);
          var file = files[0];
          var reader = new FileReader();
          reader.onloadend = function () {
            let url = "https://api.imgur.com/3/image";
            var headers = new Headers();
            headers.append('Authorization', 'Client-ID bf915d4106b6639');
            let options = new RequestOptions({ headers: headers });
            let data = {
              'image': reader.result.split(',')[1]
            };
            seft.uniService.uploadFile(url, data, options).subscribe((response: any) => {
              $('#load').remove();
              var image = $('<img>').attr('src', response.data.link);
              $('#summernote').summernote("insertNode", image[0]);
            });
          };
          reader.readAsDataURL(file);
        }
      }
    });
    this.getQuestionContent();
  }

  getQuestionContent() {
    this.uniService.getQuestionDetail(this.qaId).subscribe(res => {
      this.question = res;
      $('#summernote').summernote('code', this.question.content);
    });
  }

  onEdit(form) {
    let seft = this;
    if ($('#summernote').summernote('code').length < 50) {
      this.isCheck = true;
    } else {
      this.isCheck = false;
    }
    if (form.valid && !this.isCheck) {
      let data = {
        'title': form.value.title,
        'content': $('#summernote').summernote('code'),
        'id': this.qaId,
        'users': {
          'id': this.userId
        }
      };
      this.uniService.updateQA(data).subscribe(res => {
        this.toastr.success("Bạn đã đặt câu hỏi thành công", "Thành công", { showCloseButton: true });
        setTimeout(() => {
          seft.router.navigate(['/question-detail/' + this.qaId]);
        }, 100);
      }, (error) => {
        this.toastr.error("Không thể kết nối với máy chủ. Vui lòng kiểm tra lại", "Thất bại", { showCloseButton: true });
      });
    }

  }
}
