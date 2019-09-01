import {Component, OnChanges, OnInit, SimpleChanges, OnDestroy} from '@angular/core';
import {InqueriesService} from '../../services/inqueries.service';
import {InquiryModel} from '../../shared/models/inquiry.model';
import {Memory} from '../../base/memory';
import {ComponentService} from '../../services/component.service';
import {PackageService} from '../../services/package.service';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {User} from "../../shared/models/user.model";
import {FormData} from "../../public/public-one/public-one.component";
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";

declare let $: any;

@Component({
  selector: 'app-inqueries',
  templateUrl: './inqueries.component.html',
  styleUrls: ['./inqueries.component.scss']
})
export class InqueriesComponent implements OnInit, OnDestroy ,OnChanges{
  // bookInqueries: Array<InquiryModel> = [];
  // visaInqueries: Array<InquiryModel> = [];
  memory = Memory;
  allInqueries: Array<InquiryModel> = [];
  userInqueries: Array<InquiryModel> = [];
  page: number = 1;
  limit: number = 10;
  current: User = new User();
  hasNextPage: boolean = true;
  preloading: boolean = true;
  packageId: string;
  package: any;
  filter: FilterInquery = new FilterInquery();
  inqueryId: string;

  isUser: boolean;
  role:string;

  typeOfFilter = [
    {
      displayName: "Type",
      name: "type",
      icon: "airplanemode_active",
      type: "dropdown",
      data: ['VISAPROCESS', 'BOOK'],
      value: '',
      active: true
    }, {
      displayName: "Status",
      name: "status",
      icon: "airplanemode_active",
      type: "dropdown",
      data: ['PENDING', 'APPROVED', 'REJECTED', 'ESCALATED'],
      value: '',
      active: true
    }, {
      displayName: "Mobile",
      name: "mobile",
      icon: "airplanemode_active",
      type: "string",
      value: '',
      active: true
    }, {
      displayName: "Email",
      name: "email",
      icon: "airplanemode_active",
      type: "string",
      value: '',
      active: true
    }
  ];

  constructor(private inqueriesService: InqueriesService,
              private componentService: ComponentService,
              private auth: AuthService,
              private userService: UserService,
              private activeRoute: ActivatedRoute,
              private packageService: PackageService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }

  ngOnInit() {
    let self2 =this;
    setTimeout(function () {
      self2.preloading=false
    },1500)
    this.isUser = this.auth.getRole() === 'user';
    this.role=this.auth.getRole();
    Memory.setLoading(true);
    this.activeRoute.queryParams.subscribe(params => {
      if (params['id']) {
        this.inqueryId = params['id'];
      }
    });
    if (this.auth.getRole() === 'user') {
      this.inqueriesService.getInqueiesByFilter(`inquirer=${Memory.getUserIdStorage()}`).subscribe((res: any) => {
        Memory.setLoading(false);
        this.allInqueries = res;
      })
    } else if (this.auth.getRole() === 'company') {
      this.inqueriesService.getInqueiesByFilter(`inquirer=${Memory.getUserIdStorage()}`).subscribe((res: any) => {
        Memory.setLoading(false);
        this.allInqueries = res;
      })
    }else if (this.auth.getRole() === 'superadmin') {
      this.inqueriesService.getInqueiesByFilterCheckout(`type=CHECKOUT`).subscribe((res: any) => {
        if (res.result) {
          let self = this;
          Memory.setLoading(false);
          self.allInqueries = self.allInqueries.concat(res.result);
          for(let item of res.result){
            // this.userService.getUserById(item.inquirer).subscribe((user:any)=>{
            item.mobileNo=item.inquirer.mobileNo?item.inquirer.mobileNo:''
            item.email=item.inquirer.email?item.inquirer.email:''
            // })
          }

          // res.docs.forEach(function (item) {
          //   item.type == 'BOOK' ? self.bookInqueries.push(item) : self.visaInqueries.push(item)
          // });
        }else{
          this.hasNextPage=false;
          Memory.setLoading(false);

        }
      })
    } else {
      this.getInqueries();
    }
  }

