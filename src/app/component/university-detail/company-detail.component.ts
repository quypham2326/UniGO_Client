
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute } from "@angular/router";
import { UniversityService } from "../../service/university/university.service";
import { ReviewService } from "../../service/review/review.service";
import { BaseService } from "../../service/base-service/base.service";
import { Constants } from "../../constants";
declare var window: any;
declare var google: any;
@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',

  styleUrls: ['./company-detail.component.less']
})

export class CompanyDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  public id: number;
  public user;
  public checkReviewUni: boolean;
  public sub: Subscription;
  public university: any;
  public des: any;
  public valueMajor: any;
  public totalStar: number;
  public recommentPoint: number;
  public starPoint: any;
  public topCorrlateUni: any;
  public listArticle;
  public majorDetail = {
    majorName: '',
    blockYear1: [],
    blockYear2: [],
  };

  public currentUrl;
  constructor(private activateRoute: ActivatedRoute,
    private universityService: UniversityService,
    private reviewService: ReviewService,
    private constant: Constants,
    private baseService: BaseService) {
  }

  ngOnInit() {
    document.documentElement.scrollTop = 0;
    localStorage.removeItem("MAJOR_UNI");
    $.getScript('../../../assets/file.js');
    $(window).scroll(function () {
      const height = $(window).scrollTop();
      const isFollowed = false;
      if (height > 350 && !isFollowed) {
        $('#company-fixed-box').fadeIn('normal');
      } else {
        $('#company-fixed-box').fadeOut('normal');
      }
    });
    this.sub = this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.currentUrl = this.constant.HTTP + this.constant.SERVER_IP + this.constant.CLIENT_PORT + '/university/' + this.id;
    this.universityService.getUniversityById(this.id).subscribe((university: any) => {
      this.university = university;
      this.baseService.setUniversity(university);
      localStorage.setItem("UNI", JSON.stringify(university));
      this.des = university.description;
      this.valueMajor = [];
      for (let i = 0; i < this.university.majorUniversities.length; i++) {
        if (this.university.majorUniversities[i].isActive) {
          this.valueMajor.push(this.university.majorUniversities[i]);
        }
      }
      console.log(this.valueMajor);
    });
    this.reviewService.getStarPoint(this.id).subscribe((res: any) => {
      if (res) {
        this.starPoint = res;
        localStorage.setItem('STAR_POINT', JSON.stringify(res));
        this.totalStar = (res.starCare + res.starTeaching + res.starSocieties +
          res.starFacilities + res.starCareer) / 5;
        this.recommentPoint = res.recommentPoint;
      }
    }, error => {
      if (error.status == this.constant.NOT_FOUND) {
        this.starPoint = null;
      }
    });
    this.getNewestArticle(this.id);

    //Check review
    this.checkIsReview();
    // var uluru = {lat: 10.8048138, lng: 106.6257448};
    // var map = new google.maps.Map(document.getElementById('map'), {
    //   zoom: 10,
    //   center: uluru
    // });
    // var marker = new google.maps.Marker({
    //   position: uluru,
    //   map: map
    // });
  }
  checkIsReview() {
    let data = {
      "university":
      {
        "id": this.id
      }
    };
    this.reviewService.checkReviewUni(data).subscribe((res: any) => {
      this.checkReviewUni = res;
    })
    //Top Corrlate University
    this.universityService.topCorrlateUni(this.id).subscribe((res: any) => {
      this.topCorrlateUni = res;
    })
  }
  
  ngAfterViewInit() {

  }

  showDetail(value) {
    this.baseService.setValueMajorUni(value);
    localStorage.setItem("MAJOR_UNI", JSON.stringify(value));
    // if(value.blockMajorUniversities.length == 0){
    //   // document.getElementById('openNotDetail').click();
    // }else{
    //   this.majorDetail.blockYear1 = [];
    //   this.majorDetail.blockYear2 = [];
    //   this.majorDetail.majorName = value.major.majorName;
    //   for(let i =0; i<value.blockMajorUniversities.length;i++){
    //     for(let j =0; j<value.blockMajorUniversities[i].scoreHistories.length;j++){
    //       if(value.blockMajorUniversities[i].scoreHistories[j].year == 2016){
    //         let year1 = {
    //           blockName: value.blockMajorUniversities[i].block.blockName,
    //           score: value.blockMajorUniversities[i].scoreHistories[j].score
    //         };
    //         this.majorDetail.blockYear1.push(year1);
    //       }else{
    //         let year2 = {
    //           blockName: value.blockMajorUniversities[i].block.blockName,
    //           score: value.blockMajorUniversities[i].scoreHistories[j].score
    //         };
    //         this.majorDetail.blockYear2.push(year2);
    //       }
    //     }
    //   }
    //   //document.getElementById('openMajorDetail').click();
    // }
  }

  public getNewestArticle(data) {
    this.reviewService.getNewestArticle(data).subscribe((res: any) => {
      this.listArticle = res;
    })
  }

  ngOnDestroy() {
  }
}
