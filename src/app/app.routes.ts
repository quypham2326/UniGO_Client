import { Routes, RouterModule } from '@angular/router';
import { ReviewRatingComponent } from './component/review-rating/review-rating.component';
import { CompanyDetailComponent } from './component/university-detail/company-detail.component';
import { CheckLoginGuard } from './guard/check-login/check-login.guard';
import { MbtiTestComponent } from './component/mbti-test/mbti-test.component';
import { HomeComponent } from "./component/home/home.component";
import { SearchComponent } from "./component/search/search.component";
import { UserDetailComponent } from './component/user-detail/user-detail.component'
import { HeaderComponent } from "./component/header/header.component";
import { AdminComponent } from "./component/admin/admin.component";
import { ListuniversityComponent } from "./component/admin/listuniversity/listuniversity.component";
import { AdduniversityComponent } from "./component/admin/adduniversity/adduniversity.component";
import { NewReviewComponent } from "./component/new-review/new-review.component";
import { EditUniversityComponent } from "./component/admin/edit-university/edit-university.component";
import { ViewMajorUnversityComponent } from "./component/search/view-major-unversity/view-major-university.component";
import { EditScoreComponent } from "./component/admin/edit-major-detail/edit-score.component";
import { CheckRoleGuard } from "./guard/check-role/check-role.guard";
import { ApproveReivewComponent } from "./component/admin/approve-reivew/approve-reivew.component";
import { EditMajorComponent } from "./component/admin/edit-major/edit-major.component";
import { MajorDetailComponent } from "./component/major-detail/major-detail.component";
import { QuestionComponent } from "./component/question-anwser/question/question.component";
import { QuestionDetailComponent } from "./component/question-anwser/question-detail/question-detail.component";
import { NewQuestionComponent } from "./component/question-anwser/new-question/new-question.component";
import { YourQuestionComponent } from "./component/question-anwser/your-question/your-question.component";
import { AddArticleComponent } from "./component/admin/add-article/add-article.component";
import { ListArticleComponent } from "./component/admin/list-article/list-article.component";
import { ArticleComponent } from "./component/article/article.component";
import { EditArticleComponent } from "./component/admin/edit-article/edit-article.component";
import { ArticleDetailComponent } from "./component/article-detail/article-detail.component";
import { EditQuestionComponent } from "./component/question-anwser/edit-question/edit-question.component";
import { UserFavoriteComponent } from "./component/user-favorite/user-favorite.component";
import { ApproveQuestionComponent } from "./component/admin/approve-question/approve-question.component";
import { ListReportComponent } from "./component/admin/list-report/list-report.component";

const routing: Routes = [
  {
    path: '', component: HeaderComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'university/:id', component: CompanyDetailComponent },
      { path: 'new-review', component: NewReviewComponent },
      { path: 'search-university', component: SearchComponent },
      { path: 'app-view-major-university/:id', component: ViewMajorUnversityComponent },
      { path: 'review-rating/:id', component: ReviewRatingComponent },
      { path: 'new-review/:id', component: NewReviewComponent, canActivate: [CheckLoginGuard, CheckRoleGuard] },
      { path: 'major-detail/:id', component: MajorDetailComponent },
      { path: 'mbti-test', component: MbtiTestComponent, canActivate: [CheckLoginGuard, CheckRoleGuard] },
      { path: 'profile', component: UserDetailComponent, canActivate: [CheckLoginGuard] },
      { path: 'question', component: QuestionComponent },
      { path: 'favorite', component: UserFavoriteComponent },
      { path: 'question-detail/:id', component: QuestionDetailComponent },
      { path: 'edit-question/:id', component: EditQuestionComponent },
      { path: 'new-question', component: NewQuestionComponent, canActivate: [CheckLoginGuard, CheckRoleGuard] },
      { path: 'your-question', component: YourQuestionComponent, canActivate: [CheckLoginGuard, CheckRoleGuard] },
      { path: 'article', component: ArticleComponent },
      { path: 'article-detail/:id', component: ArticleDetailComponent },
    ]
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [CheckLoginGuard, CheckRoleGuard],
    children: [
      { path: 'list-university', component: ListuniversityComponent },
      { path: 'add-university', component: AdduniversityComponent },
      { path: 'edit-university/:id', component: EditUniversityComponent },
      { path: 'edit-detail-major/:id', component: EditScoreComponent },
      { path: 'edit-major/:id', component: EditMajorComponent },
      { path: 'approve-reivew', component: ApproveReivewComponent },
      { path: 'approve-question', component: ApproveQuestionComponent },
      { path: 'list-article', component: ListArticleComponent },
      { path: 'add-article', component: AddArticleComponent },
      { path: 'edit-article/:id', component: EditArticleComponent },
      { path: 'list-report', component: ListReportComponent },
    ]
  },

];
export const appRoutes = RouterModule.forRoot(routing);
