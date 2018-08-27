import { Component, OnInit } from '@angular/core';
import {BaseService} from "../../service/base-service/base.service";
import {ReviewService} from "../../service/review/review.service";

@Component({
  selector: 'app-user-favorite',
  templateUrl: './user-favorite.component.html',
  styleUrls: ['./user-favorite.component.less']
})
export class UserFavoriteComponent implements OnInit {
  public user;
  public yourFavorite;
  public selectIndex: number;
  constructor(private baseService: BaseService, private reviewService: ReviewService) { }

  ngOnInit() {
    this.user = this.baseService.getUser();
    this.getYourFavorite()
  }
  getYourFavorite(){
    this.reviewService.getYourFavorite(this.user.id).subscribe((res: any)=> {
      this.yourFavorite = res;
      console.log(res);
    });
  }
  deleteFavorite(){
    let data = {
      'id': this.selectIndex
    }
    this.reviewService.deleteFavorite(data).subscribe((res: any)=>{
      if(res){
        for(let i = 0; i < this.yourFavorite.length; i++){
          if(this.yourFavorite[i].id == this.selectIndex){
            this.yourFavorite.splice(i,1);
            return;
          }
        }
      }
    })
  }
}
