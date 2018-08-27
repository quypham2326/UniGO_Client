export class Answer {
  id: number;
  content: string;
  lastUpdatedTime: string;
  parentId: number;
  userId: number;
  userName: string;
  userImage: string;
  vote: number = 0;
  isEdit: boolean;
  report: number = 0;
  constructor(data: any) {
    if (data) {
     this.id = data.id;
     this.content = data.content;
     this.lastUpdatedTime = data.lastUpdatedTime;
     this.parentId = data.parentId;
     this.userId = data.users.id;
     if(data.users.name){
       this.userName = data.users.name;
     }else{
       this.userName = data.users.username;
     }
     if(data.users.image){
       this.userImage = data.users.image;
     }else{
       this.userImage = '../../../assets/image/avatar-default.jpg';
     }
     this.vote = data.vote;
     this.report = data.numberOfReport;
     this.isEdit = false;
    }
  }
}
