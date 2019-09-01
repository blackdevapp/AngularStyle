export class InquiryModel {
  _id?: string;
  name?:  string;
  email: string;
  mobileNo: string;
  inquiry: string;
  deleted: Boolean;
  inquirer: string;
  request: string;
  special_inst: string;
  status: string;
  mode: string;
  details:any;
  to: string;
  is_paid:boolean;
  type: string; //BOOK
  selected:Boolean;
}
