import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {UniversityService} from "../../../service/university/university.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchService} from "../../../service/base-service/search.service";
import {ToastsManager} from "ng2-toastr";
import {NgForm} from "@angular/forms";
import {Constants} from "../../../constants";
import {MajorScore} from "../../../model/MajorScore";
import {Subscription} from "rxjs/Subscription";
import {BaseService} from "../../../service/base-service/base.service";
import * as _ from 'underscore';
declare var $: any;

@Component({
  selector: 'app-edit-score',
  templateUrl: './edit-score.component.html',
  styleUrls: ['./edit-score.component.less']
})
export class EditScoreComponent implements OnInit {
  // public majorUniversities: any;
  public options: Select2Options;
  public currentMajor: any = [];
  public listMajorBlock: any = [];
  private id: number;
  public sub: Subscription;
  public majorDetail: any;
  public listBlock: any;
  public valueBlock: number[] = [];
  public university: any;
  public selectIndex: number;
  constructor( private universityService: UniversityService,
               private activateRoute: ActivatedRoute,
               private searchService: SearchService,
               private baseService: BaseService,
               public toastr: ToastsManager,
               private constant: Constants,
               private router: Router,
               vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    $('#summernote').summernote({
      height: 150,
      toolbar: [
        ['style', ['bold', 'italic', 'underline']],
        ['fontsize', ['fontsize','color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['fullscreen',['fullscreen']]
      ]
    });
    this.universityService.broadcastTextChange("CHỈNH SỬA THÔNG TIN NGÀNH");
    this.sub = this.activateRoute.params.subscribe(params=>{
      this.id = params['id'];
    });
    this.majorDetail = this.baseService.getMajorUni();
    if(this.majorDetail){
      localStorage.setItem('MAJOR_DETAIL',JSON.stringify(this.majorDetail));
      $('#summernote').summernote('code', this.majorDetail.description);
    }else{
      this.majorDetail = JSON.parse(localStorage.getItem('MAJOR_DETAIL'));
      $('#summernote').summernote('code', this.majorDetail.description);
    }
    this.valueBlock = [];
    if(this.majorDetail.blockMajorUniversities.length != 0){
      this.majorDetail.blockMajorUniversities.forEach(x=>{
        if(x.isActive){
          this.currentMajor.push(new MajorScore(x));
          this.valueBlock.push(x.block.blockName);
        }
      })
    }
    this.searchService.getBlock().subscribe((value: any) => {
        this.listBlock = value;
      });
    this.options = {
      multiple: true,
      width: '100px'
    }
  }

  getValueMajor(data){
    if(data.value){
        data.value.forEach(y=>{
          if(!_.contains(this.valueBlock, y) && !_.contains(this.listMajorBlock, y)){
            this.listMajorBlock.push(y);
          }
        });
    }
    console.log(this.listMajorBlock);
  }

  onSaveScore(form:NgForm,blockName){
    console.log(form.value);
    let data = {
      "majorUniId": this.id,
      "blockName": blockName,
      "majorScore": [
        {
          "score": form.value.A2016,
          "year": 2016
        }, {
          "score": form.value.A2017,
          "year": 2017
        }
      ]
    };
    this.universityService.updateScore(data).subscribe((res:any)=>{
      if(res){
        this.toastr.success("Đã cập nhật điểm",'Thành công',{showCloseButton: true});
      }
    },(error)=>{
      this.toastr.error('Vui lòng kiểm tra lại kết nối mạng', 'Thất bại',{showCloseButton: true});
    });
  }

  onSaveMajorUni(form: NgForm){
    console.log(form.value);
    if(form.valid){
      let data = {
        'id': this.id,
        'numberOfYear': form.value.numberOfYear,
        'requirement': form.value.requirement,
        'prospects': form.value.prospects,
        'description': $('#summernote').summernote('code')
      };
      this.universityService.saveMajorUniDetail(data).subscribe(res=>{
        if(res){
          this.toastr.success('Bạn đã chỉnh sửa thông tin ngành', 'Thành công!',{showCloseButton: true});
        }
      },err=>{
        if(err.status == this.constant.CONFLICT){
          this.toastr.error('Trường đại học không tồn tại ngành này. Vui lòng thử lại', 'Thất bại',{showCloseButton: true});
        }else{
          this.toastr.error('Vui lòng kiểm tra lại kết nối mạng', 'Thất bại',{showCloseButton: true});
        }
      });
    }
  }


  deleteBlockScore(){
    let data = {
      'id': this.selectIndex
    };
    this.universityService.deleteBlockMajorUni(data).subscribe(res=>{
      if(res){
        for(let i = 0; i< this.currentMajor.length;i++){
          if(this.selectIndex == this.currentMajor[i].id){
            this.currentMajor.splice(i,1);
            this.toastr.success('Bạn đã xóa thành công', 'Thành công!',{showCloseButton: true});
            return;
          }
        }
      }
    },err=>{
      this.toastr.error('Vui lòng kiểm tra lại kết nối mạng', 'Thất bại',{showCloseButton: true});
    });
  }
}
