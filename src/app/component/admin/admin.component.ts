import {Component, Input, OnInit} from '@angular/core';
import {ViewEncapsulation} from "@angular/core";
import {Router} from "@angular/router";
import {BaseService} from "../../service/base-service/base.service";
import {UniversityService} from "../../service/university/university.service";
import {ReviewService} from "../../service/review/review.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./custom.css','./admin.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminComponent implements OnInit {
   title: string;
   public numberOfReview: number;
   public numberOfQuestion: number;
   public numberOfReport: number;
  constructor(private router: Router, private baseService: BaseService,
              private uniService: UniversityService, private reviewService: ReviewService) { }
 public user;
  ngOnInit() {
    this.user = this.baseService.getUser();
    this.router.navigate(['admin/list-university']);
    this.uniService.title.subscribe(value=>{
      this.title = value;
    });
    this.reviewService.numberOfReviewNeedApprove().subscribe(res=>{
      this.numberOfReview = res;
    });
    this.reviewService.numberOfReview.subscribe(value=>{
      this.numberOfReview = this.numberOfReview + value ;
    })


    this.reviewService.numberOfQuestionNeedApprove().subscribe(res=>{
      this.numberOfQuestion = res;
    });
    this.reviewService.numberOfQuestion.subscribe(value=>{
      this.numberOfQuestion = this.numberOfQuestion + value ;
    });

    this.reviewService.numberOfReportNeedApprove().subscribe(res=>{
      this.numberOfReport = res;
    });
    this.reviewService.numberOfReport.subscribe(value=>{
      this.numberOfReport = this.numberOfReport + value ;
    });
  }
}
