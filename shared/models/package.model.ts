export class Package {
  _id?: String;
  components: any;
  remarks: String;
  favorited: number = 0;
  bought: number = 0;
  images: Array<string>;
  associated_agency:string;
  creator:string;
  pair:string;

}
