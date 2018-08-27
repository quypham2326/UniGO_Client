import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UniversityService } from "../../../service/university/university.service";
import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseService } from "../../../service/base-service/base.service";
import { Constants } from "../../../constants";
import { ToastsManager } from "ng2-toastr";
import { Answer } from "../../../model/Answer";
import { RequestOptions, Headers } from "@angular/http";
declare var $: any;
@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.less']
})
export class QuestionDetailComponent implements OnInit {

  public sub: Subscription;
  private qaId: number;
  public question: any;
  public anwsers: Answer[];
  public userId: number = 0;
  public selectIndex: number;
  public role = 0;
  public valueReport;
  constructor(private uniService: UniversityService, private activateRoute: ActivatedRoute, private router: Router,
    private baseService: BaseService, private contants: Constants, private toastr: ToastsManager, private vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    document.documentElement.scrollTop = 0;
    this.sub = this.activateRoute.params.subscribe(params => {
      this.qaId = params['id'];
    });
    if (this.baseService.getUser()) {
      this.role = this.baseService.getUser().role.id;
    }

    this.uniService.getQuestionDetail(this.qaId).subscribe(res => {
      this.question = res;
    });
    var seft = this;
    setTimeout(() => {
      $('#summnernote').summernote({
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
            $('#summnernote').summernote("insertNode", image[0]);
            var file = files[0];
            var reader = new FileReader();
            reader.onloadend = function () {
              console.log('RESULT', reader)
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
                $('#summnernote').summernote("insertNode", image[0]);
              });
            };
            reader.readAsDataURL(file);
          }
        }
      });
    }, 0);
    this.getAnswer();
    // this.anwsers = [
    //   {
    //     'content' : " <p>dasdasd</p><p>sad</p><p>dsadas</p><p>dasd</p>"
    //   }
    // ]
  }

  getAnswer() {
    this.uniService.getAnwserByQuestion(this.qaId).subscribe(res => {
      this.anwsers = [];
      res.forEach(x => {
        this.anwsers.push(new Answer(x));
      });
    });
  }
  onSummit() {
    if (!$('#summnernote').summernote('isEmpty')) {
      let data = {
        'title': '',
        "content": $('#summnernote').summernote('code'),
        "type": this.contants.ANWSER,
        "parentId": this.qaId
      };
      this.uniService.saveQuestionAnswer(data).subscribe(res => {
        if (!this.anwsers) {
          this.anwsers = [];
        }
        let data = {
          'id': res,
          'content': $('#summnernote').summernote('code'),
          'vote': 0,
          'users': {
            'id': this.userId,
            'name': this.baseService.getUser().name,
            'image': this.baseService.getUser().image
          }
        }
        this.anwsers.push(new Answer(data));
        $('#summnernote').summernote('code', " ");
      }, (error) => {
        this.toastr.error("Không thể kết nối với máy chủ. Vui lòng kiểm tra lại", "Thất bại", { showCloseButton: true });
      });
    }
  }
  setSummernote(value) {
    var seft = this;
    setTimeout(() => {
      $('#edit-summernote').summernote({
        height: 100,
        toolbar: [
          ['style', ['bold', 'italic', 'underline']],
          ['fontsize', ['fontsize', 'color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['fullscreen', ['picture', 'fullscreen']]
        ],
        callbacks: {
          onImageUpload: function (files) {
            var image = $('<img id="load">').attr('src', '../../../assets/image/Eclipse.gif');
            $('#edit-summernote').summernote("insertNode", image[0]);
            var file = files[0];
            var reader = new FileReader();
            reader.onloadend = function () {
              console.log('RESULT', reader)
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
                $('#edit-summernote').summernote("insertNode", image[0]);
              });
            };
            reader.readAsDataURL(file);
          }
        }
      });
      $('#edit-summernote').summernote('code', value.content);
    });
  }
  onEditAnswer(value) {
    if (!$('#edit-summernote').summernote('isEmpty')) {
      let data = {
        'title': '',
        'content': $('#edit-summernote').summernote('code'),
        'id': value,
        'users': {
          'id': this.userId
        }
      };
      this.uniService.updateQA(data).subscribe(res => {
        for (let i = 0; i < this.anwsers.length; i++) {
          if (this.anwsers[i].id == value) {
            this.anwsers[i].content = $('#edit-summernote').summernote('code');
            this.anwsers[i].isEdit = false;
            $('#edit-summernote').summernote('code', '');
          }
        }
      }, (error) => {
        this.toastr.error("Không thể kết nối với máy chủ. Vui lòng kiểm tra lại", "Thất bại", { showCloseButton: true });
      });
    }
  }
  setVote(value) {
    if (value.userId != this.userId && !value.isVote && this.role != 2 && this.userId != 0) {
      let data = {
        'user': {
          'id': this.userId
        },
        'questionAnswer': {
          'id': value.id
        }
      };
      this.uniService.voteAnswer(data).subscribe(res => {
        value.isVote = true;
        value.vote = value.vote + 1;
      });
    }
  }

  setValueReport(data) {
    this.valueReport = data;
  }

  setReport() {
    if (this.valueReport.userId != this.userId && !this.valueReport.isReport && this.role != 2 && this.userId != 0) {
      let data = {
        'user': {
          'id': this.userId
        },
        'questionAnswer': {
          'id': this.valueReport.id
        }
      };
      this.uniService.reportAnswer(data).subscribe(res => {
        this.valueReport.isReport = true;
        this.valueReport.report = this.valueReport.report + 1;
      });
    }
  }
  deleteQA() {
    let data = {
      "id": this.selectIndex,
      "status": true,
      "isActive": false
    };
    this.uniService.changeStatusQA(data).subscribe(res => {
      if (this.selectIndex == this.qaId) {
        this.router.navigate(['/question'])
      } else {
        for (let i = 0; i < this.anwsers.length; i++) {
          if (this.anwsers[i].id == this.selectIndex) {
            this.anwsers.splice(i, 1);
            this.toastr.success("Đã xoá thành công", "Thành công", { showCloseButton: true });
            return;
          }
        }
      }
    }, (err) => {
      this.toastr.error("Không thể kết nối với máy chủ. Vui lòng kiểm tra lại", "Thất bại", { showCloseButton: true });
    })
  }
}
