import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute, Router} from "@angular/router";
import {UniversityService} from "../../../service/university/university.service";
import {ToastsManager} from "ng2-toastr";
import {SearchService} from "../../../service/base-service/search.service";
import {Observable} from "rxjs/Observable";
import {Select2OptionData} from "ng2-select2";
import {RequestOptions, Headers} from "@angular/http";
import 'rxjs/add/operator/switchMap';
import * as _ from 'underscore';
import {BaseService} from "../../../service/base-service/base.service";
import {NgForm} from "@angular/forms";
import {Constants} from "../../../constants";
declare var $: any;
@Component({
  selector: 'app-edit-university',
  templateUrl: './edit-university.component.html',
  styleUrls: ['./edit-university.component.less']
})
export class EditUniversityComponent implements OnInit {
  public id: number;
  public valueLocation: string;
  public currentMajor: any = [];
  public options: Select2Options;
  public listMajor: Array<Select2OptionData>;
  public listMajorArray: any = [];
  public listLocation: Observable<Select2OptionData[]>;
  public sub: Subscription;
  public university: any;
  public logoSrc: any = '';
  public imageSrc: any = '';
  public valueMajor: any = [];
  //public newValueMajor: [];
  public isLoadLogo: boolean = false;
  public isLoadImage: boolean = false;
  //Angular 2 MultiSelect Dropdown
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
  public selectedItems: any = {}
  dropDownList: any = {
    "optionsTrain": [],
    "listMajor": [],
    "listLocation": [],
  };
  
  
  constructor(private activateRoute: ActivatedRoute,
              private universityService: UniversityService,
              private baseService: BaseService,
              private constant: Constants,
              public toastr: ToastsManager,
              vcr: ViewContainerRef,
              private router: Router,
              private searchService: SearchService) {
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
    this.universityService.broadcastTextChange("CHỈNH SỬA THÔNG TIN TRƯỜNG");
    this.sub = this.activateRoute.params.subscribe(params=>{
      this.id = params['id'];
    });
    this.listLocation = this.searchService.getLocation(this.constant.LOCATION);
    // console.log(this.listLocation)
   this.getUniversity();
    // this.options = {
    //   multiple: true
    // }
    //Angular 2 MultiSelect Dropdown
    this.universityService.getMajor().subscribe((response: any) => {
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
    this.universityService.getTrainSystem().subscribe((response: any) => {
      this.dropDownList.optionsTrain = response.map(e => ({
        id: e.id,
        itemName: e.name        
      }))
    })
  }

  getUniversity(){
    this.universityService.getUniversityById(this.id).subscribe(
      (university: any) => {
        this.university = university;
        let arrayMajorName = university.majorUniversities.map(item=>({
          id: item.major.id,
          itemName: item.major.majorName
        }))
        this.selectedItems = {
          "selectedCode": [university.code],
          "selectedName": [university.name],
          "selectedTrain": [{id:university.trainSystem.id ,itemName: university.trainSystem.name}],
          "selectedEmail": [university.email],
          "selectedPhone": [],
          "selectedMajor": arrayMajorName,
          "selectedLocation": [{id: university.location.id, itemName: university.location.locationName}],
          "selectedPriority": [university.priority]
        };
        //console.log(this.university.trainSystem.name)
        $('#summernote').summernote('code', this.university.description);
        this.logoSrc = university.logo;
        this.imageSrc = university.image;
        this.searchService.getMajor(this.constant.MAJOR)
          .subscribe((value: any) => {
              this.listMajor = value;
            }, (err) => console.log(err),
            () => {
              this.valueMajor = [];
              for (let i = 0; i < this.university.majorUniversities.length; i++) {
                if(this.university.majorUniversities[i].isActive){
                  this.valueMajor.push(this.university.majorUniversities[i].major.id);
                }
              }
            });
      }, (err) => {
        this.toastr.error('Vui lòng kiểm tra lại kết nối mạng', 'Thất bại',{showCloseButton: true});
      });
  }

  getValueLocation(data) {
    console.log(data);
    this.valueLocation = data.value;
  }
  getValueMajor(data){
    this.currentMajor = data.value;
  }

  onEdit(form: NgForm){
    this.selectedItems.selectedEmail= [];
    let listMajorRemove: any[]= [];
    let listMajorAdd: any[] = [];
    if(this.currentMajor.value){
      for(var i = 0; i < this.currentMajor.value.length; i++){
        this.currentMajor.value[i] = parseInt(this.currentMajor.value[i]);
      }
    }
    listMajorRemove = _.difference(this.valueMajor, this.currentMajor.value);
    listMajorAdd = _.difference(this.currentMajor.value, this.valueMajor);
    let data = {
      'id': this.id,
      'code': this.university.code,
      'name': form.value.nameUni,
      'email': form.value.email,
      'phone': form.value.phone,
      'logo': this.baseService.getLogoUni()? this.baseService.getLogoUni(): this.logoSrc,
      'image': this.baseService.getImgUni()? this.baseService.getImgUni(): this.imageSrc,
      'description': $('#summernote').summernote('code'),
      'priority': form.value.pri,
      'trainSystem':{
        'id': 2
      }
    };
    console.log(data)
    let seft = this;
    this.universityService.updateUniversity(this.constant.UPDATE_UNIVESITY,data).subscribe((response:any)=>{
      if(response){
        if((this.valueLocation != this.university.priority) || listMajorRemove.length != 0 || listMajorAdd.length != 0){
         this.updateLocationMajor(listMajorRemove);         
        }else{    
          this.toastr.success('Bạn đã chỉnh sửa thành công', 'Thành công!',{showCloseButton: true});      
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

  removeMajor(listMajorRemove){
    let dataMajor = {
      'majorId': listMajorRemove,
      'university': {
        'id': this.id
      }
    };
    let seft = this;
    this.universityService.removeMajor(this.constant.REMOVE_MAJOR_UNI,dataMajor).subscribe((res:any)=>{
      if(res){
        this.toastr.success('Bạn đã chỉnh sửa thành công', 'Thành công!',{showCloseButton: true});
        setTimeout(function () {
          seft.router.navigate(['/admin/list-university'])
        }, 1000);
      }
    })
  }

  updateLocationMajor(listMajorRemove){
    let dataLocation = {
      'location': {
        'id': this.valueLocation? parseInt(this.valueLocation) : null,
      },
      'majorId': this.currentMajor.value.length !=0 ? this.currentMajor.value : null,
      'university':{
        'id': this.id
      }
    };
    let seft = this;
    this.universityService.updateLocationMajor(this.constant.UPDATE_LOCATION_MAJOR,dataLocation).subscribe((res:any)=>{
      if(res){
        if(listMajorRemove.length != 0){
          this.removeMajor(listMajorRemove);
        }else{
          this.toastr.success('Bạn đã chỉnh sửa thành công', 'Thành công!',{showCloseButton: true});
          setTimeout(function () {
            seft.router.navigate(['/admin/list-university'])
          }, 1000);
        }
      }
    },error=>{
      if(error.status==this.constant.NOT_FOUND){
        this.toastr.error('Trường đại học này không tồn tại. Vui lòng thử lại', 'Thất bại',{showCloseButton: true});
      }else{
        this.toastr.error('Vui lòng kiểm tra lại kết nối mạng', 'Thất bại',{showCloseButton: true});
      };
    });
  }



  // Upload image
  activeColor: string = 'green';
  baseColor: string = '#ccc';
  dragging: boolean = false;
  loaded: boolean = false;
  imageLoaded: boolean = false;
  value: boolean = false;
  handleDragEnter() {
    this.dragging = true;
  }
  handleDragLeave() {
    this.dragging = false;
  }
  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e, true);
  }
  handleImageLoad() {
    this.imageLoaded = true;
  }
  handleInputChange(e, boolean) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.toastr.warning("Sai kiểu dự liệu. Chỉ chấp nhận hình ảnh", "Sai");
      return;
    }
    this.loaded = false;
    if(boolean === true){
      this.isLoadLogo = true;
    }else{
      this.isLoadImage = true;
    }
    reader.onload = this._handleReaderLoaded.bind(this, boolean);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(boolean,e) {
    var reader = e.target;
    let url = "https://api.imgur.com/3/image";
    var headers = new Headers();
    headers.append('Authorization', 'Client-ID bf915d4106b6639');
    let options = new RequestOptions({headers: headers});
    let data = {
      'image': reader.result.split(',')[1]
    };
    if (boolean === true) {
      this.universityService.uploadFile(url, data, options).subscribe((response: any) => {
        this.logoSrc = response.data.link;
        this.baseService.setLogoUni(response.data.link);
        this.isLoadLogo = false;
      });
    } else {
      this.value = true;
      this.universityService.uploadFile(url, data, options).subscribe((response: any) => {
        this.imageSrc = response.data.link;
        this.baseService.setImgUni(response.data.link);
        this.isLoadImage = false;
      });
    }
    this.loaded = true;
  }
  //End upload img
}
