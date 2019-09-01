export class ValidationModel {
  isValid:boolean;
  fields:any={};
}
export class ToValid {
  originalValue:any;
  toBe:Array<ToBe>;
  isValid:boolean;
}
export class ToBe {
  type:string;
  length?:number;
}
export class ValidationField {

}
export interface StringObject<T> {
  [index:string]: T;
}
