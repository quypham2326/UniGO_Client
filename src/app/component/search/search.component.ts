import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { trigger, style, animate, transition } from '@angular/animations';
import { SearchService } from "../../service/base-service/search.service";
import { UniversityService } from "../../service/university/university.service";
import * as $ from 'jquery';
import { Observable } from "rxjs/Observable";
import { Select2OptionData } from "ng2-select2";
import { Constants } from "../../constants";
import { WaitingBoxComponent } from "../../waiting-box/waiting-box.component";
import { SlideInOutAnimation } from "../../animation";
import { text } from '../../../../node_modules/@angular/core/src/render3/instructions';

@Component({
  selector: 'app-search',
  animations: [SlideInOutAnimation],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {
  //multiple-search
  dropdownList = [];
  selectedItems: any = {
    "selectedMajor": [],
    "selectedLocation": []
  };
  dropdownSettings2 = {};
  dropdownSettings = {};
  userForm: FormGroup;

  //=======
  public show;
  public optionMajor: Select2Options;
  public optionUni: Select2Options;
  public optionLocation: Select2Options;
  public valueCurrent: any;
  public isCheckForUni: boolean = false;
  public isCheckForMajor: boolean = false;
  public isCheckForLocation: boolean = false;
  public isFirst: boolean = true;
  public isInto: boolean = true;
  public findAdvance: boolean = false;
  public isMore: boolean;
  constructor(private searchService: SearchService, private contant: Constants,
    private cef: ChangeDetectorRef,
    private UniversityService: UniversityService,
    private fb: FormBuilder,
  ) {
    this.createForm()
  }
  dropDownList: any = {
    "listMajor": [],
    "listLocation": [],
  };
  // public listMajor:any [] = [];
  // public listLocation:any [] = [];
  public listUniName: Observable<Select2OptionData[]>;


  public valueMajor: number = 0;
  public valueLocation: number = 0;
  public valueUniversity: number = 0;
  public listSearch: any[] = [];
  public listFilter: any[] = [];
  public searchMajor: any[];
  isActive: boolean = false;
  public schoolFilter: any = [];
  public pageLoad: number = 0;
  schoolName: string;
  public animationState = 'out';
  ngOnInit() {
    this.isMore = true;
    this.dropdownSettings = {
      singleSelection: false,
      text: "Chọn ngành",
      selectAllText: 'Tất Cả',
      unSelectAllText: 'Hủy Tất Cả',
      enableSearchFilter: true,
      classes: "myclass custom-class-example",
      badgeShowLimit: 3,
    };
    this.dropdownSettings2 = {
      singleSelection: false,
      text: "Chọn Khu Vực",
      enableSearchFilter: true,
      selectAllText: 'Tất Cả',
      unSelectAllText: 'Hủy Tất Cả',
      classes: "myclass custom-class-example",
      badgeShowLimit: 3
    };
    this.schoolFilter = {
      "name": "",
      "majorIds": [],
      "locationIds": [],
      "limit": 9,
      "page": 0,
    }
    ///========================
    document.documentElement.scrollTop = 0;
    // this.changedUniversity({value:null});
    this.listUniName = this.searchService.getList(this.contant.UNIVERSITY);
    console.log(this.listUniName);

    this.optionMajor = {
      allowClear: true,
      placeholder: {
        id: '0',
        text: 'Chọn ngành'
      }
    };
    this.optionUni = {
      allowClear: true,
      placeholder: {
        id: '0',
        text: 'Chọn Trường Đại Học'
      }
    };
    this.optionLocation = {
      allowClear: true,
      placeholder: {
        id: '0',
        text: 'Chọn địa điểm'
      }
    };

    $('#news-uni li').click(function () {
      $('#news-uni li').removeClass("active");
      $(this).addClass("active");
    });
    this.UniversityService.getMajor().subscribe((response: any) => {
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
    this.searchService.doFilterSchool(this.schoolFilter).subscribe((response: any) => {
      this.listSearch = response;
      this.show = true;
      if (this.schoolFilter.limit > response.length) {
        this.isMore = false;
      } else {
        this.isMore = true;
      }
      console.log(this.isMore)
    });
  }

  ///create form cubbalab
  createForm() {
    this.userForm = this.fb.group({
      schoolName: '',
      major: [],
      location: []
    })
  }

  submitForm() {
    WaitingBoxComponent.start();
    this.pageLoad = 0;
    var majorId: any = [];
    var locationId: any = [];
    if (this.userForm.value.major != undefined && this.userForm.value.major.length > 0) {
      for (var i = 0; i < this.userForm.value.major.length; i++) {
        majorId[i] = this.userForm.value.major[i].id
      }
    } else {
      majorId = [];
    }
    if (this.userForm.value.location != undefined && this.userForm.value.location.length > 0) {
      for (var i = 0; i < this.userForm.value.location.length; i++) {
        locationId[i] = this.userForm.value.location[i].id;
      }

    } else {
      locationId = [];
    }

    this.schoolFilter = {
      "name": this.userForm.value.schoolName,
      "majorIds": majorId,
      "locationIds": locationId,
      "limit": 9,
      "page": 0,
    }
    this.searchService.doFilterSchool(this.schoolFilter).subscribe((response: any) => {
      this.listSearch = response;
      this.show = true;
      if (this.schoolFilter.limit > response.length) {
        this.isMore = false;
      } else { this.isMore = true }
      console.log(this.listSearch)
      WaitingBoxComponent.stop();
    });
  }
  // load more school
  loadMoreSchool() {
    WaitingBoxComponent.start();
    this.listFilter = [];
    var majorId;
    var locationId;
    if (this.userForm.value.major != undefined && this.userForm.value.major.length > 0) {
      for (var i = 0; i < this.userForm.value.major.length; i++) {
        majorId[i] = this.userForm.value.major[i].id
      }
    } else {
      majorId = [];
    }
    if (this.userForm.value.location != undefined && this.userForm.value.location.length > 0) {
      for (var i = 0; i < this.userForm.value.location.length; i++) {
        locationId[i] = this.userForm.value.location[i].id;
      }

    } else {
      locationId = [];
    }
    this.schoolFilter = {
      "name": this.userForm.value.schoolName,
      "majorIds": majorId,
      "locationIds": locationId,
      "limit": 9,
      "page": ++this.pageLoad,
    }
    this.searchService.doFilterSchool(this.schoolFilter).subscribe((response: any) => {
      this.listFilter = (response);
      this.show = true;
      if (this.schoolFilter.limit > response.length) {
        this.isMore = false;
      }
      for (var i = 0; i < this.listFilter.length; i++) {
        this.listSearch.push(this.listFilter[i]);
      }
    });
    WaitingBoxComponent.stop();
  }
  resetForm() {
    this.selectedItems = {
      "selectedMajor": [],
      "selectedLocation": []
    };
    this.schoolName = "";
  };
  doFindAdvance(divName: string) {
    if (divName === 'divA') {
      this.findAdvance = !this.findAdvance;
      console.log(this.animationState);
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
    }
  }


  // // Click Search University
  // searchUniversity(){
  //   this.listSearch = [];
  //   let data = {
  //     "majorId": this.valueMajor,
  //     "locationId": this.valueLocation,
  //     "universityId": this.valueUniversity,
  //   };
  //   console.log(this.dropDownList.listLocation)
  // // List search
  //   this.searchService.searchPage(data).subscribe((response: any) =>{
  //       this.listSearch = response;
  //       if(this.listSearch[0] != null){
  //         this.show = true;
  //       }else{
  //         this.show = false;
  //       }
  //   })
  // }


  // changedMajor(value){
  //   if(value.value && value.value != 0 && this.valueMajor != value.value && this.valueLocation == 0){
  //     this.isInto = true;
  //     setTimeout(()=>  this.valueMajor = value.value,0);
  //     this.listUniName = this.searchService.getList(this.contant.GET_UIVERSITY_BY_MAJOR+"?majorId="+ parseInt(value.value));
  //     let data = this.valueUniversity;
  //     this.valueUniversity = -1;
  //      setTimeout(()=>{this.valueUniversity = data;},10);
  //     this.isFirst = false;
  //   }else if(value.value && value.value != 0 && this.valueMajor != value.value && this.valueLocation != 0 && value.value != -1){
  //     setTimeout(()=>  this.valueMajor = value.value,0);
  //     this.valueMajor = value.value;
  //     this.listUniName = this.searchService.getList(this.contant.GET_BY_LOCATION_AND_MAJOR + "?majorId=" + parseInt(value.value) +
  //       "&locationId=" + this.valueLocation);
  //     let data = this.valueUniversity;
  //     this.valueUniversity = -1;
  //     setTimeout(() => {this.valueUniversity = data;}, 10);
  //     this.isFirst = false;
  //   }else if(this.valueMajor == 0 && this.isCheckForLocation && this.valueLocation == 0 && !this.isFirst && this.isInto){
  //     console.log("vao trong major");
  //     // this.listUniName = this.searchService.getList(this.contant.UNIVERSITY);
  //     // this.listMajor = this.searchService.getMajor(this.contant.MAJOR);
  //     this.listLocation = this.searchService.getLocation(this.contant.LOCATION);
  //     this.valueLocation = 0;
  //     this.valueMajor = 0;
  //     this.valueUniversity = 0;
  //     this.isCheckForMajor = false;
  //     this.isCheckForUni = false;
  //     this.isCheckForLocation = false;
  //     this.isFirst = true;
  //     console.log(this.listMajor);
  //     //this.isInto = true;
  //   }else if(value.value == 0 && !this.isFirst){
  //     setTimeout(() => {this.valueMajor = value.value;}, 10);
  //     if(!this.isCheckForMajor){
  //       if(this.valueLocation != 0){
  //         //this.isInto = true;
  //         this.listUniName = this.searchService.getList(this.contant.GET_UIVERSITY_BY_LOCATION+"?locationId="+ this.valueLocation);
  //         if(this.valueUniversity != 0){
  //           let data = this.valueUniversity;
  //           this.valueUniversity = -1;
  //           setTimeout(()=>{
  //             this.valueUniversity = data;
  //             this.cef.detectChanges();
  //           },10);
  //         }
  //       }
  //     }
  //   }

  //   if(!value.value || this.valueMajor == -1){
  //     this.isCheckForMajor = true;
  //    // this.isFirst = false;
  //   }else{
  //     this.isCheckForMajor = false;
  //     //this.isFirst = true;
  //   }
  // }
  // changedLocation(value){
  //   if(value.value && value.value != 0 && this.valueLocation != value.value && this.valueMajor == 0){
  //     this.isInto = true;
  //     setTimeout(() => {this.valueLocation = value.value;}, 10);
  //     //this.valueLocation = value.value;
  //     this.listUniName = this.searchService.getList(this.contant.GET_UIVERSITY_BY_LOCATION+"?locationId="+ parseInt(value.value));
  //     if(this.valueUniversity != 0){
  //       let data = this.valueUniversity;
  //       this.valueUniversity = -1;
  //       setTimeout(()=>{this.valueUniversity = data;},10);
  //     }
  //     this.isFirst = false;
  //   }else if(value.value && value.value != 0 && this.valueLocation != value.value && this.valueMajor != 0 && this.valueMajor!=-1){
  //     setTimeout(() => {this.valueLocation = value.value;}, 10);
  //     this.listUniName = this.searchService.getList(this.contant.GET_BY_LOCATION_AND_MAJOR + "?majorId=" + this.valueMajor +
  //       "&locationId=" + parseInt(value.value));
  //     let data = this.valueUniversity;
  //     this.valueUniversity = -1;
  //     setTimeout(() => {this.valueUniversity = data;}, 10);
  //     if (this.valueMajor != 0) {
  //       let data = this.valueMajor;
  //       this.valueMajor = -1;
  //       setTimeout(() => {this.valueMajor = data;}, 100);
  //     }
  //     this.isFirst = false;
  //   }
  //   else if(value.value == 0 && this.valueMajor == 0 && !this.isFirst && this.isInto){
  //     console.log("vao trong location");
  //     this.listUniName = this.searchService.getList(this.contant.UNIVERSITY);
  //      this.listMajor = this.searchService.getMajor(this.contant.MAJOR);
  //      this.listLocation = this.searchService.getLocation(this.contant.LOCATION);
  //      this.valueUniversity = 0;
  //      this.valueLocation = 0;
  //      this.valueMajor = 0;
  //      this.isCheckForMajor = false;
  //      this.isCheckForUni = false;
  //      this.isCheckForLocation = false;
  //      this.isFirst = true;
  //      //this.isInto = true;
  //   }else if(value.value == 0 && !this.isFirst){
  //     setTimeout(() => {this.valueLocation = value.value;}, 10);
  //     if(!this.isCheckForLocation){
  //       if(this.valueMajor != 0){
  //         //this.isInto = true;
  //         this.listUniName = this.searchService.getList(this.contant.GET_UIVERSITY_BY_MAJOR+"?majorId="+ this.valueMajor);
  //         if(this.valueUniversity != 0){
  //           let data = this.valueUniversity;
  //           this.valueUniversity = -1;
  //           setTimeout(()=>{this.valueUniversity = data;},10);
  //         }
  //         let data = this.valueMajor;
  //         this.valueMajor = -1;
  //         setTimeout(() => {this.valueMajor = data;}, 100);
  //       }
  //     }
  //   }

  //   if(!value.value || this.valueLocation == -1){
  //     this.isCheckForLocation = true;
  //     //this.isFirst = false;
  //   }else{
  //     this.isCheckForLocation = false;
  //     //this.isFirst = true;
  //   }
  // }

  // changedUniversity(value){
  //   if(value.value && value.value != 0 && this.valueUniversity != value.value && !this.isCheckForUni){
  //     this.valueUniversity = value.value;
  //     if(this.valueLocation != 0){
  //         //this.isFirst = true;
  //     }
  //     // this.valueLocation =0;
  //     //this.valueMajor = 0;
  //     setTimeout(()=> this.listLocation = this.searchService.getLocation(this.contant.GET_LOCATION_UNIVERSITY+"?universityId="+parseInt(value.value)),0);
  //     setTimeout(()=> this.listMajor = this.searchService.getMajor(this.contant.GET_MAJOR_UNIVERSITY+"?universityId="+ parseInt(value.value)),0);
  //     if (this.valueMajor != 0) {
  //       let data = this.valueMajor;
  //       this.valueMajor = -1;
  //       setTimeout(() => {this.valueMajor = data;}, 200);
  //     }
  //   }else if(value.value == 0 && !this.isCheckForUni && this.isInto && this.isFirst){
  //     console.log("vao univer");
  //     // console.log(this.isInto);
  //     this.isInto = false;
  //     //his.isFirst = false;
  //     this.valueUniversity = 0;
  //    setTimeout(()=> this.listMajor = this.searchService.getMajor(this.contant.MAJOR), 0) ;
  //    setTimeout(()=> this.listLocation = this.searchService.getLocation(this.contant.LOCATION), 0) ;
  //     if(this.valueMajor != 0 || this.valueLocation != 0){
  //       this.listUniName = this.searchService.getList(this.contant.UNIVERSITY);
  //       this.valueMajor = 0;
  //       this.valueLocation =0;
  //     }
  //   }
  //   // if((value.value == null || value.value == 0 ) && this.isCheckForUni == true){
  //   //   this.listUniName = this.searchService.getList(this.contant.UNIVERSITY);
  //   // }
  //   // (this.valueLocation == 0 && this.valueMajor == 0 && this.isCheckForUni && !this.isFirst)
  //   if(value.value == null || this.valueUniversity == -1){
  //     this.isCheckForUni = true;
  //   }else{
  //     this.isCheckForUni = false;
  //   }
  // }
}

