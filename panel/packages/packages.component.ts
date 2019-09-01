import {Component, OnInit, Inject, HostListener, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {ComponentService} from '../../services/component.service';
import {DOCUMENT} from "@angular/platform-browser";
import * as moment from 'moment';
import {SocialService} from "../../services/social.service";
import {AgenciesService} from '../../services/agencies.service';
import {Package} from '../../shared/models/package.model';
import * as L from 'leaflet';
import {DateManagerService} from '../../services/date-manager.service';
import {Memory} from "../../base/memory";
import {ActivatedRoute, Router} from '@angular/router';
import {PackageService} from "../../services/package.service";
import {AuthService} from "../../services/auth.service";
import {AppSettings} from "../../app.setting";

declare var $: any;
declare var console;

@Component({
    selector: 'app-packages',
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit, OnDestroy {
    packageEdit: any = null;
    // Dummy
    console = console;
    memory = Memory;
    packageId: string;
    packageData: any;
    alert = alert;
    // Dummy
    cardsData: Array<any> = [];
    moment = moment;
    packageBuilder: Array<any> = [];
    externalData: Array<any> = [];
    packages: Array<any> = [];
    packageList: boolean = true;
    departure: Date = new Date();
    arrival: Date = new Date();
    roundTrip: boolean = true;
    filter;
    changeLoading: boolean = false;
    search;
    isUser: boolean
    externalHotelComponents;
    socialMedias;
    selectedData: Array<any> = [];
    range: string;
    math = Math;
    imageTemp: Array<any> = []
    topFilter = {
        hotel: true,
        shared: true,
        airfare: true,
        from: '',
        to: '',
        cityFrom: '',
        cityTo: ''
    }

    update: boolean = false;

    // Filter
    typeOfFilter = [
        {
            displayName: "Ticket #",
            name: "ticketNo",
            icon: "airplanemode_active",
            type: "string",
            value: '',
            active: true
        },
        {
            displayName: "Topic",
            name: "topic",
            icon: "hotel",
            type: "string",
            value: '',
            active: true
        },
        {
            displayName: "Shared",
            name: "shared",
            icon: "hotel",
            type: "string",
            value: '',
            active: true
        }
    ]
    // Main Dropdown Data
    dropData = [
        {
            operatorName: 'addAirfare',
            displayName: 'Airfare',
            icon: 'flight',
            description: 'Add Manual Airfare'
        },
        {
            operatorName: 'addHotel',
            displayName: 'Hotel',
            icon: 'hotel',
            description: 'Add Manual Airfare'
        },
        {
            operatorName: 'addItenerary',
            displayName: 'Itenerary',
            icon: 'list',
            description: 'Start new Itenerary'
        }
    ];
    filterData: FilterModel = new FilterModel()
    mode: string;


    dragData: any;
    page: number = 0;
    @ViewChild('slickModal') slickModal;

    mainSlideConfig = {
        "slidesToShow": 1,
        "slidesToScroll": 1,
        "dots": false,
        "infinite": true,
        "autoplay": false,
        "autoplaySpeed": 2500
    };
    appSetting = AppSettings;

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.imageTemp = []
    }

    constructor(private componentService: ComponentService, @Inject(DOCUMENT) private doc: Document,
                private dateService: DateManagerService,
                private socialService: SocialService,
                private route: ActivatedRoute,
                private router: Router,
                private auth: AuthService,
                private agenciesService: AgenciesService,
                private packageService: PackageService
    ) {
    }

    @ViewChild('stickyNavbar') fixedBox: ElementRef;
    fixedBoxOffsetTop: number = 0;
    fixedBoxOffsetTopOtherMethod: number = 0;
    pageHeight: number = 300;

    @HostListener("window:scroll", [])
    onWindowScroll() {
        this.fixedBoxOffsetTop = this.fixedBox.nativeElement.offsetTop;
    }

    checkSticky() {
        return (window.pageYOffset >= this.pageHeight) ? 'sticky' : '';
    }

    checkStickyDrop() {
        return (window.pageYOffset >= this.pageHeight) ? 'sticky-drop' : '';
    }

    checkStickySearch() {
        return (window.pageYOffset >= this.pageHeight) ? 'sticky-search' : '';
    }


    roundTripData = {
        name: "Round Trip", availability: true, icon: "repeat"
    }
    baseLayers = [L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18})];

    center = L.latLng([46.879966, -121.726909]);
    fitBounds = L.latLngBounds([[40.712, -74.227], [40.774, -74.125]]);
    role: string;

    ngOnInit() {
        // $('.sidebar').addClass('small');
        // $('.main-panel').addClass('custom-width');
        this.role = this.auth.getRole();
        if (this.role === 'company') {
            this.dropData = [
                {
                    operatorName: 'addItenerary',
                    displayName: 'Itenerary',
                    icon: 'list',
                    description: 'Start new Itenerary'
                }
            ]
            this.packageList = false;
        }
        if (this.role !== 'van-driver') {
            this.route.queryParams.subscribe(params => {
                if (params['mode']) {
                    this.mode = params['mode'];
                    if (this.packageList === true) {
                        this.getPackages()
                    }
                } else {
                    if (this.packageList === true) {
                        this.getPackages()
                    }
                }
            });
            Memory.setLoading(true);
            setTimeout(function () {
                Memory.setLoading(false);
            }, 3000);
            this.getAgencyDetails();
            L.map('map').setView([51.505, -0.09], 13);
        }
        else if (this.role === 'van-driver') {
            this.dropData = [
                {
                    operatorName: 'addVan',
                    displayName: 'Van-Driver',
                    icon: 'add',
                    description: 'Add Manual Car/van'
                },
                {
                    operatorName: 'listVan',
                    displayName: 'Van-list',
                    icon: 'list',
                    description: 'list of car van'
                }
            ]
            this.dropClicked({operatorName: 'listVan'})
        }

        // this.getComponent()
        this.submitSearch(new FilterModel())

    }

    changeFilter(event, item) {
        this.topFilter[item] = event.checked;
        this.getComponent()
    }

    ngOnChanges() {
        console.log('changed')
    }

    collectDates(date) {
        let query = {
            "details.from.departure.date": {"$gte": this.departure, "$lt": this.arrival},
            "details.roundTrip": this.roundTrip,
        }
        if (this.packageList) {
            this.getStrongFilterPackage(query)
        } else {

            this.getStrongFilterComponent(query)
        }
    }

    checkPriceOfPackage(p) {
        let price = 0;
        p.componentsData.forEach((v, k) => {
            if (v.associated_agency === 'amadeus') {
                if ('EUR' === Memory.getActiveCurrency()) {
                    price += parseFloat(v.bulkPrice);
                } else {
                    price += parseFloat(v.bulkPrice) * parseFloat(Memory.getCurrency()[`EUR_${Memory.getActiveCurrency()}`])
                }
            } else {
                if (v.currency) {
                    if (v.currency === Memory.getActiveCurrency()) {
                        price += parseFloat(v.bulkPrice);
                    } else if (v.currency != Memory.getActiveCurrency()) {
                        price += parseFloat(v.bulkPrice) * parseFloat(Memory.getCurrency()[`${v.currency}_${Memory.getActiveCurrency()}`])
                    }
                } else {
                    if (p.currency != Memory.getActiveCurrency()) {
                        price += parseFloat(v.bulkPrice) * parseFloat(Memory.getCurrency()[`${p.currency}_${Memory.getActiveCurrency()}`])
                    } else {
                        price += parseFloat(v.bulkPrice);
                    }
                }
            }
        });

        return `${Memory.getActiveCurrency() ? Memory.getActiveCurrency() : 'PHP'} ${Math.round((price - (p.packageData.discount * price) / 100) * 100) / 100}`;
    }

    autoComplete() {
        // console.log(this.search)
    }

    showTrip(event) {
        // console.log(event);
        let lastSelected = event[event.length - 1]
        this.managePackages(lastSelected.id, lastSelected)
        // this.selectedData.push(lastSelected);
    }

    getAgencyDetails() {
        this.agenciesService.getByReferalCode(Memory.getAgencyId()).subscribe((res: any) => {
            if (res) {
                this.socialMedias = res.result.social_media;
            }
        })
    }

    getComponent() {
        this.cardsData = [];
        var filter = '';
        if (this.topFilter.hotel && !this.topFilter.airfare) {
            filter += '&type=hotel-room';
        }
        if (this.topFilter.airfare && !this.topFilter.hotel) {
            filter += '&type=AIRPLANE';
        }
        if (this.topFilter.hotel && this.topFilter.airfare) {
            filter = '';
        }
        if (!this.topFilter.hotel && !this.topFilter.airfare) {
            if (this.topFilter.shared)
                this.getSharedComponent(filter);
            else {
                this.changeLoading = false;
                this.cardsData = [];
                console.log(this.cardsData.length > 0)
            }
        } else {
            this.componentService.getFilteredComponent(`associated_agency=${Memory.getAgencyId()}${filter}`).subscribe(
                (response: any) => {
                    if (response) {
                        for (let item of response) {
                            if (!this.checkExpire(item.deadline)) {
                                this.cardsData.push(item);
                            }
                        }
                        console.log('data', this.cardsData)
                        // this.cardsData = response;
                        // this.showNotification('top','center',"success","Component sucessfully added.")
                    }
                    if (this.topFilter.shared) {
                        this.getSharedComponent(filter);
                    } else {
                        this.changeLoading = false;
                    }
                });
        }

    }

    modeSearch: boolean=false;
    tabChange(event){
        console.log(event)
        this.modeSearch=event.index===1;
        this.submitSearch(new FilterModel());
    }
    submitSearch(event) {
        console.log(123213123,this.modeSearch);
        let filter = '';
        this.filterData = event;
        if (this.modeSearch) {
            if (this.filterData.from) {
                filter += `&details.from.city=${this.filterData.from.toLowerCase()}`
            }
            if (this.filterData.to) {
                filter += `&details.to.city=${this.filterData.to.toLowerCase()}`
            }
            if (this.filterData.company) {
                filter += `&company=${this.filterData.to.toLowerCase()}`
            }
            let body=[];

            let query = {};
            if (this.filterData.date) {
                query['$gte'] = this.filterData.date;
                if (query) {
                    body = [{
                        type: 'dateRange',
                        name: 'details.from.departure.date',
                        value: query
                    }]
                }
            }
            if (this.filterData.twoWay) {
                filter += `&details.roundTrip=${this.filterData.to.toLowerCase()}`
            }
            console.log(query);

            this.componentService.getFilteredComponentPost(`associated_agency=${Memory.getAgencyId()}${filter}`, body).subscribe(
                (response: any) => {
                    if (response) {
                        this.cardsData=response
                    }

                });

        } else {

        }

    }

    checkExpire(item): boolean {
        let fromDate = moment(new Date())
        let toDate = moment(item.date)
        let toTime = item.time;
        toTime = toTime.split(':')
        let checkDateTime = true;
        let today = new Date();
        if (toDate.isSame(moment(fromDate))) {
            if (toTime[0] < today.getHours()) {
                checkDateTime = true;
            } else if (toTime[0] === today.getHours() && toTime[1] < today.getMinutes()) {
                checkDateTime = true;
            } else {
                checkDateTime = false;
            }
        }
        if (toDate.isSameOrBefore(fromDate) && checkDateTime) {
            return true;
        } else {
            return false;
        }
    }

    getSharedComponent(filter) {
        this.componentService.getFilteredComponent(`asSharable=true${filter}`).subscribe(
            (response: any) => {
                this.changeLoading = false;

                if (response) {
                    for (let item of response) {
                        if (item.associated_agency !== Memory.getAgencyId() && !this.checkExpire(item.deadline)) {
                            this.cardsData.push(item);
                        }
                    }
                }
            });
        if (this.topFilter.hotel) {
            this.componentService.getExternalHotelResource(this.topFilter.cityTo ? this.topFilter.cityTo : 'MNL').subscribe((response: any) => {
                if (response) {
                    for (let item of response.result) {
                        // if (item.associated_agency !== Memory.getAgencyId()&& !this.checkExpire(item.deadline)) {
                        this.cardsData.push(item);
                    }
                }

            })
        }

        if (this.topFilter.airfare) {
            let destinationData = {
                "origin": this.topFilter.cityFrom ? this.topFilter.cityFrom : 'MAD',
                "destination": this.topFilter.cityTo ? this.topFilter.cityTo : 'NYC',
                "departureDate": this.topFilter.from ? moment(this.topFilter.from).format('YYYY-MM-DD') : "2019-06-05"
            }
            this.componentService.getExternalAirfareResource(destinationData).subscribe((response: any) => {
                if (response) {
                    for (let item of response.result) {
                        // if (item.associated_agency !== Memory.getAgencyId()&& !this.checkExpire(item.deadline)) {
                        this.cardsData.push(item);
                    }
                }

            })
        }


    }

    // https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=gfYc9Hu79ofgDBaRWse8FNSEuPmHrwId&origin=BOS&destination=LON&departure_date=2018-12-25&_=1542439722476
    // getExternalHotelData(cityCode) {
    //   this.componentService.getExternalHotelData(cityCode).subscribe(
    //     response => {
    //       if (response) {
    //         // amadeusHotelJsonUnify
    //         response = response.result.result;
    //         this.componentService.amadeusHotelJsonUnify(response).subscribe(
    //           unifiedData =>{
    //             console.log(unifiedData)
    //           })
    //       }
    //     });
    // }
    getExternalAirfare() {
        // this.componentService.getExternalHotelData(cityCode).subscribe(
        //   response => {
        //     if (response) {
        //       this.externalHotelComponents = response;
        //     }
        //   });
    }

    getStrongFilterComponent(q) {
        this.componentService.getStrongFiltered(q).subscribe(
            (response: any) => {
                if (response) {
                    this.cardsData = response;
                    // this.showNotification('top','center',"success","Component sucessfully added.")
                }
            });
    }

    getStrongFilterPackage(q) {
        this.componentService.getStrongPackageFiltered(q).subscribe(
            (response: any) => {
                if (response) {
                    // this.packages = response;
                    // this.showNotification('top','center',"success","Component sucessfully added.")
                }
            });
    }

    deletePackageOne(component) {
        let self = this;
        this.cardsData.forEach(function (item, index) {
            if (item._id === component._id) {
                self.cardsData.splice(index, 1)
            }
        })
    }

    checkAll(event) {
        this.packageBuilder = this.dateService.checkAllValidTrip(this.packageBuilder)
    }

    deleteALL(event) {
        if (event) {
            this.packageBuilder = [];
            this.cardsData.forEach(function (sub) {
                sub.marked = false;
            });
        }
    }

    managePackages(id, data?, component?) {
        if (data.component.associated_agency == 'amadeus' || data.component.associated_agency == 'airasia') {
            if (data.active) {
                component.marked = true;
                data.component.isValid = true;
                this.packageBuilder.push(data.component);
                this.dateService.checkAllValidTrip(this.packageBuilder);
            } else {
                let self = this;
                this.packageBuilder.forEach(function (item, index) {
                    if (item === data.component) {
                        self.packageBuilder.splice(index, 1);
                        self.dateService.checkAllValidTrip(self.packageBuilder)
                    }
                })
            }


        } else {
            if (id) {
                if (data.active) {
                    component.marked = true;
                    data.component.isValid = true;
                    this.packageBuilder.push(data.component);
                    if (data.component.details.roundTrip === true) {
                        let newComp = Object.assign({}, data.component);
                        newComp.pair = newComp._id;
                        newComp.bulkPrice = 0;
                        this.packageBuilder.push(newComp);
                    }
                    this.dateService.checkAllValidTrip(this.packageBuilder);
                } else {
                    let self = this;
                    this.packageBuilder.forEach(function (item, index) {
                        if (item._id === data.component._id) {
                            self.packageBuilder.splice(index, 1);
                            self.dateService.checkAllValidTrip(self.packageBuilder)
                        }
                    })
                    this.packageBuilder = this.packageBuilder.filter(function (value) {
                        if (value.pair !== component._id) {
                            return value;
                        }
                    });
                }

            } else if (!id && data.component) {
                this.componentService.addComponent(data.component).subscribe(
                    (response: any) => {
                        if (response) {
                            this.managePackages(response._id, response);
                        }
                    });
            }
        }

    }

    deleteComponentPackages(component) {
        let self = this;
        this.cardsData.forEach(function (sub) {
            if (sub._id == component._id) {
                sub.marked = false;
            }
        });
        this.packageBuilder.forEach(function (item, index) {
            if (item._id === component._id) {
                self.packageBuilder.splice(index, 1);
                self.dateService.checkAllValidTrip(self.packageBuilder)
            }
        })
        this.packageBuilder = this.packageBuilder.filter(function (value) {
            if (value.pair !== component._id) {
                return value;
            }
        });

    }

    submitComponent(trip) {
        this.componentService.addComponent(trip).subscribe(
            (response: any) => {
                if (response) {
                    return response._id;
                    // this.showNotification('top','center',"success","Component sucessfully added.")
                }
            });
    }

    submitPackage(event) {
        this.packageBuilder = this.packageBuilder.filter(function (value) {
            if (value.pair !== value._id) {
                return value;
            }
        });
        let self = this;
        var externalComponents = this.packageBuilder.filter(function (value) {
            if (value.associated_agency == 'amadeus' || value.associated_agency == 'airasia') {
                return value;
            }
        });
        this.packageBuilder = this.packageBuilder.filter(function (value) {
            if (value.associated_agency !== 'amadeus' || value.associated_agency == 'airasia') {
                return value;
            }
        });
        if (this.update) {
            if (event.submit == 'submit') {
                let packageData = {
                    components: this.packageBuilder,
                    externalResources: externalComponents,
                    name: event.name,
                    discount: event.discount,
                    tripDeadline: event.tripDeadline,
                    associated_agency: Memory.getAgencyId(),
                    images: event.images,
                    remarks: event.remarks,
                    status: event.status,
                    isFeatured: event.isFeatured,
                    creator: Memory.getUserId,
                    currency: Memory.getActiveCurrency() ? Memory.getActiveCurrency() : 'PHP'
                }
                // if(event.isDrafted){let status = 'DRAFT'}
                this.componentService.addPackage(packageData).subscribe(
                    (response: any) => {
                        if (response) {
                            let tmpPackages = this.packageBuilder; //for Social media usage
                            this.packages = [];
                            this.packageBuilder = [];
                            this.cardsData.forEach(function (sub) {
                                sub.marked = false;
                            });
                            this.getPackages();
                            this.showNotification('bottom', 'center', "success", "Package succesfully created.")
                            // Social Share here
                            if (event.sharable) {
                                let obj = {
                                    chatId: this.socialMedias.telegram,
                                    packageData: response,
                                    components: tmpPackages,
                                    agencyId: Memory.getAgencyId(),
                                }
                                this.socialService.postTelegram(obj).subscribe(
                                    (response: any) => {
                                        if (response) {
                                            console.log(response);
                                        }
                                    });

                            }
                            if (event.sharableFacebook) {
                                let obj = {
                                    chatId: this.socialMedias.facebook,
                                    packageData: response,
                                    components: tmpPackages,
                                    agencyId: Memory.getAgencyId(),
                                }
                                this.socialService.postFacebook(obj).subscribe(
                                    (response: any) => {
                                        if (response) {
                                            console.log(response);
                                        }
                                    });
                            }
                            if (event.sharableLinkedin) {
                                let obj = {
                                    chatId: this.socialMedias.linkedin,
                                    packageData: response,
                                    components: tmpPackages,
                                    agencyId: Memory.getAgencyId(),
                                }
                                this.socialService.postLinkedin(obj).subscribe(
                                    (response: any) => {
                                        if (response) {
                                            console.log(response);
                                        }
                                    });
                            }
                            if (event.sharablePinterest) {
                                let obj = {
                                    chatId: this.socialMedias.pinterest,
                                    packageData: response,
                                    components: tmpPackages,
                                    agencyId: Memory.getAgencyId(),
                                }
                                this.socialService.postPinterest(obj).subscribe(
                                    (response: any) => {
                                        if (response) {
                                            console.log(response);
                                        }
                                    });
                            }
                            if (event.sharableTwitter) {
                                let obj = {
                                    oauth_token: this.socialMedias.twitter.token,
                                    oauth_token_secret: this.socialMedias.twitter.secret,
                                    packageData: response,
                                    components: tmpPackages,
                                    agencyId: Memory.getAgencyId(),
                                }
                                this.socialService.postTwitter(obj).subscribe(
                                    (response: any) => {
                                        if (response) {
                                            console.log(response);
                                        }
                                    });
                            }
                            if (event.sharableYoutube) {
                                let obj = {
                                    chatId: this.socialMedias.pinterest,
                                    packageData: response,
                                    components: tmpPackages,
                                    agencyId: Memory.getAgencyId(),
                                    name: event.name,
                                    images: event.images
                                }
                                this.socialService.postYoutube(obj).subscribe(
                                    (response: any) => {
                                        if (response) {
                                            console.log(response);
                                        }
                                    });
                            }
                            if (event.sharableFlickr) {

                            }
                        }
                    });
            }
        } else {
            if (event.submit == 'submit') {
                let editedPackage: Package = new Package();
                editedPackage.components = this.packageBuilder;
                editedPackage._id = this.packageId;
                editedPackage.associated_agency = Memory.getAgencyId();
                editedPackage.images = event.images;
                editedPackage.remarks = event.remarks;
                editedPackage.creator = Memory.getUserId()
                this.componentService.editPackage(editedPackage).subscribe(
                    (response: any) => {
                        if (response) {
                            // console.log(response)
                            this.packages = [];
                            this.packageBuilder = [];
                            this.packageList = true;
                            this.update = false;
                            this.cardsData.forEach(function (sub) {
                                sub.marked = false;
                            });
                            this.getPackages();
                            this.showNotification('bottom', 'center', "success", "Package succesfully updated.")
                        }
                    });
            }
        }

    }

    showNotification(from, align, t, message) {
        const type = ['', 'info', 'success', 'warning', 'danger'];
        const color = Math.floor((Math.random() * 4) + 1);
        $.notify({
            icon: "notifications",
            message: message
        }, {
            type: t[color],
            timer: 4000,
            placement: {
                from: from,
                align: align
            }
        });
    }

    getMultipleComponent(data) {
        // console.log(data)
        // this.packages = [];
        Memory.setLoading(true);
        this.componentService.getMultipleComponent(data).subscribe(
            (response: any) => {
                let tmpPackage: any;
                var valid: boolean = true;
                Memory.setLoading(false);
                // for (let item of response){
                //   if(item.details.roundTrip===true){
                //     let newComp=Object.assign({},item);
                //     newComp.pair=newComp._id;
                //     newComp.bulkPrice=0;
                //     response.push(newComp);
                //   }
                // }
                if (response) {
                    for (let item of response) {
                        if (new Date(item.updatedDate).getTime() > new Date(data.updatedDate).getTime()) {
                            valid = false;
                        }
                    }
                    if (data.externalResources) {
                        response = response.concat(data.externalResources);
                        delete data.externalResources;
                    }

                    tmpPackage = {
                        valid: valid,
                        packageData: data,
                        componentsData: response
                    };
                    if (this.mode === 'valid' && valid == true) {
                        this.packages.push(tmpPackage);
                    } else if (this.mode === 'invalid' && valid == false) {
                        this.packages.push(tmpPackage);
                    } else if (!this.mode) {
                        this.packages.push(tmpPackage);
                    }
                } else {
                    this.packages = [];

                }
            }, err => {
                this.packages = [];
                Memory.setLoading(false);
            });
    }

    getPackages() {
        this.page++;
        this.componentService.getPackagesFilterPagination(`associated_agency=${Memory.getAgencyId()}`, this.page).subscribe(
            (response: any) => {
                if (response.isSuccessful) {
                    if (response.results == []) {
                        // this.packages = [];

                    } else {
                        response.results.forEach((v, k) => {
                            this.getMultipleComponent(v)
                        })
                    }


                }
            });
    }

    deletePackage(packages) {
        console.log(packages);
        if (window.confirm('Are you sure you want to delete this package?')) {
            packages.deleted = true;
            Memory.setLoading(true);
            this.componentService.deletePackage(packages).subscribe(
                (response: any) => {
                    Memory.setLoading(false);
                    let self=this;
                    // JSON.parse(response)
                    this.packages.forEach(function (item, index) {
                        if(item.packageData._id===packages._id){
                            self.packages.splice(index,1);
                        }
                    })
                    // if (response) {
                    //     this.packages = [];
                    //     this.getPackages();
                    // }
                }, err => {
                    Memory.setLoading(false);
                });
        }
    }

    cancelUpdate(event) {
        if (event) {
            this.update = false;
            let self = this;
            this.cardsData.forEach(function (sub) {
                sub.marked = false;
            });
            this.packageBuilder = [];
        }
    }

    editPackage(data) {
        Memory.setLoading(true);
        let tempPackages = Object.assign([], data.componentsData);
        for (let item of tempPackages) {

            if (item.associated_agency !== 'amadeus' && item.associated_agency !== 'airasia' && item.details.roundTrip) {
                let newComp = Object.assign({}, item);
                newComp.pair = newComp._id;
                newComp.bulkPrice = 0;
                data.componentsData.push(newComp);
            }
        }
        this.packageEdit = Object.assign({}, data);
        this.packageList = false;
        Memory.setLoading(false);
    }

    clickList() {
        this.page = 0;
        this.packageList = !this.packageList;
        this.cancelUpdate(true)
        this.packages = [];
        if (this.packageList === true) {
            this.packageEdit = null;
            this.getPackages()
        }
    }

    packageDraft(event, packageItem) {
        if (event.checked) {
            packageItem.packageData.status = 'PUBLISHED';
            this.componentService.editPackage(packageItem.packageData).subscribe(
                (response: any) => {
                    if (response) {

                    }
                });
        } else {
            packageItem.packageData.status = 'DRAFT';
            this.componentService.editPackage(packageItem.packageData).subscribe(
                (response: any) => {
                    if (response) {

                    }
                });
        }
    }

    dropClicked(event) {
        if (event.operatorName == 'addAirfare') {
            this.router.navigate(['/panel/component'], {queryParams: {mode: 'AIRPLANE'}})

        } else if (event.operatorName == 'addHotel') {
            this.router.navigate(['/panel/component'], {queryParams: {mode: 'hotel-room'}})

        } else if (event.operatorName == 'addVan') {
            this.router.navigate(['/panel/component'], {queryParams: {mode: 'car-van'}})

        } else if (event.operatorName == 'listVan') {
            this.router.navigate(['/panel/component'], {queryParams: {mode: 'car-van'}})

        } else {
            this.clickList();
        }
    }

    manual(item) {
        this.router.navigate(['/panel/accounting'], {
            queryParams: {
                id: item.packageData._id,
                name: item.packageData.name,
                price: this.checkPriceOfPackage(item)
            }
        })
    }

    selectTypeEmit(event) {
        this.topFilter.from = this.generateDateFromString(event.from);
        this.topFilter.cityFrom = event.fromIso;
        this.topFilter.cityTo = event.toIso;
        if (event.type === 'airfare') {
            this.topFilter.airfare = true;
            this.topFilter.hotel = false;
        } else if (event.type === 'hotel') {
            this.topFilter.airfare = false;
            this.topFilter.hotel = true;
        }
        this.getComponent()
    }

    generateDateFromString(from): any {
        let date = from.split('/');
        return new Date(date[2], parseInt(date[1]) - 1, date[0])
    }

    dropped: boolean = false;

    onDrag(item) {
        this.dragData = item;
        this.dropped = false;
        console.log(2);
    }

    onDrop(event) {
        this.dropped = true;
        this.dragData = null;
        console.log(1)
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        Memory.setLoading(false);
    }

    dragComplete(event) {
        if (event) {
            this.dropped = false;
            this.dragData = null;
        }

    }


    dropToDo(event) {
        console.log('drop')
    }

    dragEnter() {
        console.log('enter')
    }

    dragLeave() {
        console.log('leave')
    }

    dragStartDoing() {
        console.log('drag')
    }

    slider: boolean = false;

    images(image) {
        for(let item of image){
            item =item.replace('https://','')
            this.imageTemp.push(item)

        }
        // this.slider = true;
        console.log(this.imageTemp)
        // $('#images').modal('toggle');
    }

    closeSlider() {
        this.slider = false;
    }

}

export class FilterModel {
    from: string;
    to: string;
    company: string;
    date: any;
    twoWay: boolean;
    inactive: boolean;
}
