import { Component, OnInit } from '@angular/core';
import {ToastsManager} from "ng2-toastr";
import {Constants} from "../../../constants";
import {ActivatedRoute} from "@angular/router";
import {UniversityService} from "../../../service/university/university.service";
import {BaseService} from "../../../service/base-service/base.service";

@Component({
  selector: 'app-edit-major',
  templateUrl: './edit-major.component.html',
  styleUrls: ['./edit-major.component.less']
})
export class EditMajorComponent implements OnInit {
  public majorUniversities: any = [];
  constructor(private universityService: UniversityService,
              private baseService: BaseService,
              private activateRoute: ActivatedRoute,
              private constant : Constants,
              public toastr: ToastsManager) { }

  ngOnInit() {
    this.universityService.broadcastTextChange("DANH SÁCH NGÀNH");
    this.activateRoute.params
      .map((params: any) => params['id'])
      .switchMap((paramsID: string) => this.universityService.getUniversityById(paramsID))
      .subscribe(
        (university: any) => {
          university.majorUniversities.forEach(x=>{
            if(x.isActive){
              this.majorUniversities.push(x);
            }
          });
        }, (err) => {
          this.toastr.error('Vui lòng kiểm tra lại kết nối mạng', 'Thất bại',{showCloseButton: true});
        });
  }
  setMajorUni(value){
    this.baseService.setMajorUni(value);
  }
}
