import {Component, OnInit, ElementRef} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Router} from '@angular/router';
import {Memory} from "../../base/memory";
import {InqueriesService} from "../../services/inqueries.service";
import {AuthService} from "../../services/auth.service";
import {UserService} from '../../services/user.service';
import {AccountingService} from '../../services/accounting.service';
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";
import {NotificationService} from "../../services/notification.service";
import {AppSettings} from "../../app.setting";
import {InquiryModel} from "../../shared/models/inquiry.model";
import {PackageService} from "../../services/package.service";

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    Memory.getPermission() ? (Memory.getPermission()['dashboard'] == true ? {
        path: 'dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        class: ''
    } : undefined) : {path: 'dashboard', title: 'Dashboard', icon: 'dashboard', class: ''},
    Memory.getPermission() ? (Memory.getPermission()['itinerary'] == true ? {
        path: 'packages',
        title: 'Itinerary',
        icon: 'person',
        class: ''
    } : undefined) : {path: 'packages', title: 'Itinerary', icon: 'person', class: ''},
    Memory.getPermission() ? (Memory.getPermission()['inquries'] == true ? {
        path: 'inqueries',
        title: 'Inqueries',
        icon: 'compare_arrows',
        class: ''
    } : undefined) : {path: 'inqueries', title: 'Inqueries', icon: 'compare_arrows', class: ''},
    Memory.getPermission() ? (Memory.getPermission()['accounting'] == true ? {
        path: 'accounting',
        title: 'Accounting',
        icon: 'sentiment_satisfied_alt',
        class: ''
    } : undefined) : {path: 'accounting', title: 'Accounting', icon: 'sentiment_satisfied_alt', class: ''},
    Memory.getPermission() ? (Memory.getPermission()['marketing'] == true ? {
        path: 'marketing',
        title: 'Marketing',
        icon: 'group_work',
        class: ''
    } : undefined) : {path: 'marketing', title: 'Marketing', icon: 'group_work', class: ''},
    Memory.getPermission() ? (Memory.getPermission()['smartVisa'] == true ? {
        path: 'formBuilder',
        title: 'Smart Visa',
        icon: 'person',
        class: ''
    } : undefined) : {path: 'formBuilder', title: 'Smart Visa', icon: 'person', class: ''},
    // { path: 'component', title: 'Component',  icon:'content_paste', class: '' },
    // { path: 'packages', title: 'Itinerary',  icon:'person', class: '' },
    // { path: 'inqueries', title: 'Inqueries',  icon:'compare_arrows', class: '' },
    // { path: 'marketing', title: 'Marketing',  icon:'group_work', class: '' },
    // { path: 'formBuilder', title: 'Smart Visa',  icon:'person', class: '' },
    // AppSettings.HAS_ACCOUNTING ? { path: 'accounting', title: 'Accounting',  icon:'sentiment_satisfied_alt', class: '' }: undefined,
    {path: 'admin', title: 'Admin', icon: 'sentiment_satisfied_alt', class: ''},
    {path: 'profile', title: 'Profile', icon: 'perm_identity', class: ''},
    {path: 'serverLogs', title: 'Server Logs', icon: 'perm_identity', class: ''},
];


