import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {UniversityService} from "../../../service/university/university.service";
import {ToastsManager} from "ng2-toastr";
import {ReviewService} from "../../../service/review/review.service";

@Component({
  selector: 'app-list-report',
  templateUrl: './list-report.component.html',
  styleUrls: ['./list-report.component.less']
})
export class ListReportComponent implements OnInit {
    public listReport;
    public selectIndex: number;
    public reportContent;
    public reportUsePost;
  constructor(private universityService: UniversityService, private toastr: ToastsManager, private vcr: ViewContainerRef, private reviewService: ReviewService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.universityService.broadcastTextChange("Báo Cáo");
    this.getAllReport();

  }

  getAllReport(){
    this.universityService.getAllReport().subscribe((res: any)=> {
      this.listReport = res;
      console.log(this.listReport);
    })
  }

  deleteReport(){
    let data = {
      "id": this.selectIndex,
      "status": false,
      "isActive": false
    }
    this.universityService.deleteReport(data).subscribe((res: any)=>{
    if(res){
      for(let i = 0;i < this.listReport.length; i++){
        if(this.listReport[i].id == this.selectIndex){
          this.listReport.splice(i,1);
          this.toastr.success("Đã xoá thành công","Thành công",{showCloseButton: true});
          this.reviewService.numberReportChange(-1);
          return ;
        }
      }
    }
    },error => {
      this.toastr.error("Vui lòng kiểm tra lại", "Thất bại",{showCloseButton: true})
    });
  }

  notDeleteReport(){
    let data = {
      "id": this.selectIndex,
      "status": true,
      "isActive": true
    }
    this.universityService.deleteReport(data).subscribe((res: any)=> {
      if(res){
        for(let i = 0; i < this.listReport.length; i++){
          if(this.listReport[i].id == this.selectIndex){
            this.listReport.splice(i,1);
            this.toastr.success("Giữ lại bài này","Thành công",{showCloseButton: true});
            this.reviewService.numberReportChange(-1);
            return ;
          }
        }
      }
    }, error => {
      this.toastr.error("Vui lòng kiểm tra lại", "Thất bại",{showCloseButton: true})
    });
  }

  selectReport(){
    for(let i = 0; i < this.listReport.length; i++){
      if(this.listReport[i].id == this.selectIndex){
        this.reportContent = this.listReport[i].content;
        this.reportUsePost = this.listReport[i].users.username;
      }
    }
  }
}
