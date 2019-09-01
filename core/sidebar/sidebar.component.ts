import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {Memory} from "../../base/memory";
import {UserService} from "../../services/user.service";
import {InqueriesService} from "../../services/inqueries.service";
import {AppSettings} from '../../app.setting'

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

const prvillages=['admin','encoder','agent','user','van-driver','tour-guide','company','superadmin']
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  allInqueries: any[]=[];
  menuItems: any[];
  role:string;
  inqueryCount:number;
  page: number = 1;
  limit: number = 5;
  searchInput: string;
  searchResult: Array<any> = [];
  search: Array<any> = [
    {path: 'panel/dashboard', title: 'Dashboard'},
    // {path: 'panel/component', title: 'Component'},
    {path: 'panel/packages', title: 'Itinerary'},
    {path: 'panel/marketing', title: 'Marketing'},
    {path: 'panel/formBuilder', title: 'Smart Visa'},
    {path: 'panel/inqueries', title: 'Inqueries'},
    {path: 'panel/profile', title: 'Profile'},
    {path: 'panel/admin', title: 'Admin'},
    {path: 'panel/serverLogs', title: 'Server Logs'},
  ];
  accessTypes = {
     dashboard: ['admin','agent'],
     // component: ['admin','encoder','agent'],
     formBuilder: ['admin','encoder','agent'],
     packages: ['admin','agent','encoder','van-driver','company'],
     inqueries: ['admin','agent','user','company','superadmin'],
     profile: ['admin','encoder','agent','user','van-driver','tour-guide','company'],
     admin: ['superadmin'],
     accounting: ['admin','agent'],
     marketing: ['admin'],
     serverLogs: ['superadmin'],
    }
    ROUTES: RouteInfo[]

  constructor(
    private authService:AuthService,
    private router:Router,
    private auth:AuthService,
    private userService:UserService,
    private inqueriesService:InqueriesService
    ) {
       this.ROUTES= [
          Memory.getPermission()?(Memory.getPermission()['dashboard']==true?{ path: 'dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' }:undefined):{ path: 'dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
          Memory.getPermission()?(Memory.getPermission()['itinerary']==true?{ path: 'packages', title: 'Itinerary',  icon:'person', class: '' }:undefined):{ path: 'packages', title: 'Itinerary',  icon:'person', class: '' },
          Memory.getPermission()?(Memory.getPermission()['inquries']==true?{ path: 'inqueries', title: 'Inqueries',  icon:'compare_arrows', class: '' }:undefined):{ path: 'inqueries', title: 'Inqueries',  icon:'compare_arrows', class: '' },
          Memory.getPermission()?(Memory.getPermission()['accounting']==true?{ path: 'accounting', title: 'Accounting',  icon:'sentiment_satisfied_alt', class: '' }:undefined):{ path: 'accounting', title: 'Accounting',  icon:'sentiment_satisfied_alt', class: '' },
          Memory.getPermission()?(Memory.getPermission()['marketing']==true?{ path: 'marketing', title: 'Marketing',  icon:'group_work', class: '' }:undefined):{ path: 'marketing', title: 'Marketing',  icon:'group_work', class: '' },
          Memory.getPermission()?(Memory.getPermission()['smartVisa']==true?{ path: 'formBuilder', title: 'Smart Visa',  icon:'person', class: '' }:undefined):{ path: 'formBuilder', title: 'Smart Visa',  icon:'person', class: '' },
          // { path: 'component', title: 'Component',  icon:'content_paste', class: '' },
          // { path: 'packages', title: 'Itinerary',  icon:'person', class: '' },
          // { path: 'inqueries', title: 'Inqueries',  icon:'compare_arrows', class: '' },
          // { path: 'marketing', title: 'Marketing',  icon:'group_work', class: '' },
          // { path: 'formBuilder', title: 'Smart Visa',  icon:'person', class: '' },
          // AppSettings.HAS_ACCOUNTING ? { path: 'accounting', title: 'Accounting',  icon:'sentiment_satisfied_alt', class: '' }: undefined,
          { path: 'admin', title: 'Admin',  icon:'sentiment_satisfied_alt', class: '' },
          { path: 'profile', title: 'Profile',  icon:'perm_identity', class: '' },
          { path: 'serverLogs', title: 'Server Logs',  icon:'perm_identity', class: '' },
      ];
  }


  ngOnInit() {
    this.getInqueries();
    this.role=this.authService.getRole();
    this.menuItems = this.ROUTES.filter(menuItem => menuItem);
    // this.goNavigate('dashboard')
  }
  goNavigate(route){
    this.router.navigate([route])
  }
  hasAccess(menuItem){
    let role = this.authService.getRole(), //admin
        finalReply = false;
    (this.accessTypes[menuItem.path].indexOf(role) >= 0) ? finalReply = true : finalReply = false;
    return finalReply;
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  goToInquery(id){
    this.router.navigate(['panel/inqueries'],{queryParams:{id:id}})
  }

  getInqueries(){
    this.getCount();
    if(this.auth.getRole()==='user'){
      this.inqueriesService.getInqueiesByFilter(`to=${Memory.getAgencyId()}&inquirer=${Memory.getUserIdStorage()}`).subscribe((res:any)=>{
        this.allInqueries=res;


      })
    }else{
      this.inqueriesService.getAllInqueries(Memory.getAgencyId(), this.page, this.limit).subscribe((res: any) => {
        if (res.docs) {
          this.allInqueries = res.docs;
          for(let item of this.allInqueries){
            this.userService.getUserById(item.inquirer).subscribe((res:any)=>{
              item.inquirer=res.email;
            })
          }
        }
      })
    }
  }

  getCount(){
    if(this.auth.getRole()==='user'){
      this.inqueriesService.getInqueiesByFilter(`count=1&to=${Memory.getAgencyId()}&inquirer=${Memory.getUserIdStorage()}`).subscribe((res:any)=>{
        this.inqueryCount=res;
      })
    }else{
      this.inqueriesService.getInqueiesByFilter(`count=1&to=${Memory.getAgencyId()}`).subscribe((res:any)=>{
        this.inqueryCount=res;
      })
    }

  }


  goTo1(route) {
    this.searchInput = '';
    window.open(route,'_blank')
  }
  goTo(route) {
    this.searchInput = '';
    this.router.navigateByUrl(route)
  }

  filter() {
    let filter: any = {path: '', title: this.searchInput};
    this.searchResult = this.search.filter(option => option.title.toLowerCase().includes(filter.title));
    console.log(this.searchResult)
  }

  hotKeys(event) {
    if (event.keyCode == 17) {

    }
  }
}
