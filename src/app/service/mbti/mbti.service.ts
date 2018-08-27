import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map'
import { Constants } from "../../constants";
import { AuthorizedHttpClient } from "../../utils/authorized-http-client";

@Injectable()
export class MbtiService {
  constructor(private _http: Http, private constant: Constants,
    private authHttp: AuthorizedHttpClient) {

  }

  getMbti(): Observable<any[]> {
    return this._http.get(this.constant.MBTI)
      .map((response: Response) => response.json())
  }
  saveMbti(data): Observable<any[]> {
    return this.authHttp.post(this.constant.SAVE_MBTI_RESULT, data);
  }

  getMbtiresult(): Observable<any[]> {
    return this.authHttp.get(this.constant.GET_MBTI_RESULT);
  }

  getTopUniMBTI(data: number): Observable<any[]> {
    return this._http.get(this.constant.TOP_UNI_MBTI + "?mbtiTypeId=" + data)
      .map((res: Response) => res.json());
  }

}

