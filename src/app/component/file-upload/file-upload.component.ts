import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {BaseService} from "../../service/base-service/base.service";
import {Http, RequestOptions,Headers} from "@angular/http";
import {UniversityService} from "../../service/university/university.service";
import {ToastsManager} from "ng2-toastr";

@Component({
  selector: 'file-uploader',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.less'],
  inputs:['activeColor','baseColor','overlayColor']
})
export class FileUploadComponent implements OnInit{
  @Input() name: string;
  @Input() imgUrl: string;
  constructor(private baseService: BaseService, private uniService : UniversityService,
    public toastr: ToastsManager, vcr: ViewContainerRef){
    this.toastr.setRootViewContainerRef(vcr);
  }
  activeColor: string = 'green';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';

  dragging: boolean = false;
  loaded: boolean = false;
  imageLoaded: boolean = false;
  imageSrc: string = '';
  value: boolean = false;
  isLoading: boolean = false;
  ngOnInit(){

  }
  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {
    this.dragging = false;
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  handleImageLoad() {
    this.imageLoaded = true;
  }

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.toastr.warning("Sai kiểu dự liệu. Chỉ chấp nhận hình ảnh", "Sai");
      alert('invalid format');
      return;
    }
    this.loaded = false;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
    this.isLoading = true;
  }

  _handleReaderLoaded(e) {
    var reader = e.target;
    // this.imageSrc = reader.result;
    let url = "https://api.imgur.com/3/image";
    var headers = new Headers();
    headers.append('Authorization', 'Client-ID bf915d4106b6639');
    let options = new RequestOptions({ headers: headers });
    let data = {
      'image': reader.result.split(',')[1]
    };
    if(this.name === 'logo'){
      this.uniService.uploadFile(url,data,options).subscribe((response:any)=>{
        this.imageSrc = response.data.link;
        this.baseService.setLogoUni(response.data.link);
        this.isLoading = false;
      });
    }else{
      this.uniService.uploadFile(url,data,options).subscribe((response:any)=>{
        this.imageSrc = response.data.link;
        this.baseService.setImgUni(response.data.link);
        this.isLoading = false;
        this.value = true;
      },err=>{
        this.toastr.error('Vui lòng kiểm tra lại kết nối mạng', 'Thất bại');
      });
    }
    this.loaded = true;
  }

}
