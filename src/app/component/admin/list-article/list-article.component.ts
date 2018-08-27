import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {UniversityService} from "../../../service/university/university.service";
import {ReviewService} from "../../../service/review/review.service";
import {ToastsManager} from "ng2-toastr";

@Component({
  selector: 'app-list-article',
  templateUrl: './list-article.component.html',
  styleUrls: ['./list-article.component.less']
})
export class ListArticleComponent implements OnInit {
  public listArticle;
  public selectIndex: number;
  constructor(private uniService: UniversityService, private reviewService: ReviewService, private toastr: ToastsManager, private vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr)
  }

  ngOnInit() {
    this.uniService.broadcastTextChange("Danh Sách Bài Báo");
    this.getListNews();
  }

  getListNews(){
    this.reviewService.getArticle().subscribe((res: any)=>{
      this.listArticle = res;
    });
  }

  deleteNews(){
    let deteleArticle = {
      "id": this.selectIndex
    };
    this.reviewService.deleteArticle(deteleArticle).subscribe((res: any)=>{
      if (res){
        for(let i =0 ; i <= this.listArticle.length; i++){
          if(this.listArticle[i].id == this.selectIndex){
            this.listArticle.splice(i,1);
            this.toastr.success("Đã xoá thành công","Thành công",{showCloseButton: true});
            return ;
          }
        }
      }
    }, error =>{
      this.toastr.error("Vui lòng kiểm tra lại", "Thất bại",{showCloseButton: true})
    });
  }
}
