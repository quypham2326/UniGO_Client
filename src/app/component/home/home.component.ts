import {Component, OnDestroy, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {Router} from "@angular/router";
import {SearchService} from "../../service/base-service/search.service";
import {Observable} from "rxjs/Observable";
import {Select2OptionData} from "ng2-select2";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit,OnDestroy {
  public valueCurrent: any;
  selectedRow : number;
  public searchMajor: any[];
  public topFiveMajor:any[];
  isActive: boolean = false;

  constructor(private router: Router, private searchService: SearchService) { }

  ngOnInit() {

    this.getTopThreeMajor(0,1);
    this.getTopFiveMajor();

  }

  getTopThreeMajor(index,value){
    this.selectedRow = index;
    this.isActive = true;
    this.valueCurrent = value;
    this.searchMajor = [];
    this.searchService.getTopThreeMajor(value).subscribe((response: any)=>{
      this.searchMajor = response;
    });
    console.log(value);

  }

  getTopFiveMajor(){
    this.searchService.getTopFiveMajor().subscribe((response:any)=>{
      this.topFiveMajor = response;
    })
  }

  ngOnDestroy() {

  }

}
