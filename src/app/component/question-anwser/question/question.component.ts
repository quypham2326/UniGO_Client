import { Component, OnInit } from '@angular/core';
import {UniversityService} from "../../../service/university/university.service";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less']
})
export class QuestionComponent implements OnInit {

  constructor(private uniService: UniversityService) { }

  public questions;
  ngOnInit() {
    this.uniService.getAllQuestion().subscribe(res=>{
      this.questions = res;
      console.log(res);
    })
  }

}
