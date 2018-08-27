import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute } from "@angular/router";
import { BaseService } from "../../service/base-service/base.service";
import { ReviewService } from "../../service/review/review.service";

@Component({
  selector: 'app-review-rating',
  templateUrl: './review-rating.component.html',
  styleUrls: ['./review-rating.component.less']
})
export class ReviewRatingComponent implements OnInit {
  public sub: Subscription;
  public starsFacilities;
  public starsTeaching;
  public starCare;
  public starSocieties;
  public starCareer;
  public starPoint;
  public totalReview;
  public recommentPoint;
  public totalStar;
  public id;
  public university;
  public review: any[];
  public user;
  public checkReviewUni: boolean;
  constructor(private activateRoute: ActivatedRoute,
    private baseService: BaseService, private reviewService: ReviewService) { }

  ngOnInit() {
    document.documentElement.scrollTop = 0;
    this.sub = this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    //this.university = this.baseService.getUniversity();
    this.university = JSON.parse(localStorage.getItem('UNI'));
    $.getScript('../../../assets/file.js');
    this.starPoint = JSON.parse(localStorage.getItem('STAR_POINT'));
    this.starsFacilities = this.starPoint.starFacilities;
    this.starsTeaching = this.starPoint.starTeaching;
    this.starCare = this.starPoint.starCare;
    this.starSocieties = this.starPoint.starSocieties;
    this.starCareer = this.starPoint.starCareer;
    this.totalReview = this.starPoint.totalReview;
    this.recommentPoint = this.starPoint.recommentPoint;
    this.totalStar = (this.starsFacilities + this.starsTeaching + this.starCare +
      this.starSocieties + this.starCareer) / 5;

    this.reviewService.getAllReviewByUniId(this.id).subscribe(res => {
      if (res) {
        console.log(res);
        this.review = res;
        console.log(this.review);
      }
    });
    //Check review
    this.user = this.baseService.getUser();

    let data = {
      "university":
      {
        "id": this.id
      }
    };
    this.reviewService.checkReviewUni(data).subscribe((res: any) => {
      this.checkReviewUni = res;
    })
  }
}