  getInqueries() {
    if (this.hasNextPage) {
      this.inqueriesService.getInqueiesByFilterPagination(`to=${Memory.getAgencyId()}`, this.page, this.limit).subscribe((res: any) => {
        // this.hasNextPage = res.hasNextPage;
        if (res.result) {
          let self = this;
          Memory.setLoading(false);
          self.allInqueries = self.allInqueries.concat(res.result);
          if (this.inqueryId) {
            for (let item of self.allInqueries) {
              if (item._id === this.inqueryId&&item.type==='VISAPROCESS') {
                this.buttonClicked(item);
              }else if (item._id === this.inqueryId&&item.type==='BOOK') {
                this.editInquery(item)
              }
            }
          }
          for(let item of res.result){
            // this.userService.getUserById(item.inquirer).subscribe((user:any)=>{
              item.mobileNo=item.inquirer.mobileNo?item.inquirer.mobileNo:''
              item.email=item.inquirer.email?item.inquirer.email:''
            // })
          }

          // res.docs.forEach(function (item) {
          //   item.type == 'BOOK' ? self.bookInqueries.push(item) : self.visaInqueries.push(item)
          // });
        }else{
          this.hasNextPage=false;
          Memory.setLoading(false);

        }
      })
    } else {
      Memory.setLoading(false);
    }
  }

  getInqueriesByFilter(filter, type) {
    Memory.setLoading(true);
    this.page = 1;
    this.hasNextPage = true;
    if (type === 'type') {
      this.filter.type1 = true;
      this.filter.type = filter;
    } else {
      this.filter.status = filter;
    }
    let param = '';
    this.config.actions.pagination = false;

    this.filter.type ? param += `type=${this.filter.type}&` : param += '';
    this.filter.status ? param += `status=${this.filter.status}&` : param += '';
    if (!(this.auth.getRole() === 'user')) {
      if (param) {
        this.getByFilter(param)
      } else {
        this.inqueriesService.getInqueiesByFilter(`inquirer=${Memory.getUserIdStorage()}`).subscribe((res: any) => {
          Memory.setLoading(false);
          this.allInqueries = res;
        })
      }
    } else {
      if (param) {
        this.inqueriesService.getInqueiesByFilter(`to=${Memory.getAgencyId()}&inquirer=${Memory.getUserIdStorage()}&${param}`).subscribe((res: any) => {
          Memory.setLoading(false);
          this.allInqueries = res;

        })
      } else {
        this.config.actions.pagination = true;
        this.inqueriesService.getInqueiesByFilter(`to=${Memory.getAgencyId()}&inquirer=${Memory.getUserIdStorage()}`).subscribe((res: any) => {
          Memory.setLoading(false);
          this.allInqueries = res;

        })
      }
    }


  }

  getByFilter(param) {
    this.inqueriesService.getInqueiesByFilter(`inquirer=${Memory.getUserIdStorage()}&${param}`).subscribe((res: any) => {
      Memory.setLoading(false);
      this.allInqueries = res;
    })
  }

  allInquery() {
    this.config.actions.pagination = true;
    Memory.setLoading(true);
    this.filter = new FilterInquery();
    this.allInqueries = [];
    this.hasNextPage = true;
    this.page = 1;
    this.getInqueries();
  }

  // item: InquiryModel, index
  deleteInquery(event) {
    let item: InquiryModel = event.value;
    let index = event.index;
    if (window.confirm('Do you want to delete this inquiry?')) {
      Memory.setLoading(true);
      item.deleted = true;
      this.inqueriesService.deleteInqueryById(item, item._id).subscribe((res: any) => {
        this.allInqueries.splice(index, 1);
        Memory.setLoading(false);
      })
    }
  }

  changeStatus(item: InquiryModel) {
    console.log(item)
    if (item.status === 'APPROVED' && item.mode === 'company') {
      let obj = {
        packageId: item.request,
        userId: Memory.getUserIdStorage(),
        agencyId: Memory.getAgencyId(),
        adultCount: item.details.passengers ? item.details.passengers.length : 1,
        childCount: 0,
        infantCount: 0,
        redirectRoute: 'panel/inqueries'
      };
      // this.packageService.checkValidForBook(obj).subscribe((res:any)=> {
      //   if (res.isSuccessful) {
      item.details.payCheck = true;
      item.is_paid = false;
      this.inqueriesService.changeStatus(item, item._id).subscribe((res: any) => {

      })
      //   }
      // })

    } else {
      this.inqueriesService.changeStatus(item, item._id).subscribe((res: any) => {

      })
    }

  }

