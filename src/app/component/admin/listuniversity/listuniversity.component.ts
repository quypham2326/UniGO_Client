import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {Constants} from "../../../constants";
import {SearchService} from "../../../service/base-service/search.service";
import {Select2OptionData} from "ng2-select2";
import {Observable} from "rxjs/Observable";
import {ToastsManager} from "ng2-toastr";
import {UniversityService} from "../../../service/university/university.service";

@Component({
  selector: 'app-listuniversity',
  templateUrl: './listuniversity.component.html',
  styleUrls: ['./listuniversity.component.less']
})
export class ListuniversityComponent implements OnInit {
  // public title: 'List University';
  constructor(private router: Router, private universityService: UniversityService,
              private searchService: SearchService,
              private constant: Constants, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr)
  }

  public listUniNameSelect2: Observable<Select2OptionData[]>;
  public listUniName: any[];
  public options: Select2Options;
  private uniId: string;
  public selectIndex: number;
  ngOnInit() {
    this.universityService.broadcastTextChange("DANH SÁCH TRƯỜNG");
    this.listUniNameSelect2 = this.searchService.getList(this.constant.UNIVERSITY);
    this.searchService.getListUniName().subscribe((response: any) => {
        if (response) {
          this.listUniName = response;
          localStorage.setItem('LIST_UNI', JSON.stringify(response));
        }
      }, error => {
        this.toastr.error('Vui lòng kiểm tra lại kết nối mạng', 'Thất bại',{showCloseButton: true});
      }
    );
    this.options = {
      allowClear: true,
      placeholder: {
        id: '0',
        text: 'Chọn một trường đại học'
      }
    };
  }

  getValue(data: { value: string }) {
    this.uniId = data.value;
    const backUplist = JSON.parse(localStorage.getItem('LIST_UNI'));
    this.listUniName = backUplist;
    if (this.uniId && this.uniId != '0') {
      for (let i = 0; i < this.listUniName.length; i++) {
        if (this.uniId == this.listUniName[i].id) {
          let a = this.listUniName[i];
          this.listUniName.length = 0;
          this.listUniName.push(a);
          return;
        }
      }
    }
    return;
  }

  deleteUniversity() {
    let deleteId = {
      "id": this.selectIndex,
    };
    this.universityService.deleteUniversity(deleteId).subscribe((response: any) => {
      if (response) {
        for (let i = 0; i < this.listUniName.length; i++) {
          if (this.selectIndex == this.listUniName[i].id) {
            let a = this.listUniName[i];
            this.listUniName.splice(i, 1);
            this.toastr.success("Đã xoá thành công","Thành công",{showCloseButton: true});
            return;
          }
        }
      }
    },error => {
      this.toastr.error("Vui lòng kiểm tra lại", "Thất bại",{showCloseButton: true})
    });
  }

}
