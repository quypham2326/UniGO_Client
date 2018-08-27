import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ReviewService} from "../../../service/review/review.service";
import {UniversityService} from "../../../service/university/university.service";
import {ToastsManager} from "ng2-toastr";
declare var $: any;

@Component({
  selector: 'app-approve-reivew',
  templateUrl: './approve-reivew.component.html',
  styleUrls: ['./approve-reivew.component.less']
})
export class ApproveReivewComponent implements OnInit {
  public listReview: any[];
  public review;
  private currentId: number;
  constructor(private reviewService: ReviewService,
              private universityService: UniversityService,
              public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr)
  }

  ngOnInit() {
    this.universityService.broadcastTextChange("DANH SÁCH ĐÁNH GIÁ");
      this.reviewService.getReivewNeedApprove().subscribe(res=>{
        if(res){
          this.listReview = res;
          console.log(this.listReview);
        }
      });
  }

  viewDetail(value){
    this.currentId = value;
    this.listReview.forEach(x=>{
      if(x.id == value){
        console.log(x);
        this.review = x;
      }
    });
  }

  approveReview(){
    let data={
      'id': this.currentId,
      'status': true,
      'isActive': true
    };
    this.reviewService.changeReviewStatus(data).subscribe(res=>{
      if(res){
        for (let i = 0; i < this.listReview.length; i++) {
          if (this.currentId == this.listReview[i].id) {
            this.listReview.splice(i, 1);
            this.toastr.success('Đánh giá này đã được chấp nhận', 'Thành công', {showCloseButton: true});
            this.reviewService.numberReviewChange(-1);
            return;
          }
        }
      }
    },err=>{
      this.toastr.error('Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại', 'Thất bại',{showCloseButton: true})
    });
  }

  notApproveReview(){
    let data={
      'id': this.currentId,
      'status': false,
      'isActive': false
    };
    this.reviewService.changeReviewStatus(data).subscribe(res=>{
      if(res){
        for (let i = 0; i < this.listReview.length; i++) {
          if (this.currentId == this.listReview[i].id) {
            this.listReview.splice(i, 1);
            this.toastr.warning('Đánh giá này không được chấp nhận', 'Thông báo', {showCloseButton: true});
            this.reviewService.numberReviewChange(-1);
            return;
          }
        }
      }
    },err=>{
      this.toastr.error('Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại', 'Thất bại',{showCloseButton: true})
    });
  }
}
