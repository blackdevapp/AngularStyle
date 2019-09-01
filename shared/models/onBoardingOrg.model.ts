export class OnBoardingOrgModel {
  _id:string;
  company_name:string;
  city:string;
  onboarded:boolean=false;
  deleted:boolean=false;
  logo:string;
  official_representative:string;
  alternative_representative:string[];
  telephone_number:string[];
  mobile_number:string[];
  fax_number:string[];
  email_address:string[];
  social_media:any[];
  taxIdentificationNo:string;
  bancAccounts:any[];
  members:any[];
}
