import { Injectable } from "@angular/core";

@Injectable()
export class Constants {
  public HTTP = 'http://';
  public SERVER_IP = 'localhost';
  public SERVER_PORT = ':8080';
  public SERVER_PATH = '/unistart';
  public CLIENT_PORT = ':4200';
  public SERVER_NAME = this.HTTP + this.SERVER_IP + this.SERVER_PORT + this.SERVER_PATH;

  // API
  public USER_INFO = this.SERVER_NAME + "/user";
  public LOGIN_URL = this.SERVER_NAME + "/login";
  public REGISTER = this.SERVER_NAME + "/user/register";
  public UNIVERSITY = this.SERVER_NAME + "/university/show-university";
  public MAJOR = this.SERVER_NAME + "/university/show-major";
  public LOCATION = this.SERVER_NAME + "/location/show-location";
  public BLOCK = this.SERVER_NAME + "/block/get-all-block";
  public SEARCH = this.SERVER_NAME + "/university/search";
  public CREATE_UNIVESITY = this.SERVER_NAME + "/university/create";
  public UPDATE_UNIVESITY = this.SERVER_NAME + "/university/update";
  public UPDATE_LOCATION_MAJOR = this.SERVER_NAME + "/university/update-location-major";
  public REMOVE_MAJOR_UNI = this.SERVER_NAME + "/university/remove-major-uni";
  public GET_UNI_BY_ID = this.SERVER_NAME + "/university/get-university";
  public MBTI = this.SERVER_NAME + "/mbti/show-mbti-question";
  public SAVE_MBTI_RESULT = this.SERVER_NAME + "/mbti/save-mbti-result";
  // public GET_MBTI_MAJOR = this.SERVER_NAME +"/mbti/get-mbti-major";
  public GET_MBTI_RESULT = this.SERVER_NAME + "/mbti/get-mbti-results";
  public DELETE_UNIVERSITY = this.SERVER_NAME + "/university/delete";
  public UPDATE_SCORE = this.SERVER_NAME + "/score/save-score";
  public GET_TOP_THREE = this.SERVER_NAME + "/university/get-by-group";
  public SAVE_REVIEW = this.SERVER_NAME + "/review/save-review";
  public GET_REVIEW_BY_UNI_ID = this.SERVER_NAME + "/review/show-review";
  public GET_STAR_POINT = this.SERVER_NAME + "/review/star-point";
  public GET_NUMBER_REVIEW_NEED_APPROVE = this.SERVER_NAME + "/review/number-need-accept-review";
  public GET_REVIEW_NEED_APPROVE = this.SERVER_NAME + "/review/need-accept-review";
  public SAVE_MAJOR_UNI_DETAIL = this.SERVER_NAME + "/university/save-detail-major";
  public DELETE_BLOCK_SCORE = this.SERVER_NAME + "/score/delete-block-score";
  public FIND_BY_MAJOR_ID = this.SERVER_NAME + "/university/find-by-major-id";
  public CHANGE_REVIEW_STATUS = this.SERVER_NAME + "/review/change-review-status";
  public STAR_REIVEW_MAJOR = this.SERVER_NAME + "/review/star-review-major";
  public SAVE_REVIEW_MAJOR_UNI = this.SERVER_NAME + "/review/save-review-major-uni";
  public CHECK_REVIEWED_UNI_MAJOR = this.SERVER_NAME + "/review/check-reviewed-uni-major";
  public CHECK_REVIEWED_UNI = this.SERVER_NAME + "/review/check-reviewed-uni";
  public TOP_CORRLATE_UNI = this.SERVER_NAME + "/corrlate/top-corrlate-uni";
  public GET_MAJOR_UNIVERSITY = this.SERVER_NAME + "/university/get-major-uni";
  public GET_FOR_TAG = this.SERVER_NAME + "/university/get-major-for-tag";
  public GET_LOCATION_UNIVERSITY = this.SERVER_NAME + "/university/get-location-by-uni";
  public GET_UIVERSITY_BY_LOCATION = this.SERVER_NAME + "/university/get-uni-by-location";
  public GET_UIVERSITY_BY_MAJOR = this.SERVER_NAME + "/university/get-by-major-id";
  public GET_BY_LOCATION_AND_MAJOR = this.SERVER_NAME + "/university/get-by-location-and-major";
  public TOP_UNI_MBTI = this.SERVER_NAME + "/corrlate/top-uni-mbti";
  public SAVE_ARTICLE = this.SERVER_NAME + "/article/save-article";
  public SHOW_ARTICLE = this.SERVER_NAME + "/article/show-article";
  public DELETE_ARTICLE = this.SERVER_NAME + "/article/delete";
  public GET_ARTICLE_BY_ID = this.SERVER_NAME + "/article/get-article-by-id";
  public UPDATE_ARTICLE = this.SERVER_NAME + "/article/update";
  public GET_NEWEST_ARTICLE = this.SERVER_NAME + "/article/get-newest-article";
  public SAVE_QUESTION = this.SERVER_NAME + "/qa/save";
  public GET_ALL_QUESTION = this.SERVER_NAME + "/qa/questions";
  public GET_QUESTION_DETAIL = this.SERVER_NAME + "/qa/view";
  public QUESTIONS_BY_USER = this.SERVER_NAME + "/qa/questions-by-user";
  public ANSWER_BY_QUESTION = this.SERVER_NAME + "/qa/answer-by-question";
  public CHANGE_STATUS_QUESTION_ANSWER = this.SERVER_NAME + "/qa/change-question-status";
  public GET_NUMBER_QUESTION_NEED_APPROVE = this.SERVER_NAME + "/qa/number-question-need-accept";
  public QUESTION_NEED_TO_APPROVE = this.SERVER_NAME + "/qa/question-need-accept";
  public UPDATE_QUESTION_ANSWER = this.SERVER_NAME + "/qa/update";
  public COUNT_ANSWER = this.SERVER_NAME + "/qa/count-answer";
  public GET_TAG_QUESTION = this.SERVER_NAME + "/qa/get-tag-question";
  public VOTE = this.SERVER_NAME + "/vote/save";
  public GET_TAG_ARTICLE = this.SERVER_NAME + "/article/get-tag-article";
  public SAVE_FAVORITE = this.SERVER_NAME + "/favorite/save-favorite";
  public CHECK_FAVORITE = this.SERVER_NAME + "/favorite/check-favorite";
  public DELETE_FAVORITE = this.SERVER_NAME + "/favorite/delete";
  public GET_YOUR_ARTICLE = this.SERVER_NAME + "/article/get-your-article";
  public GET_USER_FAVORITE = this.SERVER_NAME + "/favorite/get-user-favorite";
  public GET_ALL_TAG = this.SERVER_NAME + "/qa/get-all-tag";
  public REPORT = this.SERVER_NAME + "/report/save";
  public GET_ALL_REPORT = this.SERVER_NAME + "/qa/get-all-report";
  public CHANGE_REPORT_STATUS = this.SERVER_NAME + "/qa/change-report-status";
  public NUMBER_REPORT = this.SERVER_NAME + "/qa/number-report";

  // ADD MORE
  public GET_TOP5_MAJOR = this.SERVER_NAME + "/university/get-popular-major";
  public GET_SCHOOL = this.SERVER_NAME + "/university/top10";
  public FILTER_SCHOOL = this.SERVER_NAME + "/university/search";

  //ERROR
  public UNAUTHORIZED = 401;
  public CONFLICT = 409;
  public NOT_FOUND = 404;
  public INTERNAL_SERVER_ERROR = 500;

  public QUESTION = 1;
  public ANWSER = 2
  constructor() { }
}
