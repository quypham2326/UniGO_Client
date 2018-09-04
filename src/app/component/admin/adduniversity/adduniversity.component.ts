import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Select2OptionData} from "ng2-select2";
import {SearchService} from "../../../service/base-service/search.service";
import {Constants} from "../../../constants";
import {Observable} from "rxjs/Observable";
import {NgForm} from "@angular/forms";
import {BaseService} from "../../../service/base-service/base.service";
import {UniversityService} from "../../../service/university/university.service";
import {ToastsManager} from "ng2-toastr";
import {Router} from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-adduniversity',
  templateUrl: './adduniversity.component.html',
  styleUrls: ['./adduniversity.component.less'],
})
export class AdduniversityComponent implements OnInit {
  public options: Select2Options;
  public value: string[] = [];
  public currentLocation: string;
  public currentMajor: any = [];
  public listMajor:any = [];//Observable<Select2OptionData[]>;
  public listMajorArray: any = [];
  public listLocation: Observable<Select2OptionData[]>;
  //Angular 2 MultiSelect Dropdown
  public selectedItems: any = {
    "selectedCode": [],
          "selectedName": [],
          "selectedTrain": [],
          "selectedEmail": [],
          "selectedPhone": [],
          "selectedMajor": [],
          "selectedLocation": [],
          "selectedPriority": []
  }
  public settingsList: any = {
    "locationSettings": {
      singleSelection: true, 
      text:"Chọn Khu Vực",
      enableSearchFilter: true,
    },
    "majorSettings": {
      singleSelection: false, 
      text:"Chọn Ngành Học",
      enableSearchFilter: true,
    },
    "trainSettings": {
      singleSelection: true, 
      text:"Chọn Loại Hình Đào Tạo",
      enableSearchFilter: false,
    }
  }
  dropDownList: any = {
    "optionsTrain": [],
    "listMajor": [],
    "listLocation": [],
  };
  constructor(private searchService: SearchService,private uniService: UniversityService,  private router: Router,
              private constant: Constants, private baseService: BaseService,public toastr: ToastsManager, vcr: ViewContainerRef) {
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
    this.uniService.broadcastTextChange("THÊM TRƯỜNG MỚI");
    this.searchService.getMajor(this.constant.MAJOR)
      .subscribe((value: any)=>{
        this.listMajor = value;
        this.listMajorArray = this.listMajor.map((item) =>{
          return item.itemName
        })
      });
    this.listLocation = this.searchService.getLocation(this.constant.LOCATION);
    this.options = {
      multiple: true
    };
    this.uniService.getMajor().subscribe((response: any) => {
      this.dropDownList.listMajor = response.map(e => ({
        id: e.id,
        itemName: e.majorName,
      }));
    });
    this.searchService.getLocation1().subscribe((response: any) => {
      this.dropDownList.listLocation = response.map(e => ({
        id: e.id,
        itemName: e.locationName,
      }));
    });
    this.uniService.getTrainSystem().subscribe((response: any) => {
      this.dropDownList.optionsTrain = response.map(e => ({
        id: e.id,
        itemName: e.name        
      }))
    })
  }

  getValueMajor(data) {
    this.currentMajor = data;
  }
  getValueLocation(data){
    this.currentLocation = data.value;
  }
  onSave(form: NgForm){
    if(this.currentMajor.value){
      for(var i = 0; i < this.currentMajor.value.length; i++){
        this.currentMajor.value[i] = parseInt(this.currentMajor.value[i]);
      }
    }
    let data = {
      'code': form.value.code,
      'name': form.value.name,
      'email': form.value.email,
      'phone': form.value.phone,
      'logo': this.baseService.getLogoUni(),
      'image': this.baseService.getImgUni(),
      'description':  $('#summernote').summernote('code'),
      'priority': form.value.pri? form.value.pri : 0,
      'trainSystem':{
        'id': form.value.train
      }
    };
    let seft = this;
    this.uniService.createUniversity(this.constant.CREATE_UNIVESITY,data).subscribe((response:any)=>{
      if(response){
        if(this.currentLocation || this.currentMajor.value){
          this.updateLocationMajor(response);
        }else{
          this.toastr.success('Bạn đã tạo mới thành công', 'Thành công!',{showCloseButton: true});
          setTimeout(function () {
            seft.router.navigate(['/admin/list-university'])
          }, 1000);
        }
      }
    },error=>{
      if(error.status==this.constant.CONFLICT){
        this.toastr.error('Trường đại học này đã tồn tại. Vui lòng thử lại', 'Thất bại',{showCloseButton: true});
      }else{
        this.toastr.error('Vui lòng kiểm tra lại kết nối mạng', 'Thất bại',{showCloseButton: true});
      };
    });
  }

  updateLocationMajor(response){
    let dataLocation = {
      'location': {
        'id': this.currentLocation? parseInt(this.currentLocation) : null,
      },
      'majorId': this.currentMajor.value,
      'university':{
        'id': response.id ? response.id : null
      }
    };
    let seft = this;
    this.uniService.updateLocationMajor(this.constant.UPDATE_LOCATION_MAJOR,dataLocation).subscribe((res:any)=>{
      if(res){
        this.toastr.success('Bạn đã tạo mới thành công', 'Thành công!',{showCloseButton: true});
        setTimeout(function () {
          seft.router.navigate(['/admin/list-university'])
        }, 1000);
      }
    },error=>{
      if(error.status==this.constant.NOT_FOUND){
        this.toastr.error('locate Trường đại học này không tồn tại. Vui lòng thử lại', 'Thất bại',{showCloseButton: true});
      }else{
        this.toastr.error('locate Vui lòng kiểm tra lại kết nối mạng', 'Thất bại',{showCloseButton: true});
      };
    });
  }
}
