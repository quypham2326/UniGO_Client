import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute, Router} from "@angular/router";
import {UniversityService} from "../../../service/university/university.service";
import {ReviewService} from "../../../service/review/review.service";
import {RequestOptions, Headers} from "@angular/http";
import {ToastsManager} from "ng2-toastr";
import {BaseService} from "../../../service/base-service/base.service";
import {NgForm} from "@angular/forms";
import {Constants} from "../../../constants";
import {Observable} from "rxjs/Observable";
import {Select2OptionData} from "ng2-select2";
import {SearchService} from "../../../service/base-service/search.service";
declare var $: any;
@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.less']
})
export class EditArticleComponent implements OnInit {
  public sub: Subscription;
  public id;
  public uniId;
  public valueMajorName: any[];
  public articleById: any;
  public tagArticleById; //Set lai ID = majorUniId hien tags da add
  public tagMajorName: any[]; //List value tag from updateForm (id)
  public hasError: boolean = false;
  public logoSrc: any = '';
  public isLoadImage: any='';
  public listUniNameSelect2: Observable<Select2OptionData[]>;
  constructor(private activatedRoute: ActivatedRoute, private uniService: UniversityService,
              private reviewService: ReviewService, private constants: Constants, private router: Router,
              private toastr: ToastsManager, private vcr: ViewContainerRef, private constant: Constants,
              private baseService: BaseService, private searchService: SearchService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.listUniNameSelect2 = this.searchService.getList(this.constant.UNIVERSITY);
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
            console.log('RESULT', reader)
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

    this.uniService.broadcastTextChange("CHỈNH SỬA THÔNG TIN BÀI BÁO");
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      setTimeout(()=>{
        this.getArticleById(this.id);
        this.getTagArticle(this.id);
      },0)
    });

  }
  //Set value tag input khi moi vao
  getTagArticle(data){
    this.reviewService.getTagArticle(data).subscribe((res: any)=>{
      this.tagArticleById = [];
      for(let i = 0; i < res.length; i++){
        this.tagArticleById.push({
          'id': res[i].majorUniId,
          'majorName': res[i].majorName,
        })
      }
    })
  }

  getArticleById(data: number){
    this.reviewService.getArticleById(data).subscribe((res: any)=>{
      this.articleById = res;
      console.log(res);
      $('#summernote').summernote('code', this.articleById.contents);
      this.logoSrc = this.articleById.image;
      this.baseService.setLogoUni(this.logoSrc);
    });

  }

  getValueUniversity(data){
    this.uniId = data.value;
    this.uniService.getMajorUniversity(data.value).subscribe((res: any)=>{
      this.valueMajorName = res;
    })
  }

  public onUpdate(editForm: NgForm){

    if(editForm.value.tagMajor != null){
      this.tagMajorName = [];
      for(let i = 0; i < editForm.value.tagMajor.length; i++){
        this.tagMajorName.push(editForm.value.tagMajor[i].id);
      }
    }

    let content = $('#summernote').summernote('code');
    if(content == " "){
      this.hasError = true;
    }
    if(editForm.valid){
      let data = {
        'id': this.id,
        'code': editForm.value.code,
        'title': editForm.value.title,
        'description': editForm.value.des,
        'contents': $('#summernote').summernote('code'),
        'image': this.baseService.getLogoUni(),
        'university': {
          'id': this.uniId //cho thay đổi trường nha a ok
        },
        'tags': this.tagMajorName,
      };
      console.log(data);
      let seft = this;
      this.reviewService.uploadArticle(data).subscribe((res: Response) => {
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
    this.isLoadImage = true;
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

      this.uniService.uploadFile(url, data, options).subscribe((response: any) => {
        this.logoSrc = response.data.link;
        this.baseService.setLogoUni(response.data.link);
        this.isLoadImage = false;
      });

    this.loaded = true;
  }



}