@Component({
    host: {'(window:keydown)': 'hotKeys($event)'},
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    private listTitles: any[];
    allInqueries: any[] = [];
    private toggleButton: any;
    private sidebarVisible: boolean;
    searchInput: string;
    goSearch: boolean = false;
    searchResult: Array<any> = [];
    inqueryCount: number;
    loading: boolean = false;
    agency_id = localStorage['nj.associated_agency'];
    page: number = 1;
    limit: number = 5;
    math = Math;
    search: Array<any> = [
        {path: 'panel/dashboard', title: 'Dashboard'},
        {path: 'panel/component', title: 'Component'},
        {path: 'panel/packages', title: 'Trip Builder'},
        {path: 'panel/marketing', title: 'Marketing'},
        {path: 'panel/formBuilder', title: 'Smart Visa'},
        {path: 'panel/inqueries', title: 'Inqueries'},
        {path: 'panel/profile', title: 'Profile'},
        {path: 'panel/admin', title: 'Admin'},
    ];
    role: string;
    total: number = 0;
    memory = Memory;
    companyList: Array<any> = [];
    companyListSearch: Array<any> = [];
    company_name: string = '';
    password: string;

    constructor(private location: Location, private element: ElementRef, private router: Router,
                private auth: AuthService,
                private inqueryService: InqueriesService,
                private userService: UserService,
                private packageService: PackageService,
                private notificationService: NotificationService,
                private accSrv: AccountingService,
                private inqueriesService: InqueriesService) {
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.role = this.auth.getRole();
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        if (this.role === 'admin' || this.role === 'agent') {
            this.getInqueries();
            this.accSrv.getFilteredTransactionsTotal(`meta.agency=${Memory.getAgencyId()}?type=income`).subscribe((res: any) => {
                if (res.isSuccessful) {
                    this.total = res.totalPrice ? res.totalPrice : 0;
                }
            })
        }
        if (this.role === 'company') {
            if (Memory.getCompanyName()) {
                this.companyList = JSON.parse(Memory.getCompanyList())
                // this.userService.getCompanyList(Memory.getCompanyName()).subscribe((res:any)=>{
                //   if(res.isSuccessful){
                //     this.companyList=res.result;
                //   }
                // })
            } else {

            }
        }


    }

    cPassword: string;

    setCompanyName() {
        this.loading = true;

        if (this.password === this.cPassword) {
            let user = {
                user_id: Memory.getUserIdStorage(),
                password: this.password,
                company_name: this.companyList.length > 0 ? this.company_name : Memory.getCompanyName()
            };
            this.userService.setCompanyName(user).subscribe((res: any) => {
                if (res.isSuccessful) {
                    this.loading = false;
                    Memory.clearCompanyName();
                    const notifyConfig = new NotifyConfig(
                        Notify.Type.SUCCESS,
                        Notify.Placement.BOTTOM_CENTER,
                        Notify.TEMPLATES.Template2,
                        'Your company successfully Updated!',
                        ''
                    );
                    Notify.showNotify(notifyConfig);
                } else {
                    this.loading = false;
                    if (res.code === 1001) {
                        const notifyConfig = new NotifyConfig(
                            Notify.Type.DANGER,
                            Notify.Placement.BOTTOM_CENTER,
                            Notify.TEMPLATES.Template2,
                            'Your Password was wrong',
                            ''
                        );
                        Notify.showNotify(notifyConfig);
                    }
                }
            }, err => {
                this.loading = false;
                const notifyConfig = new NotifyConfig(
                    Notify.Type.DANGER,
                    Notify.Placement.BOTTOM_CENTER,
                    Notify.TEMPLATES.Template2,
                    'something was wrong!',
                    ''
                );
                Notify.showNotify(notifyConfig);
            })
        } else {
            this.loading = false;

            const notifyConfig = new NotifyConfig(
                Notify.Type.DANGER,
                Notify.Placement.BOTTOM_CENTER,
                Notify.TEMPLATES.Template2,
                'password and confirm password must be equals!',
                ''
            );
            Notify.showNotify(notifyConfig);
        }

    }

    getCompany(search) {
        this.company_name = '';
        this.companyListSearch = this.companyList.filter((item) => item.bnName.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }


    getInqueries() {
        this.getCount();
        // this.getNotification();
        if (this.auth.getRole() === 'user') {
            this.inqueriesService.getInqueiesByFilter(`to=${Memory.getAgencyId()}&inquirer=${Memory.getUserIdStorage()}`).subscribe((res: any) => {
                this.allInqueries = res;
            })
        } else {
            this.inqueriesService.getAllInqueries(Memory.getAgencyId(), this.page, this.limit).subscribe((res: any) => {
                if (res.docs) {
                    this.allInqueries = res.docs;
                    for (let item of this.allInqueries) {
                        this.userService.getUserById(item.inquirer).subscribe((res: any) => {
                            item.inquirer = res.email;
                        })
                    }
                }
            })
        }

    }

    notifications: Array<any>;
    moreData: boolean = true;
    notifLoading: boolean = false;

    getNotification() {
        if(!this.notifLoading){
            this.notifLoading=true;
            this.notifications=[];
            this.inqueryCount = 0;
            if (this.auth.getRole() === 'user') {
                this.notificationService.getNotificationByFilter(`agency_id=${Memory.getAgencyId()}&user_id=${Memory.getUserIdStorage()}&seen=false`).subscribe((res: any) => {
                    this.notifLoading=false;

                    if (res.length > 0) {
                        this.notifications = res;
                    } else {
                        this.notificationService.getNotificationByFilter(`agency_id=${Memory.getAgencyId()}&user_id=${Memory.getUserIdStorage()}&seen=true`).subscribe((res: any) => {
                            this.moreData = false;
                            if (res.length > 0) {
                                this.notifications = this.notifications.concat(res);
                            }
                        })
                    }
                })
            }
            else {
                this.notificationService.getNotificationByFilter(`agency_id=${Memory.getAgencyId()}&seen=false`).subscribe((res: any) => {
                    this.notifLoading=false;

                    if (res.length > 0) {
                        this.notifications = res;
                    } else {
                        this.notificationService.getNotificationByFilter(`agency_id=${Memory.getAgencyId()}&seen=true`).subscribe((res: any) => {
                            this.moreData = false;
                            if (res.length > 0) {
                                this.notifications = this.notifications.concat(res);
                            }
                        })
                    }
                })
            }
        }

    }

    getCount() {
        if (this.auth.getRole() === 'user') {
            this.notificationService.getNotificationByFilter(`count=1&agency_id=${Memory.getAgencyId()}&user_id=${Memory.getUserIdStorage()}&seen=false`).subscribe((res: any) => {
                this.inqueryCount = res;
            })
        } else {
            this.notificationService.getNotificationByFilter(`count=1&agency_id=${Memory.getAgencyId()}&seen=false`).subscribe((res: any) => {
                this.inqueryCount = res;
            })
        }

    }

    goToInquery(id) {
        console.log(id);
        if(id){
            this.router.navigate(['panel/inqueries'], {queryParams: {id: id}})
        }
    }

    goTo(route) {
        this.searchInput = '';
        this.router.navigateByUrl(route)
    }

    goTo1(route) {
        this.searchInput = '';
        window.open(AppSettings.PUBLIC_URL + '/#/public/' + route, '_blank')
    }

    filter() {
        let filter: any = {path: '', title: this.searchInput};
        this.searchResult = this.search.filter(option => option.title.toLowerCase().includes(filter.title));
    }

    hotKeys(event) {
        if (event.keyCode == 17) {

        }
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };

    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };

    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        titlee = titlee.split('/').pop();

        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Component';
    }

    amount: number;
    exportAmount: number;

    addAmount() {
        this.loading=true;
        if(this.amount>0){
            this.packageService.pay(this.amount).subscribe((res: any) => {
                this.loading=false;

                if(res.isSuccessful){
                    window.location.href=res.result;
                    const notifyConfig = new NotifyConfig(
                        Notify.Type.SUCCESS,
                        Notify.Placement.TOP_CENTER,
                        Notify.TEMPLATES.Template2,
                        'Success request for pay',
                        ''
                    );
                    Notify.showNotify(notifyConfig);
                }else{
                    const notifyConfig = new NotifyConfig(
                        Notify.Type.DANGER,
                        Notify.Placement.TOP_CENTER,
                        Notify.TEMPLATES.Template2,
                        'less than 0 is not valid',
                        ''
                    );
                    Notify.showNotify(notifyConfig);
                }

            })
        }else{
            this.loading=false;
            const notifyConfig = new NotifyConfig(
                Notify.Type.DANGER,
                Notify.Placement.TOP_CENTER,
                Notify.TEMPLATES.Template2,
                'less than 0 is not valid',
                ''
            );
            Notify.showNotify(notifyConfig);
        }

    }

    inquery: InquiryModel = new InquiryModel();

    exportAmountAction() {
        this.loading=true;
        if (this.exportAmount <= this.total&&this.exportAmount>0) {
            this.inquery.special_inst = this.exportAmount.toString()+' '+Memory.getActiveCurrency();
            this.inquery.inquirer = Memory.getUserIdStorage();
            this.inquery.to = Memory.getAgencyId();
            this.inquery.status = 'PENDING';
            this.inquery.type = 'CHECKOUT';
            this.inqueryService.createInquery(this.inquery).subscribe((res1: any) => {
                this.loading=false;
                this.total=this.total-this.exportAmount;
                const notifyConfig = new NotifyConfig(
                    Notify.Type.SUCCESS,
                    Notify.Placement.TOP_CENTER,
                    Notify.TEMPLATES.Template2,
                    'YOUR request successfully sent',
                    ''
                );
                Notify.showNotify(notifyConfig);
            })
        } else {
            this.loading=false;
            const notifyConfig = new NotifyConfig(
                Notify.Type.DANGER,
                Notify.Placement.TOP_CENTER,
                Notify.TEMPLATES.Template2,
                'amount is bigger than tour income or is less than 0',
                ''
            );
            Notify.showNotify(notifyConfig);
        }
    }

}
