import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {RequestOptions,Headers} from "@angular/http";
import {UniversityService} from "../../../service/university/university.service";
import {Constants} from "../../../constants";
import {BaseService} from "../../../service/base-service/base.service";
import {ToastsManager} from "ng2-toastr";
import {Router} from "@angular/router";
import {ReviewService} from "../../../service/review/review.service";
declare var $: any;
@Component({
  selector: 'app-new-question',
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.less']
})
export class NewQuestionComponent implements OnInit {
  public listTagName;
  public tagName: any[];
  constructor(private uniService: UniversityService, private baseService: BaseService,private router: Router, private reviewService: ReviewService,
              private contants : Constants, private toastr: ToastsManager, private vcr: ViewContainerRef ) {
    this.toastr.setRootViewContainerRef(vcr);
  }
  public isCheck;
  ngOnInit() {
    this.getUniversity();
    var seft = this;
    $('#summernote').summernote({
      height: 200,
      toolbar: [
        ['style', ['bold', 'italic', 'underline']],
        ['fontsize', ['fontsize','color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['fullscreen',['picture', 'fullscreen']]
      ],
      callbacks:{
        onImageUpload: function(files) {
          var image = $('<img id="load">').attr('src','../../../assets/image/Eclipse.gif' );
          $('#summernote').summernote("insertNode", image[0]);
          var file = files[0];
          var reader = new FileReader();
          reader.onloadend = function() {
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
  }
  getUniversity(){
    this.reviewService.getAllTag().subscribe((res: any)=>{
      this.listTagName = res;
    });
  }
  onSave(form) {

    if($('#summernote').summernote('code').length < 50){
      this.isCheck = true;
    }else{
      this.isCheck = false;
    }
    if (form.valid && !this.isCheck) {

      //Tag list
      if(form.value.tagUni != null){
        this.tagName = [];
        for(let i = 0; i < form.value.tagUni.length; i++){
            this.tagName.push(form.value.tagUni[i].id);
        }
      }
      //End tag

      let data = {
        'title': form.value.title,
        "content": $('#summernote').summernote('code'),
        "type": this.contants.QUESTION,
        "parentId": 0,
        'tagUniversity': this.tagName,
      };
      console.log(data);
      var seft = this;
      this.uniService.saveQuestionAnswer(data).subscribe(res => {
        this.toastr.success("Bạn đã đặt câu hỏi thành công", "Thành công", {showCloseButton: true})
        setTimeout(() => {
          seft.router.navigate(['/question'])
        }, 1000);
      }, (error) => {
        this.toastr.error("Không thể kết nối với máy chủ. Vui lòng kiểm tra lại", "Thất bại", {showCloseButton: true});
      });
    }
  }
}
