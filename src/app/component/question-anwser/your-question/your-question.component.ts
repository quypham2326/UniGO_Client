import { Component, OnInit } from '@angular/core';
import { UniversityService } from "../../../service/university/university.service";
import { BaseService } from "../../../service/base-service/base.service";

@Component({
  selector: 'app-your-question',
  templateUrl: './your-question.component.html',
  styleUrls: ['./your-question.component.less']
})
export class YourQuestionComponent implements OnInit {

  constructor(private uniService: UniversityService, private baseService: BaseService) { }
  public questions: any;

  ngOnInit() {
    this.uniService.getQuestionByUser().subscribe(res => {
      this.questions = res;
    });
    this.uniService.broadcastTextChange(0);
  }

}
