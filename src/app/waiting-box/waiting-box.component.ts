import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-waiting-box',
  templateUrl: './waiting-box.component.html',
  styleUrls: ['./waiting-box.component.less']
})
export class WaitingBoxComponent implements OnInit {
  static time:number =-1;
  static interval:any;
  staticRef = WaitingBoxComponent;
  constructor() { }

  ngOnInit() {
  }
  static start(){
    if(WaitingBoxComponent.time ==-1){
      WaitingBoxComponent.time = 0;
      WaitingBoxComponent.interval=setInterval(WaitingBoxComponent.increase,1000);
    }
  }

  static increase(){
    WaitingBoxComponent.time++;
  }

  static stop(){
    WaitingBoxComponent.time=-1;
    clearInterval(WaitingBoxComponent.interval);
    WaitingBoxComponent.interval=undefined;
  }

}
