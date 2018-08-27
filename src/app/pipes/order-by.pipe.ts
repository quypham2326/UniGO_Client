import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(value: any, args: any): any {
    if(value==null) {
      return null;
    }
    if(args.startsWith("-")){
      args = args.substring(1);
      value.sort((a: any, b: any) => {
        if (a[args] < b[args]) {
          return 1;
        } else if (a[args] > b[args]) {
          return -1;
        } else {
          return 0;
        }
      });
    }else{
      value.sort((a: any, b: any) => {
        args = args.substring(1);
        if (a[args] < b[args]) {
          return -1;
        } else if (a[args] > b[args]) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return value;
  }
}

@Pipe({name: 'groupBy'})
export class GroupByPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    var groups = {};
    if(value){
    value.forEach(function(o) {
      var group = o.major.groupMajor.code;
      groups[group] = groups[group] ?
        groups[group] : { name: group, resources: [] };
      groups[group].resources.push(o);
    });
    }
    return Object.keys(groups).map(function (key) {return groups[key]});
  }
}

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
