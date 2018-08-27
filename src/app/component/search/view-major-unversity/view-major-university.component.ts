import { Component, OnInit, OnDestroy } from '@angular/core';
import {SearchService} from "../../../service/base-service/search.service";
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-view-major-unversity',
  templateUrl: './view-major-university.component.html',
  styleUrls: ['./view-major-university.component.less']
})
export class ViewMajorUnversityComponent implements OnInit {
  public id: number;
  public sub: Subscription;
  public searchMajor: any[];
  public majorName: string;
  public majorImg: string;
  constructor(private searchService: SearchService, private activateRoute: ActivatedRoute) {
  }

  ngOnInit() {
    document.documentElement.scrollTop = 0;
    this.sub = this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
    });

    if(this.id==1){

      this.majorName = "Kinh Doang & Quản Lý";
      this.majorImg = "../assets/image/TopMajor/QTKD.jpeg";
    }else if(this.id==2){
      this.majorName = "Công Nghệ Thông Tin";
      this.majorImg = "../assets/image/TopMajor/CNTT.jpg";
    }else if(this.id==3){
      this.majorName = "Y Tế Và Sức Khỏe";
      this.majorImg = "../assets/image/TopMajor/YD.jpg";
    }else if(this.id==4){
      this.majorName = "Giáo Dục & Đào Tạo";
      this.majorImg = "../assets/image/TopMajor/TCNH.jpg";
    }else {
      console.log(this.id);
      this.majorName = "Kiến Trúc Xây Dựng";
      this.majorImg = "../assets/image/TopMajor/ANQP.jpg";
    }

      this.searchMajor = [];
      this.searchService.getMajorByID(this.id).subscribe((response: any)=>{
        this.searchMajor = response;
        console.log(response);
      });
  }
}