  goForPay(item) {
    // console.log(item);
    if(item.details.mode==='custom'){
      let obj={
        details:item.details.componentDetails,
        packageId: item.request,
        id:item._id,
        userId: Memory.getUserIdStorage(),
        agencyId: Memory.getAgencyId(),
        redirectRoute: 'panel/inqueries?id='+item._id
      }


      this.packageService.checkValidForCustomBook(obj).subscribe((res: any) => {
        if (res.isSuccessful) {
          window.location.href=res.result;
        }else{
          const notifyConfig = new NotifyConfig(
              Notify.Type.DANGER,
              Notify.Placement.TOP_CENTER,
              Notify.TEMPLATES.Template2,
              'The package is not valid',
              ''
          );
          Notify.showNotify(notifyConfig);
        }
      })
    }else{
      let obj = {
        packageId: item.request,
        userId: Memory.getUserIdStorage(),
        agencyId: Memory.getAgencyId(),
        adultCount: item.details.passengers ? item.details.passengers.length : 1,
        childCount: 0,
        infantCount: 0,
        redirectRoute: 'panel/inqueries?id='+item._id
      };
      this.packageService.checkValidForBook(obj).subscribe((res: any) => {
        if (res.isSuccessful) {
          window.location.href=res.result;
        }
      })
    }

  }

  getSelectedCount() {
    let count = 0;
    this.allInqueries.forEach(function (item) {
      if (item.selected == true)
        count += 1;
    });
    return count;
  }

  editInquery(item: InquiryModel) {
    Memory.setLoading(true);
    this.packageId = item.request;
    this.getPackages()
  }

  currentInquery: InquiryModel = new InquiryModel();

  imageClicked(inquery) {
    console.log(inquery);
    let user: User = new User();
    user._id = inquery.inquirer._id;
    this.currentInquery = inquery;
    this.userService.getUser(user).subscribe((res: User) => {
      this.current = res;
      $('#from').modal();
      this.inqueriesService.getInqueiesByFilter(`to=${Memory.getAgencyId()}&inquirer=${inquery.inquirer._id}`).subscribe((res: any) => {
        this.userInqueries = res;
      })
    });
  }

  noData: boolean = false;

  getPackages() {
    let query=this.packageId?`&_id=${this.packageId}`:'';
    this.componentService.getPackagesFilter(`associated_agency=${Memory.getAgencyId()}&deleted=none${query}`).subscribe(
        (response:any) => {
          console.log(response)
        if (response.length>0) {
          Memory.setLoading(false);
          this.noData = false;
          response.forEach((v, k) => {
            v['img'] = `https://picsum.photos/900/500?random&t=${Math.random()}`;
            this.getMultipleComponent(v)
          })

        } else {
          Memory.setLoading(false);
          $('#editInquery').modal();
          this.noData = true;
        }
      });
  }

  getMultipleComponent(data) {
    $('#editInquery').modal();
    this.noData = true;
    this.componentService.getMultipleComponent(data).subscribe(
      (response: any) => {
        Memory.setLoading(false);
        if (response) {
          if (data._id === this.packageId) {
            this.noData = false;

            $('#editInquery').modal();
            for (let item of data.externalResources) {
              response.push(item);
            }
            let tmpPackage = {
              packageData: data,
              componentsData: response
            };
            this.package = tmpPackage;

          }
        } else {

        }
      });
  }
  download(url){
    window.open(url,'_blank')
  }


  multipleDelete() {
    if (window.confirm('Do you want to delete this inquiry?')) {
      let inqueries = [];
      let indexes = [];
      this.allInqueries.forEach(function (item, index) {
        if (item.selected == true) {
          item.deleted = true;
          inqueries.push(item._id);
          indexes.push(index)
        }
      });
      let data = {
        id: inqueries,
        objects: {
          deleted: true
        }
      };
      this.inqueriesService.deleteMultipleInquery(data).subscribe((res: any) => {
        if (res.result) {
          this.allInqueries = this.allInqueries.filter(function (value) {
            if (inqueries.indexOf(value._id) === -1) {
              return value;
            }
          });
        }
      })
    }
  }

  currentForm: FormData = new FormData();

  buttonClicked(item) {
    if(this.role==='company'){
      this.goForPay(item)
    }else{
      if (JSON.parse(item.special_inst)) {
        this.currentForm = JSON.parse(item.special_inst);
        $('#form').modal()
      }
    }

  }

  onScroll() {
    Memory.setLoading(true);
    this.page += 1;
    this.getInqueries();
  }

