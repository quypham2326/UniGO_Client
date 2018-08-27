import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Constants } from "../../constants";
import { AuthorizedHttpClient } from "../../utils/authorized-http-client";

@Injectable()
export class UniversityService {

  constructor(private _http: Http, private contant: Constants,
    private authorizedHttp: AuthorizedHttpClient) { }
  public title = new BehaviorSubject<any>(null);

  public broadcastTextChange(value: any) {
    this.title.next(value);
  }
  createUniversity(apiUrl, data): Observable<any> {
    return this._http.post(apiUrl, data).map((res: Response) => res.json());
  }
  updateUniversity(apiUrl, data): Observable<any> {
    return this._http.post(apiUrl, data).map((res: Response) => res.json());
  }
  updateLocationMajor(apiUrl, data): Observable<any[]> {
    return this._http.post(apiUrl, data).map((res: Response) => res.json());
  }
  removeMajor(apiUrl, data): Observable<any> {
    return this._http.post(apiUrl, data).map((res: Response) => res.json());
  }
  uploadFile(apiUrl, data, options): Observable<any[]> {
    return this._http.post(apiUrl, data, options).map((res: Response) => res.json());
  }
  getUniversityById(data: any): Observable<any> {
    return this._http.get(this.contant.GET_UNI_BY_ID + "?universityId=" + data).map((res: Response) => res.json());
  }

  getMajorUniversity(data): Observable<any> {
    return this._http.get(this.contant.GET_FOR_TAG + "?universityId=" + data).map((res: Response) => res.json());
  }

  deleteUniversity(data): Observable<any[]> {
    return this._http.post(this.contant.DELETE_UNIVERSITY, data).map((response: Response) => response.json());
  }
  updateScore(data): Observable<any> {
    return this._http.post(this.contant.UPDATE_SCORE, data).map((response: Response) => response.json());
  }
  saveMajorUniDetail(data): Observable<any> {
    return this._http.post(this.contant.SAVE_MAJOR_UNI_DETAIL, data).map((response: Response) => response.json());
  }
  deleteBlockMajorUni(data): Observable<any> {
    return this._http.post(this.contant.DELETE_BLOCK_SCORE, data).map((response: Response) => response.json());
  }
  topCorrlateUni(data): Observable<any> {
    return this._http.get(this.contant.TOP_CORRLATE_UNI + "?universityId=" + data).map((res: Response) => res.json());
  }

  saveQuestionAnswer(data): Observable<any> {
    return this.authorizedHttp.post(this.contant.SAVE_QUESTION, data);
  }

  getAllQuestion(): Observable<any> {
    return this._http.get(this.contant.GET_ALL_QUESTION)
      .map((response: Response) => response.json());
  }

  getQuestionDetail(qaId): Observable<any> {
    return this.authorizedHttp.get(this.contant.GET_QUESTION_DETAIL + "?qaId=" + qaId);
  }

  getQuestionByUser(): Observable<any> {
    return this.authorizedHttp.get(this.contant.QUESTIONS_BY_USER);
  }

  getAnwserByQuestion(questionId): Observable<any> {
    return this.authorizedHttp.get(this.contant.ANSWER_BY_QUESTION + "?qaId=" + questionId);
  }

  changeStatusQA(data): Observable<any> {
    return this._http.post(this.contant.CHANGE_STATUS_QUESTION_ANSWER, data)
      .map((response: Response) => response.json());
  }

  updateQA(data): Observable<any> {
    return this._http.post(this.contant.UPDATE_QUESTION_ANSWER, data).map((response: Response) => response.json());
  }

  getCountAnwser(qaId): Observable<any> {
    return this._http.get(this.contant.COUNT_ANSWER + "?qaId=" + qaId)
      .map((response: Response) => response.json());
  }

  voteAnswer(data): Observable<any> {
    return this._http.post(this.contant.VOTE, data)
      .map((response: Response) => response.json());
  }
  reportAnswer(data): Observable<any> {
    return this._http.post(this.contant.REPORT, data).map((res: Response) => res.json());
  }
  getAllReport(): Observable<any> {
    return this._http.get(this.contant.GET_ALL_REPORT).map((res: Response) => res.json());
  }
  deleteReport(data): Observable<any> {
    return this._http.post(this.contant.CHANGE_REPORT_STATUS, data).map((res: Response) => res.json());
  }
  //add more
  getSchool(): Observable<any> {
    return this._http.get(this.contant.GET_SCHOOL).map((res: Response) => res.json());
  }
  getMajor(): Observable<any> {
    return this._http.get(this.contant.MAJOR).map((res: Response) => res.json());
  }
}
