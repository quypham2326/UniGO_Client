import {Component, OnInit} from '@angular/core';
import {ReviewService} from "../../service/review/review.service";
import {BaseService} from "../../service/base-service/base.service";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.less']
})
export class ArticleComponent implements OnInit {
  public listArticle;
  public user;
  constructor(private reviewService: ReviewService, private baseService: BaseService) {
  }

  ngOnInit() {
    this.user = this.baseService.getUser();
    // console.log(this.user.id);
    this.reviewService.getArticle().subscribe((res: any) => {
      this.listArticle = res;
      // console.log(this.listArticle)
    })
  }

  getListArticle(){
    this.reviewService.getArticle().subscribe((res: any)=>{
      this.listArticle = res;
    });
  }
  getYourArticle() {
    if(this.user){
    this.reviewService.getYourArticle(this.user.id).subscribe((res: any) => {
      this.listArticle = res;
    });
    }
  }

}
