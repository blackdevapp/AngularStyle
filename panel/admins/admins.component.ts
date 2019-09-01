import {Component, ElementRef, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { AgenciesService} from '../../services/agencies.service';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatAutocomplete, MatChipInputEvent} from "@angular/material";
import {AgencyImplement} from "../../local-forms/agency/agency.component";
declare let $:any;

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit,OnDestroy {
	agencies = [];
  agency:AgencyImplement=new AgencyImplement();
  constructor(private agenciesService:AgenciesService) { }
  mode:string ='B';
  tel:string;
  mob:string;
  fax:string;
  mail:string;
  rep:string;
  page:number=0;
  limit:number=10;
  address:string;
  visible = true;
  selectable = true;
  hasNext = true;
  removable = true;
  addOnBlur = true;
  loading:boolean=false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  query:Array<any>=[];

  current:AgencyImplement=new AgencyImplement();

  typeOfFilter= [
    {
      displayName: "Company Name",
      name: "company_name",
      icon: "airplanemode_active",
      type: "string",
      value: '',
      active: true
    },
    {
      displayName: "Website",
      name: "website",
      icon: "hotel",
      type: "string",
      value: '',
      active: true
    },
    {
      displayName: "Telephone",
      name: "telephone_number",
      icon: "hotel",
      type: "array",
      value: '',
      active: true
    },{
      displayName: "Mobile",
      name: "mobile_number",
      icon: "hotel",
      type: "array",
      value: '',
      active: true
    },{
      displayName: "Fax",
      name: "fax_number",
      icon: "hotel",
      type: "array",
      value: '',
      active: true
    },{
      displayName: "Email",
      name: "email_address",
      icon: "hotel",
      type: "array",
      value: '',
      active: true
    },
    {
      displayName: "City",
      name: "city",
      icon: "hotel",
      type: "string",
      value: '',
      active: true
    }
  ]
  ngOnInit() {
    this.loading=true
  	this.getAgencies();
  	this.mode='B';
  }
  getAgencies(){
    this.page++;
    if(this.hasNext){
      this.agenciesService.getFilterAgency(this.query,this.page,this.limit).subscribe(
        (response:any) => {
          if (response) {
            this.loading=false;
            this.agencies = this.agencies.concat(response.docs);
            this.hasNext=response.hasNextPage;
          }
        });
    }

  }
  register(event){
    this.agency=new AgencyImplement();
    this.current=event;
    $('#myModal').modal('toggle');
    $('#newAgency').modal()

  }
  addNewAgency(){
    this.agency=new AgencyImplement();


  }

  save(item,agency){
    this.agenciesService.editAgencies(item).subscribe((res:any)=>{
      agency.editable=false;
      item.editable=false;
      this.page=0;
      this.agencies=[];
      this.loading=true;
      this.getAgencies()

    })
  }
  agencyTemp:any;
  edit(agency){
    this.agencyTemp=Object.assign({},agency)
  }


  search(event){
    this.query=event.query;
    this.loading=true;
    this.page=1;
    this.agenciesService.getFilterAgency(event.query,this.page,this.limit).subscribe((res:any)=>{
      this.loading=false;
      this.agencies = res.docs;
    },err=>{
      this.loading=false;
      this.agencies=[];
    })
  }
  add(event: MatChipInputEvent,field){
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.agencyTemp[field].push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    // if(this.tel){
    //   this.agencyTemp.telephone_number.push(this.tel);
    //   this.tel=''
    // }
  }
  goTo(link){
    window.open(link,'_blank')
  }


  ngOnDestroy(){
    $('#myModal').modal('hide')
    $('#newAgency').modal('hide')
  }

}
