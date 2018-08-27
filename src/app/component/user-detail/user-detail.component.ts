import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { User } from "../../model/User";
import { BaseService } from "../../service/base-service/base.service";
import { RequestOptions, Headers } from "@angular/http";
import { UniversityService } from "../../service/university/university.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.less']
})
export class UserDetailComponent implements OnInit {
  public user: User;
  public imageSrc;
  public isLoadImage: boolean = false;
  constructor(private baseService: BaseService, private uniService: UniversityService) { }

  ngOnInit() {
    this.user = this.baseService.getUser();
    this.imageSrc = this.user.image;
  }
  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    this.isLoadImage = true;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file)
  }

  _handleReaderLoaded(e) {
    var reader = e.target;
    let url = "https://api.imgur.com/3/image";
    var headers = new Headers();
    headers.append('Authorization', 'Client-ID bf915d4106b6639');
    let options = new RequestOptions({ headers: headers });
    let data = {
      'image': reader.result.split(',')[1]
    };
    this.uniService.uploadFile(url, data, options).subscribe((response: any) => {
      this.imageSrc = response.data.link;
      this.isLoadImage = false;
    });
  }

  onSubmit(form: NgForm) {

  }
}