  config = {
    actions: {
      edit: !(this.auth.getRole() === 'user'),
      delete: !(this.auth.getRole() === 'user'),
      pagination: !(this.auth.getRole() === 'user'),
      select: true,
      action: true
    },
    columns: [
      {
        type: 'string',
        title: 'Inquery',
        field: 'type',
        style:{'width':'15%'}
      },{
        type: 'string',
        title: 'MobileNo',
        field: 'mobileNo',
        style:{'width':'15%'}
      },{
        type: 'string',
        title: 'Email',
        field: 'email',
        style:{'width':'20%'}
      }, {
        type: !(this.auth.getRole() === 'user' || this.auth.getRole() === 'company') ? 'dropdown' : 'string',
        title: 'Status',
        field: 'status',
        data: ['PENDING', 'APPROVED', 'REJECTED', 'ESCALATED'],
        style:{'width':'15%'}
      }, {
        type: 'image',
        title: 'From',
        field: 'inquirer',
        style:{'width':'10%'}
      }, {
        type: 'button',
        title: 'Form Data',
        field: 'type',
        style:{'width':'10%'}
      }
    ]
  };
  config1 = {
    actions: {
      edit: false,
      delete: false,
      pagination: false,
      select: false,
      action: false
    },
    columns: [
      {
        type: 'string',
        title: 'Inquery',
        field: 'type',
        style:{'width':'40%'}
      },
      {
        type: 'string',
        title: 'Status',
        field: 'status',
        data: ['PENDING', 'APPROVED', 'REJECTED', 'ESCALATED'],
        style:{'width':'45%'}
      }
    ]
  }
  configCompany = {
    actions: {
      edit: false,
      delete: false,
      pagination: false,
      select: false,
      action: false
    },
    columns: [
      {
        type: 'string',
        title: 'Inquery',
        field: 'type',
        style:{'width':'25%'}
      }, {
        type: 'string',
        title: 'Status',
        field: 'status',
        data: ['PENDING', 'APPROVED', 'REJECTED', 'ESCALATED'],
        style:{'width':'25%'}
      }, {
        type: 'button',
        title: 'Payment',
        field: 'is_paid',
        attrType:Boolean,
        style:{'width':'35%'}
      }
    ]
  }
  configSuperAdmin = {
    actions: {
      edit: false,
      delete: false,
      pagination: false,
      select: false,
      action: false
    },
    columns: [
      {
        type: 'string',
        title: 'Inquery',
        field: 'type',
        style:{'width':'15%'}
      },{
        type: 'string',
        title: 'Amount',
        field: 'special_inst',
        style:{'width':'20%'}
      },{
        type: 'string',
        title: 'Email',
        field: 'email',
        style:{'width':'20%'}
      },{
        type: 'string',
        title: 'mobileNo',
        field: 'mobileNo',
        style:{'width':'20%'}
      }, {
        type: 'dropdown',
        title: 'Status',
        field: 'status',
        data: ['PENDING', 'APPROVED', 'REJECTED', 'ESCALATED'],
        style:{'width':'20%'}
      }
    ]
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    Memory.setLoading(false);
    $('#form').modal('hide');
    $('#from').modal('hide');
    $('#editInquery').modal('hide');
  }

  query: string = '';


  search(event) {
    console.log(event)
    this.query = '';
    this.page=1;

    if (event.query.length > 0) {
      for (let item of event.query) {
          this.query += `&${item.name}=${item.value}`
      }
      Memory.setLoading(true);
      this.config.actions.pagination = false;
      this.inqueriesService.getInqueiesByFilterPagination(`to=${Memory.getAgencyId()}${this.query?this.query:''}`,this.page,this.limit).subscribe((res: any) => {
        Memory.setLoading(false);
        if(res.isSuccessful){
          console.log(res.result)
          // this.allInqueries = res;
          let self=this;
          res.result.forEach(function (sub, index) {
            sub.mobileNo=sub.inquirer.mobileNo?sub.inquirer.mobileNo:'';
            sub.email=sub.inquirer.email?sub.inquirer.email:'';
          })
          this.allInqueries=res.result;

        }


      })
    } else {
      this.config.actions.pagination = true;
      this.page = 1;
      this.hasNextPage = true;
      this.getInqueries();
    }
  }


}

export class FilterInquery {
  type: string;
  type1: boolean;
  status1: boolean;
  status: string;
}
