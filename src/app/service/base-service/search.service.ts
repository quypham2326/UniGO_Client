import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map'
import {Select2OptionData} from "ng2-select2";
import {Constants} from "../../constants";
@Injectable()
export class SearchService {
  constructor(private _http: Http, private constant: Constants) {

  }

  getMajor(url): Observable<any[]> {
    return this._http.get(url)
      .map((response: Response) => response.json())
      .map((majors) => {
        if (majors.length > 1) {
          majors.unshift({id: '0', name: ''});
        }
        return majors.map((major) => {
          return {id: major.id, itemName: major.majorName};
        });
      })
  }

  getList(url): Observable<Select2OptionData[]> {
    return this._http.get(url)
      .map((response: Response) => response.json())
      .map((universitys) => {
        if (universitys.length > 1) {
          universitys.unshift({id: '0', name: ''});
        }
        return universitys.map((university) => {
          return {id: university.id, text: university.name};
        });
      })
  }

  getLocation1(): Observable<any[]> {
    return this._http.get(this.constant.LOCATION).map((res: Response)=> res.json());
  }
  getLocation(url): Observable<Select2OptionData[]> {
    return this._http.get(url)
      .map((response: Response) => response.json())
      .map((locations) => {
        if (locations.length > 1) {
          locations.unshift({id: '0', name: ''});
          return locations.map((location) => {
            return {id: location.id, text: location.locationName};
          });
        } else {
          let array = [];
          array.push(locations);
          return array.map((location) => {
            return {id: location.id, text: location.locationName};
          });
        }
      })
  }
  // getLocationByUniId(data):Observable<any>{
  //   return this._http.get(this.constant.GET_LOCATION_UNIVERSITY+"?universityId="+data)
  //     .map((response: Response) => response.json())
  //     .map((locations) => {
  //       majors.unshift({id:'0',name:''});
  //       return majors.map((major) => {
  //         return {id: major.id, text: major.majorName};
  //       });
  //     });
  // }
  getBlock(): Observable<Select2OptionData[]>{
    return this._http.get(this.constant.BLOCK)
      .map((response: Response) => response.json())
      .map((blocks) => {
        blocks.unshift({id:'0',name:''});
        return blocks.map((block) => {
          return {id: block.blockName, text: block.blockName};
        });
      })
  }

  getListUniName(): Observable<any[]>{
      return this._http.get(this.constant.UNIVERSITY)
        .map((response: Response) => response.json())
  }

  searchPage(data): Observable<any[]>{
    return this._http.post(this.constant.SEARCH,data)
      .map((response: Response) => response.json())
  }
  //addd

  getTopThreeMajor(data): Observable<any[]>{
    return this._http.get(this.constant.GET_TOP_THREE+"?majorId="+ data).map((res:Response)=> res.json());
  }
  getTopFiveMajor():Observable<any[]>{
    return this._http.get(this.constant.GET_TOP5_MAJOR).map((response: Response) => response.json());
  }
  getMajorByID(data): Observable<any[]>{
    return this._http.get(this.constant.FIND_BY_MAJOR_ID+"?majorId="+ data)
      .map((res: Response) => res.json());
  }
  doFilterSchool(schoolFilter):Observable<any[]>{
    return this._http.post(this.constant.FILTER_SCHOOL,schoolFilter)
      .map((response: Response) => response.json())
  }
}

