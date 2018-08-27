export class University {
  id: number;
  name: string;

  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      }
    }
}
