import {Component, OnInit, ViewChild} from '@angular/core';
import {VisaService} from "../../services/visa.service";
import {AgenciesService} from "../../services/agencies.service";
import {Memory} from "../../base/memory";
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  mode = 'list';
  searchResult;
  visaRequire:boolean=false;
  visaProcess = {
    passport: '',
    visa: '',
    passportName: '',
    visaName: '',
  };
  loader: boolean = false;
  preloading: boolean = true;
  form: Form = new Form();
  forms: Array<FormData> = [];
  currentItem: FormItem = new FormItem();
  dropData = [
    {
      operatorName: 'addForm',
      displayName: 'Add Form',
      icon: 'add',
      description: 'Add Manual Form'
    },
    {
      operatorName: 'listForm',
      displayName: 'List Form',
      icon: 'list',
      description: 'List of Form'
    }
  ]
  @ViewChild('stepper') stepper;
  firstFormGroup: FormGroup;

  constructor(private agenciesService: AgenciesService,
              private visaService: VisaService,
              private _formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.getForms();
    this.firstFormGroup = this._formBuilder.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
    });
      let self2 =this;
      setTimeout(function () {
          self2.preloading=false
      },1500)
  }

  passport(event) {
    this.visaProcess.passportName = event.option.value;
    // console.log(1,this.visaProcess.passportName,this.searchResult);
    for (let item of this.searchResult) {
      if (this.visaProcess.passportName == item.official_name_en) {
        // console.log(2,item['ISO3166-1-Alpha-3']);
        this.visaProcess.passport = item['ISO3166-1-Alpha-3']
        this.searchResult=[];
        if(this.visaProcess.visa){
          this.getPassportInfo(this.visaProcess.passport);
        }

      }
    }
  }
  loading:boolean=false;
  getPassportInfo(passport) {
    this.loading=true;
    this.visaRequire=false;

    let query = `holder=${passport}`;
    this.visaService.getPassportInfo(query).subscribe(passport1 => {
      if (passport1) {
        this.loading=false;
        let result = passport1[0].data[this.visaProcess.visa];
        if (this.visaService.visa[result]) {
          this.visaRequire=true;
        }else{
          this.visaRequire=false

        }
      }
    });
  }

  visa(event) {
    this.visaProcess.visaName = event.option.value;
    // console.log(1,this.visaProcess.visaName);
    for (let item of this.searchResult) {
      if (this.visaProcess.visaName == item.official_name_en) {
        // console.log(2,item['ISO3166-1-Alpha-3']);
        this.visaProcess.visa = item['ISO3166-1-Alpha-3']
        this.searchResult=[];
        this.getPassportInfo(this.visaProcess.passport);

      }
    }

  }

  getForms() {
    this.mode = 'list';
    this.update = false;
    this.form = new Form();
    this.agenciesService.getAllForm().subscribe((res: any) => {
      // res.result[0].forms.forEach(function (item) {
      // item.form=JSON.parse(item.form)
      // item.form = item.form
      // });
      this.forms = res.result[0].forms;
      for(let item of this.forms){
        item.price=item.form.price;
      }
    });
  }


  getCountries(input) {
    this.loader = true;
    this.searchResult = []

    this.visaService.autoSuggestionCountries(input).subscribe(
        (response:any) => {
        this.loader = false;
        if (response) {
          this.searchResult = response;
          let self=this;
          this.searchResult.forEach(function (item, index) {
            console.log(item['official_name_en'],self.visaProcess.visaName)
            if(item['ISO3166-1-Alpha-3']===self.visaProcess.passport){
              self.searchResult.splice(index,1);
            }
          })
        }
      });
  }

  indexTracker(index: number, value: any) {
    return index;
  }

  checkData():boolean{
    for(let item of this.currentItem.data){
      if(item.length>0){
        return true;
      }
    }
    return false
  }

  addToForm() {
    if(this.currentItem.type=='Checkbox'||this.currentItem.type=='Radio'){
      if(this.checkData()){
        this.form.items.push(this.currentItem);
        this.currentItem = new FormItem();
      }else{
        const notifyConfig = new NotifyConfig(
            Notify.Type.DANGER,
            Notify.Placement.TOP_CENTER,
            Notify.TEMPLATES.Template2,
            'option cannot be empty',
            ''
        );
        Notify.showNotify(notifyConfig);
      }
    }else{
      this.form.items.push(this.currentItem);
      this.currentItem = new FormItem();
    }

  }

  submit() {
    if (!this.update) {
      let formDto = {
        agency_id: Memory.getAgencyId(),
        form: {
          name: `${this.visaProcess.passport}-${this.visaProcess.visa}`,
          displayName: `${this.visaProcess.passportName}-${this.visaProcess.visaName}`,
          form: this.form,
          price:this.form.price,
          currency:Memory.getActiveCurrency()
        }
      };
      this.agenciesService.insertForm(formDto).subscribe((res: any) => {
        // this.mode = 'list';
        this.stepper.selectedIndex = 0;
        this.mode='list';
        this.form = new Form();
        this.getForms();
        this.visaProcess = {
          passport: '',
          visa: '',
          passportName: '',
          visaName: '',
        };
        const notifyConfig = new NotifyConfig(
          Notify.Type.SUCCESS,
          Notify.Placement.TOP_CENTER,
          Notify.TEMPLATES.Template2,
          'Form Successfully Created!!!',
          ''
        );
        Notify.showNotify(notifyConfig);
      });
    }
    else {
      this.stepper.selectedIndex = 0;
      this.mode='list';

      for (let item of this.forms) {
        if (item.name == this.visaProcess.passport + '-' + this.visaProcess.visa) {
          item.form = this.form;
          item.form.price=this.form.price;
          item.form.currency=this.form.currency;
        }
      }

      this.agenciesService.editAgencyForms(this.forms).subscribe((res: any) => {
        if (res.isSuccessful) {
          this.visaProcess = {
            passport: '',
            visa: '',
            passportName: '',
            visaName: '',
          };
          const notifyConfig = new NotifyConfig(
            Notify.Type.SUCCESS,
            Notify.Placement.TOP_CENTER,
            Notify.TEMPLATES.Template2,
            'Form Successfully Updated!!!',
            ''
          );
          Notify.showNotify(notifyConfig);
          this.getForms()
        } else {
          const notifyConfig = new NotifyConfig(
            Notify.Type.DANGER,
            Notify.Placement.TOP_CENTER,
            Notify.TEMPLATES.Template2,
            'Error has been occured!!!',
            ''
          );
          Notify.showNotify(notifyConfig);
        }
      })

    }

  }

  deleteForm(event) {
    if (window.confirm('Are you sure to want delete this form?')) {
      this.forms.splice(event.index, 1);
      this.agenciesService.editAgencyForms(this.forms).subscribe((res: any) => {
        if (res.isSuccessful) {

        } else {

        }
      })
      console.log(event);
    }

  }

  dropClicked(event) {
    if (event.operatorName == 'addForm') {
      this.firstFormGroup.reset();
      this.visaProcess = {
        passport: '',
        visa: '',
        passportName: '',
        visaName: '',
      };
      this.visaRequire=true;
      if(this.mode=='B'||this.mode=='C'){
        if(window.confirm('Are you sure you want to create new Form?')){
          this.mode = 'A';
          this.form = new Form();
          this.visaProcess = {
            passport: '',
            visa: '',
            passportName: '',
            visaName: '',
          };
        }
      }else{
        this.mode = 'A';
        this.stepper.reset();
        this.form = new Form();
        this.visaProcess = {
          passport: '',
          visa: '',
          passportName: '',
          visaName: '',
        };
      }

    } else {
      this.mode = 'list';
      this.getForms();
    }
  }

  update: boolean = false;

  editForm(event) {
    this.mode = 'A';
    this.update = true;
    this.form = event.form;
    // console.log(this.stepper)
    this.visaProcess.passport = event.name.split('-')[0];
    this.visaProcess.visa = event.name.split('-')[1];
    this.visaProcess.passportName = event.displayName.split('-')[0];
    this.visaProcess.visaName = event.displayName.split('-')[1];
    let self=this;
    setTimeout(function () {
      self.stepper.selectedIndex=1;
    },500)
  }
  goToStep2(){
    if(this.visaProcess.visa===this.visaProcess.passport){
      const notifyConfig = new NotifyConfig(
        Notify.Type.DANGER,
        Notify.Placement.TOP_CENTER,
        Notify.TEMPLATES.Template2,
        'you may not duplicate country pairs for smart visa, consider removing previous pair before doing such action',
        ''
      );
      Notify.showNotify(notifyConfig);
    }else{
      this.stepper.next();
    }
  }
  goToStep3(){
    if(!this.checkValidRequirements()){
      const notifyConfig = new NotifyConfig(
        Notify.Type.DANGER,
        Notify.Placement.TOP_CENTER,
        Notify.TEMPLATES.Template2,
        'Role cannot be empty',
        ''
      );
      Notify.showNotify(notifyConfig);
    }else{
      this.stepper.next();
    }
  }

  checkValidRequirements():boolean{
    for (let item of this.form.roles) {
      if(item.length===0){
        return false
      }
    }
    return true
  }

  checkSideBarSize() {
    return !!$('.sidebar.small').index() ? 'small-card' : 'large-card';
  }

  config = {
    actions: {
      edit: true,
      delete: true,
      pagination: false,
      select: false,
      action:true
    },
    columns: [
      {
        type: 'string',
        title: 'Form Title',
        field: 'displayName',
        style:{'width':'40%'}
      }, {
        type: 'string',
        title: 'Price',
        field: 'price',
        style:{'width':'30%'}
      }
    ]
  }

}

export class Form {
  items: Array<FormItem> = [];
  roles: Array<string> = [''];
  price:string;
  currency:string;

}

export class FormItem {
  type: string; //Checkbox,Radio,Attachment,Input,DatePicker
  data: Array<string> = [''];
  value: any;
  label: string;
}

export class FormData {
  form: any;
  name: string;
  price:string;
  currency:string;
}
