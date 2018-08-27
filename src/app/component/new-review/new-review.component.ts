import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../model/User";
import {BaseService} from "../../service/base-service/base.service";
import {ReviewService} from "../../service/review/review.service";
import {ToastsManager} from "ng2-toastr";
import {University} from "../../model/University";
declare var $: any;

@Component({
  selector: 'app-new-review',
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.less']
})
export class NewReviewComponent implements OnInit {
  public sub: Subscription;
  private id: any;
  public isCheck: boolean = false;
  private user : User;
  public university: University;
  public starsTeaching: number;
  public starsFacilities: number;
  public starCare: number;
  public starSocieties: number;
  public starCareer: number;
  constructor(private activateRoute: ActivatedRoute, private baseService: BaseService, private router: Router,
              private reviewService : ReviewService, public toastr: ToastsManager) {

  }

  ngOnInit() {
    let seft = this;
    this.university = this.baseService.getUniversity();
    this.sub = this.activateRoute.params.subscribe(params=>{
      this.id=params['id'];
    });
    this.user = this.baseService.getUser();
    $('#summernote').summernote({
      height: 150,
      toolbar: false,
      placeholder: 'Nhập đánh giá của bạn...',
      callbacks: {
        onKeydown: function (e) {
          var t = e.currentTarget.innerText;
          if (t.length >= 400) {
            //delete key
            if (e.keyCode != 8){
              e.preventDefault();
            }
          }
        },
        onKeyup: function (e) {
          var t = e.currentTarget.innerText;
          $('#maxContentPost').text(400 - t.length);
          if(t.length >= 100){
            seft.isCheck = false;
          }
        },
        onPaste: function (e) {
          var t = e.currentTarget.innerText;
          var bufferText = ((e.originalEvent || e).clipboardData).getData('Text');
          e.preventDefault();
          var all = t + bufferText;
          document.execCommand('insertText', false, all.substring(0, 400));
          $('#maxContentPost').text(400 - t.length);
        }
      }
    });
  }

  public onSubmit(form: NgForm){
    if($('#summernote').summernote('code').length < 100 || $('#summernote').summernote('code').length > 400){
      this.isCheck = true;
    }else{
      this.isCheck = false;
    }
    if(form.valid && !this.isCheck){
      let data = {
        'university': {
          'id': parseInt(this.id) //universityId
        },
        //WARNING
        'users':{
          'id': 1
        },
        'title': form.value.title,
        'description': $('#summernote').summernote('code'),
        'starTeaching' : this.starsTeaching,
        'starFacilities': this.starsFacilities,
        'starCare': this.starCare,
        'starSocieties': this.starSocieties,
        'starCareer': this.starCareer,
        'isRecomment': parseInt(form.value.radio),
        'status': false
      };
      let seft = this;
      this.reviewService.saveReview(data).subscribe((res:Response)=>{
        if(res){
          this.toastr.success('Vui lòng chờ chúng tôi xem xét đánh giá của bạn', 'Thành công',{showCloseButton: true});
          setTimeout(function () {
            seft.router.navigate(['/university/' + seft.id]);
          }, 1000);
        }
      },(error=>{
        this.toastr.error('Trường học hoặc user này không tồn tại', 'Thất bại',{showCloseButton: true});
      }))
    }
  }
}
