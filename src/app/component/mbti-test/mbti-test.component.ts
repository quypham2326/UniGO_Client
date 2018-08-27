import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from "@angular/forms";
import {MBTIQuestion} from "../../model/MBTIModel";
import {MbtiService} from "../../service/mbti/mbti.service";
import {BaseService} from "../../service/base-service/base.service";
import {Constants} from "../../constants";
import {ToastsManager} from "ng2-toastr";
import * as $ from 'jquery';

@Component({
  selector: 'app-mbti-test',
  templateUrl: './mbti-test.component.html',
  styleUrls: ['./mbti-test.component.less']
})
export class MbtiTestComponent implements OnInit {
  public MBTIresult: string;
  public tested: boolean;
  public questions: MBTIQuestion[];
  public listQuestion: any[];
  public mbtiResult: any;
  public majorResult: any;
  public update: boolean = false;
  public topUniMBTI;
  public index: number = 0;
  public slideToggle: string = ".slide-toggle-character"; //Class Slide Toggle Character
  public isClickSlideToggle: boolean = false;
  private scores = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0
  };

  constructor(private router: Router, private mbtiService: MbtiService, private baseService: BaseService,
              private constanst: Constants, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr)
  }

  //Top University MBTI
  getUniMBTI(data){
    this.mbtiService.getTopUniMBTI(data).subscribe((res: any) => {
      this.topUniMBTI = res;
      console.log(data)
      console.log(this.topUniMBTI);
    });
  }

  ngOnInit() {
    
    this.tested = false;
    this.questions = [];

    this.mbtiService.getMbtiresult().subscribe((response: any) => {
      this.mbtiResult = response;
      this.majorResult = response.mbtitype.majorMbtis;
      this.getUniMBTI(response.mbtitype.id);


      if (this.mbtiResult != []) {
        this.tested = true;
      }
    }, error => {
      if (error.status == this.constanst.CONFLICT) {
        this.tested = false;
      }
    });
    this.mbtiService.getMbti().subscribe((response: any) => {
      this.listQuestion = response;
      this.listQuestion.forEach(x => {
        this.questions.push(new MBTIQuestion(x));
      });
    });


  }

  public onChoose(item, option) {
    if ((option == 'a' || option == 'b') && !item.isChecked) {
      item.fullChecked = true;
      // console.log(item.fullChecked)
    }
    if (option == 'a' && !item.isChecked) {
      if (item.MBTIGroup == 'EI') {
        this.scores.E = this.scores.E + 1;
      } else if (item.MBTIGroup == 'SN') {
        this.scores.S = this.scores.S + 1;
      } else if (item.MBTIGroup == 'TF') {
        this.scores.T = this.scores.T + 1;
      } else {
        this.scores.J = this.scores.J + 1;
      }
      item.isChecked = false;
      
    }
    if (option == 'b' && !item.isChecked) {
      if (item.MBTIGroup == 'EI') {
        this.scores.E = this.scores.E - 1;
      } else if (item.MBTIGroup == 'SN') {
        this.scores.S = this.scores.S - 1;
      } else if (item.MBTIGroup == 'TF') {
        this.scores.T = this.scores.T - 1;
      } else {
        this.scores.J = this.scores.J - 1;
      }
      item.isChecked = false;
    }
    console.log(this.scores);
    console.log(option)
  }

  public onSubmit(form: NgForm) {

    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i].fullChecked == false) {
        this.toastr.error("Vui lòng hoàn thành tất cả câu hỏi", '', {showCloseButton: true});
        return;
      }
    }
    if (this.scores.E >= 5) {
      this.MBTIresult = 'E';
    } else {
      this.MBTIresult = 'I';
    }
    if (this.scores.S >= 10) {
      this.MBTIresult = this.MBTIresult + 'S';
    } else {
      this.MBTIresult = this.MBTIresult + 'N';
    }
    if (this.scores.T >= 10) {
      this.MBTIresult = this.MBTIresult + 'T';
    } else {
      this.MBTIresult = this.MBTIresult + 'F';
    }
    if (this.scores.J >= 10) {
      this.MBTIresult = this.MBTIresult + 'J';
    } else {
      this.MBTIresult = this.MBTIresult + 'P';
    }
    console.log(this.MBTIresult);
    form.onReset();
    let data = {
      mbtiType: {
        "mbtitypeName": this.MBTIresult
      },
      user: {
        "id": this.baseService.getUser().id,
      }
    };
    // if (this.update === false) {
    //   this.mbtiService.saveMbti(data).subscribe((response: any) => {
    //     if (response) {
    //       this.mbtiService.getMbtiresult(this.baseService.getUser().id).subscribe((response: any) => {
    //         this.mbtiResult = response;
    //         this.majorResult = response.mbtitype.majorMbtis;
    //         this.getUniMBTI(response.mbtitype.id);
    //       })
    //     }
    //   });
    // } else {
    //   this.mbtiService.updateMbti(data).subscribe((response: any) => {
    //     if (response) {
    //       this.mbtiService.getMbtiresult(this.baseService.getUser().id).subscribe((response: any) => {
    //         this.mbtiResult = response;
    //         this.majorResult = response.mbtitype.majorMbtis;
    //         this.getUniMBTI(response.mbtitype.id);
    //       })
    //     }
    //   });
    // }
    this.mbtiService.saveMbti(data).subscribe((response: any) => {
          if (response) {
            // this.mbtiService.getMbtiresult(this.baseService.getUser().id).subscribe((response: any) => {
            //   this.mbtiResult = response;
            //   this.majorResult = response.mbtitype.majorMbtis;
            //   this.getUniMBTI(response.mbtitype.id);
            //   document.body.scrollTop = 0;
            // })
            this.mbtiResult = response;
            this.majorResult = response.mbtitype.majorMbtis;
            this.getUniMBTI(response.mbtitype.id);
            document.body.scrollTop = 0;
          }
        });
    document.body.scrollTop = 0;
    this.tested = true;
    this.scores = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0
    };
    for (let i = 0; i < this.questions.length; i++) {
      this.questions[i].isChecked = false;
      this.questions[i].fullChecked = false;
    }
  }

  public cancel(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if(this.update){
      this.tested = true;
    }else{
      this.router.navigate(['/search-university']);
    }
  }
  // Author: Nguyen Dinh Thai
  //==========================
  Next(count){
    this.index = ++ count
  }

  Previous(count){
    this.index = --count
  }

  toggleSlideCharacter(slideToggle){
    this.isClickSlideToggle = !this.isClickSlideToggle
    $(slideToggle).slideToggle();
  }
}

