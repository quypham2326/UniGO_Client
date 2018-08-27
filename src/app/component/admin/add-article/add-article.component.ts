import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {UniversityService} from "../../../service/university/university.service";
import {ToastsManager} from "ng2-toastr";
import {SearchService} from "../../../service/base-service/search.service";
import {Constants} from "../../../constants";
import {Observable} from "rxjs/Observable";
import {Select2OptionData} from "ng2-select2";
import {RequestOptions,Headers} from "@angular/http";
import {NgForm} from "@angular/forms";
import {ReviewService} from "../../../service/review/review.service";
import {BaseService} from "../../../service/base-service/base.service";
import {Router} from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.less']
})
export class AddArticleComponent implements OnInit {
  public listUniName: Observable<Select2OptionData[]>;
  public options: Select2Options;
  public valueUniversity;
  public valueMajorName: any[];
  public tagMajorName: any[];
  public testTag: any;
  public hasError: boolean = false;
  public isCheck: boolean = false;
  constructor(private uniService: UniversityService, private router: Router,
              private searchService: SearchService,
              private reviewService: ReviewService, private baseService: BaseService,
              private toastr: ToastsManager, private vcr: ViewContainerRef, private constants: Constants) {
    this.toastr.setRootViewContainerRef(vcr)
  }

  ngOnInit() {
    var seft = this;
    $('#summernote').summernote({
      height: 150,
      toolbar: [
        ['style', ['bold', 'italic', 'underline']],
        ['fontsize', ['fontsize','color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['fullscreen',['picture','video','fullscreen']]
      ],
      callbacks:{
        onImageUpload: function(files) {
          var image = $('<img id="load">').attr('src','../../../assets/image/Eclipse.gif' );
          $('#summernote').summernote("insertNode", image[0]);
          var file = files[0];
          var reader = new FileReader();
          reader.onloadend = function() {
            // console.log('RESULT', reader)
            let url = "https://api.imgur.com/3/image";
            var headers = new Headers();
            headers.append('Authorization', 'Client-ID bf915d4106b6639');
            let options = new RequestOptions({ headers: headers });
            let data = {
              'image': reader.result.split(',')[1]
            };
            seft.uniService.uploadFile(url,data,options).subscribe((response:any)=>{
              $('#load').remove();
              var image = $('<img>').attr('src', response.data.link);
              $('#summernote').summernote("insertNode", image[0]);
            });
          };
          reader.readAsDataURL(file);
        }
      }
    });
    this.getUniversity();
    this.uniService.broadcastTextChange("Thêm Bài Báo");

    // Placeholder
    this.options = {
      allowClear: true,
      placeholder: {
        id: '0',
        text: 'Chọn một trường đại học'
      }
    };
  }

  getUniversity(){
    this.listUniName = this.searchService.getList(this.constants.UNIVERSITY);
  }
  getMajorUniversity(value){
    this.uniService.getMajorUniversity(value).subscribe((res: any)=>{
      this.valueMajorName = res;
      console.log(this.valueMajorName);
    })
  }

  changedUniversity(value) {
    this.valueUniversity = value;
    if(this.valueUniversity.value != 0){
      this.getMajorUniversity(this.valueUniversity.value);
    }
    if (this.valueUniversity.value == 0) {
      this.isCheck = false;
    } else {
      this.isCheck = true;
    }
  }

  public onSave(form: NgForm){

      console.log(form.value);
    if(form.value.tagMajor != null){
      this.tagMajorName = [];
      for(let i = 0; i < form.value.tagMajor.length; i++){
        this.tagMajorName.push(form.value.tagMajor[i].id);
      }
    }


    // if($('#summernote').summernote('code').length < 100 || $('#summernote').summernote('code').length > 400){
    //   this.isCheck = true;
    // }else{
    //   this.isCheck = false;
    // }
    let content = $('#summernote').summernote('code');
    if(content == " "){
      this.hasError = true;
    }else{
      this.hasError = false;
    }
    if(form.valid && this.isCheck && !this.hasError){
      console.log("form valid !!!!!!!!!!!!!");
    let data = {
      'code': form.value.code,
      'title': form.value.title,
      'description': form.value.des,
      'contents': $('#summernote').summernote('code'),
      'image': this.baseService.getLogoUni(),
      'university': {
        'id': this.valueUniversity.value
      },
      'tags': this.tagMajorName,
    };
    console.log(data);
    let seft = this;
    this.reviewService.saveArticle(data).subscribe((res: any) => {
      if(res){
        this.toastr.success('Lưu Thành Công','Thành công', {showCloseButton: true});
        setTimeout(function () {
          seft.router.navigate(['/admin/list-article'])
        }, 1000);
      }
    }, (err) => {
      if(err.status = this.constants.CONFLICT){
        this.toastr.error('Mã bài báo đã tồn tại', 'Thất bại',{showCloseButton: true});
      }else{
        this.toastr.error('Vui lòng kiểm tra kết nối mạng', 'Thất bại',{showCloseButton: true});
      }
    })
  }
  }
}
