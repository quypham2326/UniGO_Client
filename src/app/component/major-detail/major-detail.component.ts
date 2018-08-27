import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseService} from "../../service/base-service/base.service";
import {ReviewService} from "../../service/review/review.service";
import {ToastsManager} from "ng2-toastr";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../constants";
import * as $ from 'jquery';
import {UniversityService} from "../../service/university/university.service";

@Component({
  selector: 'app-major-detail',
  templateUrl: './major-detail.component.html',
  styleUrls: ['./major-detail.component.less']
})
export class MajorDetailComponent implements OnInit, OnDestroy {
  public majorUniversity: any;
  public university: any;
  public majorDetail = {
    id: '',
    majorName : '',
    blockYear1 : [],
    blockYear2 : [],
  };
  public id: any;
  public user;
  public sub: Subscription;
  public isCheck: boolean = false;
  public starsTeaching: number;
  public starCareer: number;
  public totalStar:number;
  public recommentPoint:number;
  public starPoint: any;
  public showStarsTeaching;
  public showStarCareer;
  public checkReviewUniMajor: boolean;
  public valueMajor;
  public checkFavoriteMajor: number = -1;
  public dataSaveFavorite: any;


  constructor(private baseService: BaseService, private reviewService: ReviewService, private router: Router,
              private toastr: ToastsManager, private activateRoute: ActivatedRoute, private constants: Constants,
              private universityService: UniversityService) { }

  ngOnInit() {
    $.getScript('../../../assets/file.js');
    this.sub = this.activateRoute.params.subscribe(params=>{
      this.id=params['id'];
    });

    this.majorUniversity = JSON.parse(localStorage.getItem("MAJOR_UNI"));
    if(!this.majorUniversity){
      this.router.navigate(['home']);
      return;
    }


    this.university =  JSON.parse(localStorage.getItem("UNI"));
    this.majorDetail.blockYear1 = [];
    this.majorDetail.blockYear2 = [];
    this.majorDetail.id = this.majorUniversity.id;
    this.majorDetail.majorName = this.majorUniversity.major.majorName;
    if(this.majorUniversity.blockMajorUniversities.length != 0){
      for(let i =0; i<this.majorUniversity.blockMajorUniversities.length;i++){
        for(let j =0; j<this.majorUniversity.blockMajorUniversities[i].scoreHistories.length;j++){
          if(this.majorUniversity.blockMajorUniversities[i].isActive){
            if(this.majorUniversity.blockMajorUniversities[i].scoreHistories[j].year == 2016){
              let year1 = {
                blockName: this.majorUniversity.blockMajorUniversities[i].block.blockName,
                score: this.majorUniversity.blockMajorUniversities[i].scoreHistories[j].score
              };
              this.majorDetail.blockYear1.push(year1);
            }else{
              let year2 = {
                blockName: this.majorUniversity.blockMajorUniversities[i].block.blockName,
                score: this.majorUniversity.blockMajorUniversities[i].scoreHistories[j].score
              };
              this.majorDetail.blockYear2.push(year2);
            }
          }
        }
      }
    }

    //List Major University

    this.universityService.getUniversityById(this.university.id).subscribe((university: any)=>{
      this.university = university;
      this.valueMajor = [];
      for (let i = 0; i < this.university.majorUniversities.length; i++) {
        if(this.university.majorUniversities[i].isActive){
          this.valueMajor.push(this.university.majorUniversities[i]);
        }
      }
    });

    //End List Major

    //check Review University Major
    this.user = this.baseService.getUser();

    if(this.user){
    let data = {
      "majorUniversity":
        {
          "id": this.majorUniversity.id
        },
      "users":
        {
          "id": this.user.id
        }
    };
      this.dataSaveFavorite = data;
    this.reviewService.checkFavorite(data).subscribe((res: any)=>{

        this.checkFavoriteMajor = res;

    });
    this.reviewService.checkReviewUniMajor(data).subscribe((res: any)=>{
      this.checkReviewUniMajor = res;
    });
    }
    this.reviewService.getStarReviewMajor(this.majorUniversity.id).subscribe((res:any)=>{
      if(res){
        this.starPoint = res;
        localStorage.setItem('STAR_POINT', JSON.stringify(res));
        this.totalStar = (res.starTeaching + res.starCareer)/2;
        this.recommentPoint = res.recommentPoint;
        this.showStarsTeaching = res.starTeaching;
        this.showStarCareer = res.starCareer;
      }
    },error=>{
      if(error.status == this.constants.NOT_FOUND){
        this.starPoint = null;
      }
    });

  }

  public onSubmit(form: NgForm){
      if(this.user.role.id == 1){
        if(form.valid && !this.isCheck){
      let data = {
        'majorUniversity': {
          'id': parseInt(this.majorUniversity.id)
        },
        'users': {
          'id': this.baseService.getUser().id
        },
        'starTeaching' : this.starsTeaching,

        'starCareer': this.starCareer,
        'isRecomment': parseInt(form.value.radio),
      };
      this.reviewService.saveMajorReview(data).subscribe((res:Response)=>{
        if(res){
          this.checkReviewUniMajor = true;
          this.toastr.success('Vui lòng chờ chúng tôi xem xét đánh giá của bạn', 'Thành công',{showCloseButton: true});
        }
      },(error=>{
        this.toastr.error('Trường học hoặc user này không tồn tại', 'Thất bại',{showCloseButton: true});
      }))
    }
  }else{
        this.toastr.warning('Vui lòng đăng nhập với vai trò người dùng', 'Thất bại',{showCloseButton: true});
      }

  }
  showDetail(value){
    this.baseService.setValueMajorUni(value);
    localStorage.setItem("MAJOR_UNI",JSON.stringify(value));
    //this.router.navigate(['/major-detail',value.major.id]);
  }
  saveFavorite(){
    this.reviewService.saveFavorite(this.dataSaveFavorite).subscribe((res: any)=>{
      if(res){
        this.checkFavoriteMajor = res;
        this.toastr.success('Đã thêm vào danh sách', 'Thành công',{showCloseButton: true});
      }
    },(error =>{
      this.toastr.error('Đã xảy ra lỗi vui lòng thử lại', 'Thất bại',{showCloseButton: true});
    }));
  }
  deleteFavorite(){
    let data = {
      'id': this.checkFavoriteMajor
    }
    this.reviewService.deleteFavorite(data).subscribe((res: any) => {
      if(res){
        this.checkFavoriteMajor = -1;
      }
    });
  }
  ngOnDestroy(){
  }

}
