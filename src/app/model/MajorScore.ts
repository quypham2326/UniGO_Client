export class MajorScore {
  private id;
  private blockName;
  private scoreHistories = [] ;
  private year;
  constructor(data: any) {
    if(data.id){
      this.id = data.id;
    }
    if (data.block.blockName) {
      this.blockName = data.block.blockName;
    }
    if(data.scoreHistories){
      this.scoreHistories.push(data.scoreHistories);
    }
  }
}
