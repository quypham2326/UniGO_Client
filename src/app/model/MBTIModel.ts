export class MBTIQuestion {
  id: number;
  name: string;
  question: string;
  option1: string;
  option2: string;
  MBTIGroup: string;
  isChecked: boolean;
  fullChecked: boolean;

  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.name = data.code;
      this.question = data.questionContent;
      this.option1 = data.option1name;
      this.option2 = data.option2name;
      this.MBTIGroup = data.mbtigroup.mbtigroupName;
      this.isChecked = false;
      this.fullChecked = false;
    }
  }
}
