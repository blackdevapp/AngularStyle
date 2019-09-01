import {
    Component,
    ElementRef, EventEmitter,
    HostListener,
    Inject, Input,
    OnChanges,
    OnInit, Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {ImageService} from "../../services/image.service";
import {UploadService} from "../../services/upload.service";
import {Memory} from "../../base/memory";
import {AgenciesService} from "../../services/agencies.service";
import {CityService} from "../../services/city.service";
import {ComponentService} from "../../services/component.service";
import * as L from "leaflet";
import {DateManagerService} from "../../services/date-manager.service";
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/platform-browser";
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";
import * as moment from 'moment';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Social} from "../itinerary-social/itinerary-social.component";
import {SocialService} from "../../services/social.service";
import {AppSettings} from "../../app.setting";
import {AuthService} from "../../services/auth.service";
import {InqueriesService} from "../../services/inqueries.service";
import {InquiryModel} from "../../shared/models/inquiry.model";
import {VisaService} from "../../services/visa.service";
import {UserService} from "../../services/user.service";

declare var $: any;

@Component({
    selector: 'app-itinerary-details',
    templateUrl: './itinerary-details.component.html',
    styleUrls: ['./itinerary-details.component.scss']
})
export class ItineraryDetailsComponent implements OnInit, OnChanges {
    public Editor = ClassicEditor;

    loaderType: string = '';
    menuPosition: boolean = !!$('.sidebar.small').index()
    @Input() package: any;
    newDay;
    step: number = 3;
    @ViewChild('slickModal') slickModal;
    @ViewChild('slickModal1') slickModal1;
    dragData: any;
    console = console;
    currentSlide: number = 0;
    today = new Date();
    moment = moment;
    popUpMap: boolean = false;
    loader: boolean = false;
    noDataNationality: boolean = false;
    cityFromList: Array<any> = [];
    canAirplane: boolean = true;
    cityToList: Array<any> = [];
    packageBuilder: Array<any> = [];
    selectedDate: Array<string> = [];
    card: Card = new Card();
    update: boolean = false;
    coordinates;
    memory = Memory;
    packageId: string;
    packageData: any;
    cardsData: Array<any> = [];
    packages: Array<any> = [];
    packageList: boolean = true;
    departure: Date = new Date();
    arrival: Date = new Date();
    roundTrip: boolean = true;
    filter;
    changeLoading: boolean = false;
    firstFormGroup: any;
    secondFormGroup: any;
    appSetting = AppSettings;
    filterAirasia: FilterAirAsia = new FilterAirAsia();
    search;
    coverState: boolean = false;
    logoState: boolean = false;
    range: string;
    topFilter = {
        hotel: true,
        shared: true,
        van: true,
        airfare: true,
        agCityId: '',
        from: new Date(),
        to: '',
        quantity: 1,
        cityFrom: '',
        cityTo: '',
        fromIso: '',
        toIso: ''
    };
    inquery: InquiryModel = new InquiryModel();
    nationality: Array<string> = ['Afghan',
        'Albanian',
        'Algerian',
        'American',
        'Andorran',
        'Angolan',
        'Antiguans',
        'Argentinean',
        'Armenian',
        'Australian',
        'Austrian',
        'Azerbaijani',
        'Bahamian',
        'Bahraini',
        'Bangladeshi',
        'Barbadian',
        'Barbudans',
        'Batswana',
        'Belarusian',
        'Belgian',
        'Belizean',
        'Beninese',
        'Bhutanese',
        'Bolivian',
        'Bosnian',
        'Brazilian',
        'British',
        'Bruneian',
        'Bulgarian',
        'Burkinabe',
        'Burmese',
        'Burundian',
        'Cambodian',
        'Cameroonian',
        'Canadian',
        'Cape Verdean',
        'Central African',
        'Chadian',
        'Chilean',
        'Chinese',
        'Colombian',
        'Comoran',
        'Congolese',
        'Costa Rican',
        'Croatian',
        'Cuban',
        'Cypriot',
        'Czech',
        'Danish',
        'Djibouti',
        'Dominican',
        'Dutch',
        'East Timorese',
        'Ecuadorean',
        'Egyptian',
        'Emirian',
        'Equatorial Guinean',
        'Eritrean',
        'Estonian',
        'Ethiopian',
        'Fijian',
        'Filipino',
        'Finnish',
        'French',
        'Gabonese',
        'Gambian',
        'Georgian',
        'German',
        'Ghanaian',
        'Greek',
        'Grenadian',
        'Guatemalan',
        'Guinea-Bissauan',
        'Guinean',
        'Guyanese',
        'Haitian',
        'Herzegovinian',
        'Honduran',
        'Hungarian',
        'Icelander',
        'Indian',
        'Indonesian',
        'Iranian',
        'Iraqi',
        'Irish',
        'Israeli',
        'Italian',
        'Ivorian',
        'Jamaican',
        'Japanese',
        'Jordanian',
        'Kazakhstani',
        'Kenyan',
        'Kittian and Nevisian',
        'Kuwaiti',
        'Kyrgyz',
        'Laotian',
        'Latvian',
        'Lebanese',
        'Liberian',
        'Libyan',
        'Liechtensteiner',
        'Lithuanian',
        'Luxembourger',
        'Macedonian',
        'Malagasy',
        'Malawian',
        'Malaysian',
        'Maldivan',
        'Malian',
        'Maltese',
        'Marshallese',
        'Mauritanian',
        'Mauritian',
        'Mexican',
        'Micronesian',
        'Moldovan',
        'Monacan',
        'Mongolian',
        'Moroccan',
        'Mosotho',
        'Motswana',
        'Mozambican',
        'Namibian',
        'Nauruan',
        'Nepalese',
        'New Zealander',
        'Ni-Vanuatu',
        'Nicaraguan',
        'Nigerien',
        'North Korean',
        'Northern Irish',
        'Norwegian',
        'Omani',
        'Pakistani',
        'Palauan',
        'Panamanian',
        'Papua New Guinean',
        'Paraguayan',
        'Peruvian',
        'Polish',
        'Portuguese',
        'Qatari',
        'Romanian',
        'Russian',
        'Rwandan',
        'Saint Lucian',
        'Salvadoran',
        'Samoan',
        'San Marinese',
        'Sao Tomean',
        'Saudi',
        'Scottish',
        'Senegalese',
        'Serbian',
        'Seychellois',
        'Sierra Leonean',
        'Singaporean',
        'Slovakian',
        'Slovenian',
        'Solomon Islander',
        'Somali',
        'South African',
        'South Korean',
        'Spanish',
        'Sri Lankan',
        'Sudanese',
        'Surinamer',
        'Swazi',
        'Swedish',
        'Swiss',
        'Syrian',
        'Taiwanese',
        'Tajik',
        'Tanzanian',
        'Thai',
        'Togolese',
        'Tongan',
        'Trinidadian or Tobagonian',
        'Tunisian',
        'Turkish',
        'Tuvaluan',
        'Ugandan',
        'Ukrainian',
        'Uruguayan',
        'Uzbekistani',
        'Venezuelan',
        'Vietnamese',
        'Welsh',
        'Yemenite',
        'Zambian',
        'Zimbabwean']
    passenger: number = 0;
    passengers: Array<Passenger> = [];
    @ViewChild('stepper') stepper;
    mode: string;
    mainSlideConfig = {
        "slidesToShow": 1,
        "slidesToScroll": 1,
        "dots": false,
        "infinite": true,
        "autoplay": false,
        "autoplaySpeed": 2500
    };
    // bigSliderConfig = {
    //   "slidesToShow": 1,
    //   "slidesToScroll": 1,
    //   "dots": false,
    //   "infinite": true,
    //   "autoplay": false,
    //   "autoplaySpeed": 2500
    // };
    maxQuantity: number;

    totalPackagePrice: number = 0;
    @Output() submitPackage: EventEmitter<any> = new EventEmitter();
    math = Math;
    agencyDetails: any;
    social: Social = new Social();
    isEditable = false;
    role: string;
    tmpImages = [];
    adult: number = 1;
    infant: number = 0;
    children: number = 0;

    maxDateAdult: Date = new Date(new Date().getFullYear() - 12, new Date().getMonth() - 1, new Date().getDay());
    maxDateChildren: Date = new Date(new Date().getFullYear() - 2, new Date().getMonth() - 1, new Date().getDay());
    minDateChildren: Date = new Date(new Date().getFullYear() - 11, new Date().getMonth() - 1, new Date().getDay());
    minDateInfant: Date = new Date(new Date().getFullYear() - 2, new Date().getMonth() - 1, new Date().getDay());

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.tmpImages = []
    }

    constructor(public imageService: ImageService,
                private cityService: CityService,
                private dateService: DateManagerService,
                private router: Router, @Inject(DOCUMENT) private doc: Document,
                private componentService: ComponentService,
                private inqueryService: InqueriesService,
                private visaService: VisaService,
                private agencyService: AgenciesService,
                private uploadService: UploadService,
                private auth: AuthService,
                private userService: UserService,
                private socialService: SocialService) {
    }


    ngOnInit() {
        this.getAgencyLogo();
        // this.stepper.next();
        // this.stepper.next();
        this.role = this.auth.getRole();
        if (this.role === 'company') {
            this.card.name = 'test';
            this.card.remarks = 'test';
            this.card.discount = 0;
            this.card.deadline.date = new Date(2020, 8, 20)
            this.userService.getAgencyConfig().subscribe((res: any) => {
                if (res.isSuccessful) {
                    Memory.setActiveCurrency(res.agency.config.currency)
                    this.maxQuantity = res.agency.config.max_quantity;
                }
            })
        }
        this.update = false;
        if (this.package) {
            this.update = true;
            Memory.setLoading(false);
            if (this.package.componentsData[0].associated_agency != 'amadeus' && this.package.componentsData[0].associated_agency != 'airasia') {
                this.card.from = this.package.componentsData[0].details.from.city;
            } else {
                this.cityService.getSuggestCity(this.package.componentsData[0].segments[0].flightSegment.departure.iataCode).subscribe((res: any) => {
                    if (res.isSuccessful && res.result.length > 0) {
                        if (res.result[0].extra.confidence === 10) {
                            this.card.from = res.result[0].city;
                        } else {
                            for (let item of res.result) {
                                if (item.extra.confidence === 10) {
                                    this.card.from = item.city;
                                }
                            }
                        }
                    } else {
                        this.card.from = this.package.componentsData[0].segments[0].flightSegment.departure.iataCode;
                    }
                })
            }
            // if (this.package.componentsData[0].associated_agency != 'amadeus' && this.package.componentsData[0].associated_agency != 'airasia'&& this.package.componentsData[0].associated_agency != 'agoda') {
            //     console.log(this.package);
            //     this.card.to = this.package.componentsData[0].details.to.city;
            // }else if(this.package.componentsData[0].associated_agency == 'agoda'){
            //
            // } else {
            //     this.cityService.getSuggestCity(this.package.componentsData[0].segments[this.package.componentsData[0].segments.length - 1].flightSegment.arrival.iataCode).subscribe((res: any) => {
            //         if (res.isSuccessful && res.result.length > 0) {
            //             if (res.result[0].extra.confidence === 10) {
            //                 this.card.to = res.result[0].city;
            //             } else {
            //                 for (let item of res.result) {
            //                     if (item.extra.confidence === 10) {
            //                         this.card.to = item.city;
            //                     }
            //                 }
            //             }
            //         } else {
            //             this.card.to = this.package.componentsData[0].segments[this.package.componentsData[0].segments.length - 1].flightSegment.arrival.iataCode;
            //         }
            //     })
            // }
            this.card.from = this.package.packageData.details.from;
            this.card.to = this.package.packageData.details.to;
            this.card.isDraft = this.package.packageData.status == 'DRAFT';
            this.card.isFeatured = this.package.packageData.isFeatured;
            this.card.discount = this.package.packageData.discount;
            this.card.remarks = this.package.packageData.remarks;
            this.card.name = this.package.packageData.name;
            this.card.deadline = this.package.packageData.tripDeadline;
            for (let item of this.package.packageData.images) {
                let cover = {
                    largeImageURL: item
                };
                this.card.cover.push(cover);
            }
            this.convertPackageToCard(this.package);
        }
    }

    getCityFromAmadeusCode(code) {
        this.cityService.getSuggestCity(code).subscribe((res: any) => {
            if (res.isSuccessful && res.result.length > 0) {
                if (res.result[0].extra.confidence === 10) {
                    console.log(1111111, res.result[0].city);
                    return res.result[0].city;
                } else {
                    for (let item of res.result) {
                        if (item.extra.confidence === 10) {
                            console.log(22222, item.city);
                            return item.city;
                        }
                    }
                }
            } else {
                return code;
            }
        })
    }


    initData() {
        let hasFrom = (this.card.from && this.card.from.length > 3);
        let hasTo = (this.card.to && this.card.to.length > 3);
        if (hasFrom && hasTo) {
            this.getImageForDestination(this.card.to)
            this.getAgencyLogo()
        }
    }

    getImageForDestination(d) {
        this.imageService.getImageSuggestion(d, false).subscribe((r: any) => {
            this.card.cover = r.result.hits;
        })
    }

    getAgencyLogo() {
        this.agencyService.getByReferalCode(Memory.getAgencyId()).subscribe((res: any) => {
            if (res.result) {
                this.agencyDetails = res.result;
                this.card.logo = res.result.logo;
            } else {
                Memory.setLoading(false);
            }
        })
    }

    generateDay(day, i) {

        this.selectedDate.push(moment(day.date).format('DD/MM/YYYY'));
        // this.card.days.push({
        //   date: moment(day.date).format('DD/MM/YYYY'),
        //   events: []
        // });
        this.card.days[i].date = moment(day.date).format('DD/MM/YYYY');
        // this.card.days.splice(i, 1);
        this.clearSelectedDays();
        this.sortDays();
        // console.log(this.card.days);
    }

    changeDateFormat() {
        // this.topFilter.from=moment(this.topFilter.from).format('DD/MM/YYYY')
        console.log(this.topFilter.from)

    }

    clearSelectedDays() {
        let j = 0;
        for (let item of this.selectedDate) {
            let i = 0;
            for (let sub of this.card.days) {
                if (item === sub.date) {
                    i++
                }
            }
            if (i === 0) {
                this.selectedDate.splice(j, 1);
            }
            j++;
        }
    }

    generateNewDay() {
        this.selectedDate.push(moment(this.newDay).format('DD/MM/YYYY'));
        this.card.days.push({
            date: moment(this.newDay).format('DD/MM/YYYY'),
            events: []
        });
        this.newDay = undefined;
    }

    getCities(value, type) {
        type === 'from' ? this.cityFromList = [] : this.cityToList = [];
        this.loader = true;
        this.componentService.autoSuggestionAirport(value, false).subscribe((res: any) => {
            if (res.isSuccessful) {
                type === 'from' ? this.cityFromList = res.result : this.cityToList = res.result;
                if (type === 'to') {
                    // this.card.days = [];
                    // this.selectedDate = [];
                }
                this.loader = false;
            }
        }, err => {
            console.log('milad', err)
        })

    }

    openMap(locData) {
        if (AppSettings.ITINERARY_MAP) {
            this.coordinates = locData;
            this.popUpMap = true;
        }

    }

    getCroods(event, type) {
        if (type === 'line') {
            this.componentService.autoSuggestionCity(event.details.from, false).subscribe(
                (response: any) => {
                    if (response) {

                        let r = response.result.filter(function (d) {
                            return d.CityName.toLowerCase().indexOf(event.details.from.toLowerCase()) > -1;
                        });
                        r = r[0];
                        r.Location = r.Location.split(',');
                        r.Location[0] = parseFloat(r.Location[0])
                        r.Location[1] = parseFloat(r.Location[1]);
                        event.location.pointA.lat = r.Location[0];
                        event.location.pointA.lng = r.Location[1];
                        this.componentService.autoSuggestionCity(event.details.to, false).subscribe(
                            (response: any) => {
                                if (response) {

                                    let n = response.result.filter(function (d) {
                                        return d.CityName.toLowerCase().indexOf(event.details.to.toLowerCase()) > -1;
                                    });
                                    n = n[0];
                                    n.Location = n.Location.split(',');
                                    n.Location[0] = parseFloat(n.Location[0]);
                                    n.Location[1] = parseFloat(n.Location[1]);
                                    event.location.pointB.lat = n.Location[0];
                                    event.location.pointB.lng = n.Location[1];
                                    console.log(1234567890, event);

                                }
                            });

                    }
                });
        } else {
            this.componentService.autoSuggestionCity(event.details.to, false).subscribe(
                (response: any) => {
                    if (response) {

                        let n = response.result.filter(function (d) {
                            return d.PlaceId.toLowerCase().indexOf(event.details.to.toLowerCase()) > -1;
                        });
                        n.Location = n.Location.split(',');
                        n.Location[0] = parseFloat(n.Location[0]);
                        n.Location[1] = parseFloat(n.Location[1]);
                        event.location.pointA.lat = n.Location[0];
                        event.location.pointA.lng = n.Location[1];

                    }
                });
        }


    }

    toSelected() {
        this.canAirplane = false;
        for (let item of this.cityToList) {
            if (item.CityName === this.card.to) {
                this.card.toIso = item.PlaceId;
                this.topFilter.toIso = this.card.toIso;
                this.canAirplane = true;
                break;
            }
        }
    }

    fromSelected() {
        this.canAirplane = false;
        for (let item of this.cityFromList) {
            if (item.CityName === this.card.from) {
                this.card.fromIso = item.PlaceId;
                this.topFilter.fromIso = this.card.fromIso;
                this.canAirplane = true;
                break;
            }
        }
    }


    images1: Array<any> = [];
    imageLogo: Array<any> = [];

    uploadFinished(event) {
        // TODO

        if (!this.card.cover) {
            this.card.cover = []
        }
        let newImage = event.serverResponse.response.body.result.path;
        this.card.cover.push({largeImageURL: newImage});
        this.images1.push(newImage);
        console.log(this.images1)
    }

    onRemoved(event) {
        let toRemoveImage = event.serverResponse.response.body.result.path,
            index = this.card.cover.indexOf(toRemoveImage);

        this.card.cover.splice(index, 1);
        this.images1.splice(index, 1)
        // this.tripData[0].images
    }

    uploadFinishedLogo(event) {
        this.imageLogo.push(event.serverResponse.response.body.result.path);
        this.card.logo=event.serverResponse.response.body.result.path;
    }


    coverUpload(){
        $('#picture .img-ul .img-ul-file-upload .img-ul-upload input').click()
    }
    logoUpload(){
        $('#agencyLogo .img-ul .img-ul-file-upload .img-ul-upload input').click()
    }

    fileChangeListenerPic($event) {
        let image = new Image();
        const file = $event.target.files[0];
        const myReader: FileReader = new FileReader();
        const that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.card.cover.push({largeImageURL: image.src});
        };
        myReader.readAsDataURL(file);
        this.uploadService.upload(file, '5c15efb47b741fff2044ec26').subscribe((res: any) => {
            if (res.isSuccessful) {
                this.card.cover.push({largeImageURL: res.result.path});
            }
        })
    }

    fileChangeListenerLogo($event) {
        let image = new Image();
        const file = $event.target.files[0];
        const myReader: FileReader = new FileReader();
        const that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.card.logo = image.src
        };
        myReader.readAsDataURL(file);
        this.uploadService.upload(file, '5c15efb47b741fff2044ec26').subscribe((res: any) => {
            if (res.isSuccessful) {
                this.card.logo = res.result.path;
            }
        })
    }

    currentDay: any;

    mouseEnter(day) {
        console.log(this.dragData)
        this.currentDay = day;
        if (this.dragData) {
            day.drop = true;
            day.drop = true;

        }

    }

    getMaxDeadlineDate() {
        return this.generateDateFromString(this.card.days[0].date)
    }

    ngOnChanges(changes: SimpleChanges): void {
        // this.update=false;
        // if(changes.package.currentValue){
        //   this.update=true;
        //   Memory.setLoading(false);
        //   console.log(this.package);
        //   this.card.from=this.package.componentsData[0].details.from.city;
        //   this.card.from=this.package.componentsData[0].details.to.city;
        //   this.card.isDraft=this.package.packageData.status=='DRAFT';
        //   this.card.isFeatured=this.package.packageData.isFeatured;
        //   this.card.discount=this.package.packageData.discount;
        //   this.card.remarks=this.package.packageData.remarks;
        //   this.card.deadline=this.package.packageData.tripDeadline;
        //   for(let item of this.package.packageData.images){
        //     let cover={
        //       largeImageURL:item
        //     };
        //     this.card.cover.push(cover);
        //   }
        //   this.convertPackageToCard(this.package);
        // }
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
        return (window.pageYOffset >= this.pageHeight) ? `${this.checkSideBarSize()} sticky-drop` : '';
    }

    checkStickySearch() {
        return (window.pageYOffset >= this.pageHeight) ? 'sticky-search' : '';
    }

    slickReinit() {
        $('.slick-slider').slick('reinit');
    }


    center = L.latLng([46.879966, -121.726909]);

    changeFilter(event, item) {
        this.topFilter[item] = event.checked;
        this.getComponent()
    }

    checkPriceOfPackage(p) {
        let price = 0
        p.componentsData.forEach((v, k) => {
            price = price + v.bulkPrice;

        })
        return `${Memory.getActiveCurrency() ? Memory.getActiveCurrency() : 'PHP'} ${price - (p.packageData.discount * price) / 100}`;
    }


    checkValidDate = (d: Date): boolean => {
        return this.selectedDate.indexOf(moment(d).format('DD/MM/YYYY')) == -1;
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

    getSharedComponent(filter, query) {
        Memory.setLoading(true);
        let body;
        if (query) {
            body = {
                type: 'dateRange',
                name: 'details.from.departure.date',
                value: query
            }
        }
        this.componentService.getFilteredComponentPost(`asSharable=true${filter}`, [body]).subscribe(
            (response: any) => {
                this.changeLoading = false;
                if (response) {
                    for (let item of response) {
                        if (item.associated_agency !== Memory.getAgencyId() && !this.checkExpire(item.deadline)) {
                            this.cardsData.push(item);
                        }
                    }
                    // Memory.setLoading(false);
                }
            });
        if (this.topFilter.hotel) {
            this.changeLoading = true;
            this.componentService.getExternalHotelResource(this.card.toIso ? this.card.toIso : 'MNL').subscribe((response: any) => {
                if (response.isSuccessful) {
                    this.loaderType = ''
                    this.changeLoading = false;
                    for (let item of response.result) {
                        // if (item.associated_agency !== Memory.getAgencyId()&& !this.checkExpire(item.deadline)) {
                        this.cardsData.push(item);
                    }
                    // Memory.setLoading(false);
                } else {
                    this.loaderType = ''

                    this.changeLoading = false;
                }

            })
            if (this.topFilter.shared && this.topFilter.from) {
                let obj = {
                    CheckIn: this.topFilter.from ? moment(this.topFilter.from).format('YYYY-MM-DD') + 'T00:00:00' : "2019-06-05T00:00:00",
                    cityId: this.topFilter.agCityId
                }
                this.loaderType = 'hotel'
                this.componentService.getAgodaHotels(obj).subscribe((res: any) => {
                    if (res.isSuccessful) {
                        this.loaderType = ''
                        for (let item of res.result) {
                            // if (item.associated_agency !== Memory.getAgencyId()&& !this.checkExpire(item.deadline)) {
                            this.cardsData.push(item);
                        }
                        // Memory.setLoading(false);
                    }else{
                        this.loaderType = ''

                    }
                })
            }
        }

        if (this.topFilter.airfare && this.role !== 'company') {
            let destinationData = {
                "origin": this.topFilter.fromIso ? this.topFilter.fromIso : 'MAD',
                "destination": this.topFilter.toIso ? this.topFilter.toIso : 'NYC',
                "departureDate": this.topFilter.from ? moment(this.topFilter.from).format('YYYY-MM-DD') : "2019-06-05"
            }
            this.changeLoading = true;
            this.loaderType = 'airfare'
            this.componentService.getExternalAirfareResource(destinationData).subscribe((response: any) => {
                if (response.isSuccessful) {
                    this.loaderType = ''

                    this.changeLoading = false
                    for (let item of response.result) {
                        // if (item.associated_agency !== Memory.getAgencyId()&& !this.checkExpire(item.deadline)) {
                        this.cardsData.push(item);
                    }
                } else {
                    this.loaderType = ''

                    this.changeLoading = false;
                }
            })
        }
        // if (this.topFilter.airfare) {
        //     let obj = {
        //         "from": this.topFilter.fromIso ? this.topFilter.fromIso : 'MAD',
        //         "to": this.topFilter.toIso ? this.topFilter.toIso : 'NYC',
        //         "date": this.topFilter.from ? moment(this.topFilter.from).format('YYYY-MM-DD') : "2019-06-05"
        //     }
        //     this.filterAirasia.from = this.topFilter.fromIso ? this.topFilter.fromIso : 'MAD';
        //     this.filterAirasia.to = this.topFilter.toIso ? this.topFilter.toIso : 'NYC';
        //     this.filterAirasia.date = this.topFilter.from ? moment(this.topFilter.from).format('YYYY-MM-DD') : "2019-06-05";
        //
        //     this.changeLoading = true;
        //     this.loaderType = 'airfare'
        //     this.componentService.getExternalAirfareResourceAirAsia(obj).subscribe((response: any) => {
        //         if (response.isSuccessful) {
        //             this.loaderType = ''
        //
        //             this.changeLoading = false
        //             for (let item of response.result) {
        //                 // if (item.associated_agency !== Memory.getAgencyId()&& !this.checkExpire(item.deadline)) {
        //                 this.cardsData.push(item);
        //             }
        //         } else {
        //             this.loaderType = ''
        //
        //             this.changeLoading = false;
        //         }
        //     })
        // }


    }

    deletePackageOne(component) {
        let self = this;
        this.cardsData.forEach(function (item, index) {
            if (item._id === component._id) {
                self.cardsData.splice(index, 1)
            }
        })
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

    deleteEvent(event) {
        this.totalPackagePrice = this.totalPackagePrice - event.price;
        for (let item of this.card.days) {
            let removeValFromIndex = [];
            if (event.type != 'van-driver') {
                item.events.forEach(function (sub, index) {
                    if (sub.componentId === event.componentId) {
                        removeValFromIndex.push(index)
                        // item.events.splice(index,1);
                    }
                });
            } else {
                item.events.forEach(function (sub, index) {
                    if (sub.componentId === event.componentId && sub.temp === event.temp) {
                        removeValFromIndex.push(index)
                    }
                });
            }
            for (let i = removeValFromIndex.length - 1; i >= 0; i--)
                item.events.splice(removeValFromIndex[i], 1);
        }
        if (event.associated_agency === 'amadeus' || event.associated_agency === 'airasia') {
            for (let item of this.cardsData) {
                if (item._id === event.componentId) {
                    item.quantity += parseInt(event.quantity);
                    break;
                }
            }
        } else if (event.type == 'van-driver' && !this.checkRoundTripVanExist(event)) {
            for (let item of this.cardsData) {
                if (item._id === event.componentId) {
                    item.quantity += parseInt(event.quantity);
                    break;
                }
            }
        } else if (event.type == 'van-driver' && this.checkRoundTripVanExist(event)) {

        } else {
            for (let item of this.cardsData) {
                if (item._id === event.componentId) {
                    item.quantity += parseInt(event.quantity);
                    break;
                }
            }
        }
        this.calculatePackagePrice()
        // day.events.splice(eventIndex, 1);

    }

    checkSideBarSize() {
        return !!$('.sidebar.small').index() ? 'small-card' : 'large-card';
    }

    checkRoundTripVanExist(event: Event): boolean {
        let count = 0;
        for (let item of this.card.days) {
            for (let sub of item.events) {
                if (sub.componentId === event.componentId) {
                    count += 1;
                }

            }
        }
        if (count >= 1) {
            return true;
        }
        return false;
    }

    getMultipleComponent(data) {
        this.packages = [];
        this.componentService.getMultipleComponent(data).subscribe(
            (response: any) => {
                let tmpPackage: any;
                var valid: boolean = true;
                Memory.setLoading(false);
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
        this.componentService.getPackagesFilter(`associated_agency=${Memory.getAgencyId()}`).subscribe(
            (response: any) => {
                if (response) {
                    console.log(response)
                    if (response == []) {
                        this.packages = [];
                    } else {
                        response.forEach((v, k) => {
                            this.getMultipleComponent(v)
                        })
                    }
                }
            });
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

    clickList() {
        this.packageList = !this.packageList;
        this.cancelUpdate(true)
        this.packages = [];
        if (this.packageList === true) {
            this.getPackages()
        }
    }

    dropClicked(event) {
        if (event.operatorName == 'addAirfare') {
            this.router.navigate(['/panel/component'], {queryParams: {mode: 'AIRPLANE'}})

        } else if (event.operatorName == 'addHotel') {
            this.router.navigate(['/panel/component'], {queryParams: {mode: 'hotel-room'}})

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

    doFilter: boolean = false;

    getComponents(day, type) {
        this.doFilter = true;
        this.selectTypeEmit({
            from: day.date,
            type: type,
            cityFrom: this.card.from,
            cityTo: this.card.to,
            fromIso: this.card.fromIso,
            toIso: this.card.toIso
        })
    }

    fromDateTemp: string;
    toDateTemp: string;

    searchComponent() {
        Memory.setLoading(true);
        this.loaderType = 'hotel';
        this.doFilter = true;
        this.topFilter.fromIso = this.card.fromIso;
        this.fromDateTemp = this.generateDateFromString(this.topFilter.from);
        this.toDateTemp = this.generateDateFromString(this.topFilter.to);

        this.topFilter.toIso = this.card.toIso;
        this.topFilter.cityFrom = this.card.from.toLowerCase();
        this.topFilter.cityTo = this.card.to.toLowerCase();
        if (event.type === 'airfare') {
            this.topFilter.airfare = true;
            this.topFilter.hotel = false;
            this.topFilter.van = false;
        } else if (event.type === 'hotel') {
            this.topFilter.airfare = false;
            this.topFilter.hotel = true;
            this.topFilter.van = false;
        } else if (event.type === 'van') {
            this.topFilter.airfare = false;
            this.topFilter.hotel = false;
            this.topFilter.van = true;
        }
        this.getComponent()
    }

    selectTypeEmit(event) {
        this.fromDateTemp = this.generateDateFromString(event.from);
        this.topFilter.from = this.generateDateFromString(event.from);
        this.topFilter.fromIso = event.fromIso;
        this.topFilter.toIso = event.toIso;
        this.topFilter.cityFrom = event.cityFrom.toLowerCase();
        this.topFilter.cityTo = event.cityTo.toLowerCase();
        if (event.type === 'airfare') {
            this.topFilter.airfare = true;
            this.topFilter.hotel = false;
            this.topFilter.van = false;
        } else if (event.type === 'hotel') {
            this.topFilter.airfare = false;
            this.topFilter.van = false;
            this.topFilter.hotel = true;
        } else if (event.type === 'van') {
            this.topFilter.airfare = false;
            this.topFilter.hotel = false;
            this.topFilter.van = true;
        }
        this.getComponent()
    }


    getComponent() {
        this.cardsData = []
        let filter = '';
        if (this.topFilter.hotel && !this.topFilter.airfare && !this.topFilter.van) {
            filter += '&type=hotel-room';
        }
        if (this.topFilter.airfare && !this.topFilter.hotel && !this.topFilter.van) {
            filter += '&type=AIRPLANE';
        }
        if (this.topFilter.van && !this.topFilter.hotel && !this.topFilter.airfare) {
            filter += '&type=van-driver';
        }
        if (this.topFilter.cityFrom) {
            filter += `&details.from.city=${this.card.from.toLowerCase()}`
        }
        if (this.topFilter.cityTo) {
            filter += `&details.to.city=${this.card.to.toLowerCase()}`
        }
        // {"$gte": new Date(fromDate.split(' ')[2],fromDate.split(' ')[1]-1,fromDate.split(' ')[0]), "$lt": new Date(toDate.split(' ')[2],toDate.split(' ')[1]-1,toDate.split(' ')[0])};
        let query = {};
        if (this.topFilter.from) {
            query['$gte'] = new Date(parseInt(this.fromDateTemp.split('-')[0]),
                parseInt(this.fromDateTemp.split('-')[1]) - 1,
                parseInt(this.fromDateTemp.split('-')[2]))
        }

        if (this.topFilter.to) {
            query['$lt'] = new Date(parseInt(this.toDateTemp.split('/')[0]),
                parseInt(this.toDateTemp.split('/')[1]) - 1,
                parseInt(this.toDateTemp.split('/')[2]))
        }

        if (!this.topFilter.hotel && !this.topFilter.airfare && !this.topFilter.van) {
            if (this.topFilter.shared)
                this.getSharedComponent(filter, query);
            else {
                this.changeLoading = false;
                this.cardsData = [];
            }
        } else {
            let body;
            if (query !== {}) {
                body = [{
                    type: 'dateRange',
                    name: 'details.from.departure.date',
                    value: query
                }]
                if (this.topFilter.quantity) {
                    body.push({

                        type: 'numberRange',
                        name: 'quantity',
                        value: this.topFilter.quantity

                    })
                }
            }
            this.componentService.getFilteredComponentPost(`asPackage=true&associated_agency=${Memory.getAgencyId()}${filter}`, body).subscribe(
                (response: any) => {
                    if (response) {
                        for (let item of response) {
                            if (item.type !== 'van-driver' && !this.checkExpire(item.deadline)) {
                                this.cardsData.push(item);
                            }
                            if (item.type === 'van-driver') {
                                this.cardsData.push(item);

                            }
                        }
                        // this.cardsData = response;
                        // this.showNotification('top','center',"success","Component sucessfully added.")
                    }
                    if (this.topFilter.shared) {
                        this.getSharedComponent(filter, query);
                    } else {
                        this.changeLoading = false;
                    }
                });
        }
    }


    generateDateFromString(from): any {
        // let date = from.split('/');
        return moment(from, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }

    generateNativeDateFromString(from): any {
        let date = from.split('/');
        return new Date(parseInt(date[2]), parseInt(date[1]) - 1, parseInt(date[0])).getTime();
    }

    generateDateFrom(from): any {
        // let date = from.split('/');
        from = moment(from, 'DD/MM/YYYY').format('M/DD/YYYY');

        return new Date(from);
    }

    componentDropped(e) {
        if (e.previousContainer.id === 'list-1') {
            let indexOfDay = e.container.id.split('-')[3];
            let dragData = this.cardsData[e.previousIndex];
            if (this.checkComponentValid(dragData)) {
                if (dragData.associated_agency != 'airasia' && dragData.quantity === 0 || (dragData.associated_agency != 'airasia' && dragData.quantity < this.topFilter.quantity)) {
                    const notifyConfig = new NotifyConfig(
                        Notify.Type.WARNING,
                        Notify.Placement.TOP_CENTER,
                        Notify.TEMPLATES.Template2,
                        'No enough seats for this trip element, Please choose another one',
                        ''
                    );
                    Notify.showNotify(notifyConfig);
                } else {
                    let moreQuantity = 0;
                    if (dragData.quantity - this.topFilter.quantity < 0) {
                        moreQuantity = this.topFilter.quantity - dragData.quantity;
                        dragData.quantity = 0;
                    } else
                        dragData.quantity = dragData.quantity - this.topFilter.quantity;
                    let data: Event = new Event();
                    if (dragData.associated_agency !== 'amadeus' && dragData.associated_agency !== 'airasia' || dragData.type == 'hotel-room') {
                        data.time = dragData.type === 'hotel-room' ? '12:00' : (dragData.type != 'van-driver' ? dragData.details.from.departure.time : '00:00');
                        data.type = dragData.type;
                        if (dragData.type === 'hotel-room' && dragData.images) {
                            data.images = dragData.images;
                        }
                        if (dragData.type === 'hotel-room' || dragData.type === 'van-driver') {
                            data.dayOfTour = 1
                        }
                        data.quantity = this.topFilter.quantity;
                        data.adult = this.adult;
                        data.children = this.children;
                        data.infant = this.infant;
                        data.componentId = dragData._id;
                        data.details.from = dragData.details.from.city;
                        data.details.to = dragData.type === 'van-driver' ? this.topFilter.cityTo : dragData.details.to ? dragData.details.to.city : (dragData.hotelName ? dragData.hotelName : dragData.name);
                        data.location.address = 'Something Company #14 Main Ave. Detro St.';
                        data.location.type = dragData.type === 'AIRPLANE' ? 'line' : 'pin';
                        data.price = this.exchange(dragData);
                        data.childPrice = this.exchangeChild(dragData);
                        data.externalRes = dragData.associated_agency === 'agoda' ? dragData : null;
                        dragData.details.roundTrip ? this.checkRoundTrip(dragData) : null;

                        let data1: Event = new Event();
                        data1.time = dragData.type === 'hotel-room' ? '12:00' : (dragData.type != 'van-driver' ? dragData.details.from.departure.time : '13:00');
                        if (dragData.type === 'hotel-room' && dragData.images) {
                            data1.images = dragData.images;
                        }
                        data1.quantity = this.topFilter.quantity;
                        data1.type = dragData.type;
                        data1.componentId = dragData._id;
                        data1.details.from = dragData.details.from.city;
                        data1.details.to = dragData.type === 'van-driver' ? this.topFilter.cityTo : dragData.details.to ? dragData.details.to.city : (dragData.hotelName ? dragData.hotelName : dragData.name);
                        data1.location.address = 'Something Company #14 Main Ave. Detro St.';
                        data1.location.type = dragData.type === 'AIRPLANE' ? 'line' : 'pin';
                        data1.externalRes = dragData.associated_agency === 'agoda' ? dragData : null;
                        data1.temp = true;
                        data1.price = this.exchange(dragData);
                        data1.childPrice = this.exchangeChild(dragData);
                        data1.arrival = true;


                        let fromDate = dragData.type === 'van-driver' ? this.topFilter.from : dragData.details.from.departure.date;
                        let toDate = dragData.type === 'van-driver' ? this.topFilter.from : dragData.details.from.arrival.date;
                        if (this.card.days.length > 0 && indexOfDay && moment(fromDate).format('DD/MM/YYYY') === this.card.days[indexOfDay].date) {
                            this.getCroods(data, data.location.type);
                            this.card.days[indexOfDay].events.splice(e.currentIndex, 0, data);
                            let coefficient = 1;
                            if (data.type === 'hotel-room') {
                                coefficient = Math.floor(data.quantity / 2) + 1
                            } else if (data.type === 'van-driver') {
                                coefficient = Math.floor(data.quantity / 15) + 1
                            }
                            this.totalPackagePrice += parseFloat(data.price) * coefficient;
                            for (let sub of this.card.days) {
                                if (this.checkDateExist(moment(toDate).format('DD/MM/YYYY'))) {
                                    if (sub.date === moment(toDate).format('DD/MM/YYYY')) {
                                        sub.events.push(data1);
                                        break;
                                    }
                                } else {
                                    this.selectedDate.push(moment(toDate).format('DD/MM/YYYY'));
                                    this.card.days.push({
                                        date: moment(toDate).format('DD/MM/YYYY'),
                                        events: [data1]
                                    });
                                    break;
                                }

                            }
                            if (dragData.type === 'van-driver') {
                                this.calculateComponentDuration(data).then((component1: any) => {
                                    event = component1;
                                    for (let item of this.card.days) {
                                        for (let sub of item.events) {
                                            if (sub.componentId == data.componentId) {
                                                sub.dayOfTour = data.dayOfTour;
                                            }
                                        }
                                    }
                                    this.calculatePackagePrice()
                                });
                            }
                        } else {
                            if (this.card.days.length > 0) {
                                for (let sub of this.card.days) {
                                    if (this.checkDateExist(moment(fromDate).format('DD/MM/YYYY'))) {
                                        if (sub.date === moment(fromDate).format('DD/MM/YYYY')) {
                                            sub.events.push(data);
                                            break;
                                        }
                                    } else {
                                        this.selectedDate.push(moment(fromDate).format('DD/MM/YYYY'));
                                        this.card.days.push({
                                            date: moment(fromDate).format('DD/MM/YYYY'),
                                            events: [data]
                                        });
                                        break;
                                    }
                                }
                                this.getCroods(data, data.location.type);
                                let coefficient = 1;
                                if (data.type === 'hotel-room') {
                                    coefficient = Math.floor(data.quantity / 2) + 1
                                } else if (data.type === 'van-driver') {
                                    coefficient = Math.floor(data.quantity / 15) + 1
                                }
                                // this.card.days[indexOfDay].events.splice(e.currentIndex, 0, data);
                                this.totalPackagePrice += parseFloat(data.price) * coefficient;
                                for (let sub of this.card.days) {
                                    if (this.checkDateExist(moment(toDate).format('DD/MM/YYYY'))) {
                                        if (sub.date === moment(toDate).format('DD/MM/YYYY')) {
                                            sub.events.push(data1);
                                            break;
                                        }
                                    } else {
                                        this.selectedDate.push(moment(toDate).format('DD/MM/YYYY'));
                                        this.card.days.push({
                                            date: moment(toDate).format('DD/MM/YYYY'),
                                            events: [data1]
                                        });
                                        break;
                                    }

                                }
                            } else {
                                this.selectedDate.push(moment(fromDate).format('DD/MM/YYYY'));
                                this.card.days.push({
                                    date: moment(fromDate).format('DD/MM/YYYY'),
                                    events: [data]
                                });
                                if (moment(toDate).format('DD/MM/YYYY') === this.card.days[0].date) {
                                    this.getCroods(data1, data1.location.type);
                                    this.card.days[0].events.push(data1);
                                } else {
                                    this.selectedDate.push(moment(toDate).format('DD/MM/YYYY'));
                                    this.card.days.push({
                                        date: moment(toDate).format('DD/MM/YYYY'),
                                        events: [data1]
                                    });
                                    this.getCroods(data, data.location.type);
                                }
                                let coefficient = 1;
                                if (data.type === 'hotel-room') {
                                    coefficient = Math.floor(data.quantity / 2) + 1
                                } else if (data.type === 'van-driver') {
                                    coefficient = Math.floor(data.quantity / 15) + 1
                                }
                                // this.card.days[indexOfDay].events.splice(e.currentIndex, 0, data);
                                this.totalPackagePrice += parseFloat(data.price) * coefficient;
                            }


                        }

                    } else {
                        let i = 0;
                        for (let segment of dragData.segments) {
                            let data2: Event = new Event();
                            data2.quantity = this.topFilter.quantity;

                            data2.time = segment.flightSegment.departure.at.split('T')[1].substring(0, 5);
                            data2.type = dragData.type;
                            data2.componentId = dragData._id;
                            data2.details.from = segment.flightSegment.departure.iataCode;
                            data2.details.to = segment.flightSegment.arrival.iataCode;
                            data2.location.address = 'Something Company #14 Main Ave. Detro St.';
                            data2.location.type = dragData.type === 'AIRPLANE' ? 'line' : 'pin';
                            data2.externalRes = dragData;
                            let data3: Event = new Event();
                            data3.quantity = this.topFilter.quantity;
                            data3.time = segment.flightSegment.arrival.at.split('T')[1].substring(0, 5);
                            data3.type = dragData.type;
                            data3.componentId = dragData._id;
                            data3.details.from = segment.flightSegment.departure.iataCode;
                            data3.details.to = segment.flightSegment.arrival.iataCode;
                            data3.location.address = 'Something Company #14 Main Ave. Detro St.';
                            data3.location.type = dragData.type === 'AIRPLANE' ? 'line' : 'pin';
                            data3.externalRes = dragData;
                            data3.price = this.exchangeAmadeus(dragData);
                            data3.childPrice = this.exchangeAmadeusChild(dragData);
                            data3.arrival = true;
                            data3.temp = true;
                            let coefficient = 1;
                            if (data.type === 'hotel-room') {
                                coefficient = Math.floor(data2.quantity / 2) + 1
                            } else if (data.type === 'van-driver') {
                                coefficient = Math.floor(data2.quantity / 15) + 1
                            }
                            if (this.card.days.length > 0) {
                                for (let sub of this.card.days) {
                                    if (i === 0) {

                                        data2.price = this.exchangeAmadeus(dragData);
                                        data2.childPrice = this.exchangeAmadeusChild(dragData);
                                        this.totalPackagePrice += parseFloat(data2.price) * coefficient;
                                    } else {
                                        data2.temp = true;
                                    }
                                    i++;
                                    data2.externalRes = dragData;
                                    if (this.checkDateExist(this.parseISOString(segment.flightSegment.departure.at))) {
                                        if (this.parseISOString(segment.flightSegment.departure.at) === sub.date) {
                                            this.getCroods(data2, data2.location.type);
                                            sub.events.splice(e.currentIndex, 0, data2);
                                        }
                                    } else {
                                        this.selectedDate.push(this.parseISOString(segment.flightSegment.departure.at));
                                        this.getCroods(data2, data2.location.type);
                                        this.card.days.push({
                                            date: this.parseISOString(segment.flightSegment.departure.at),
                                            events: [data2]
                                        });
                                    }
                                    if (this.checkDateExist(this.parseISOString(segment.flightSegment.arrival.at))) {
                                        if (this.parseISOString(segment.flightSegment.arrival.at) === sub.date) {
                                            this.getCroods(data3, data3.location.type);
                                            sub.events.splice(e.currentIndex, 0, data3);
                                        }
                                    } else {
                                        this.selectedDate.push(this.parseISOString(segment.flightSegment.arrival.at));
                                        this.getCroods(data3, data3.location.type);

                                        this.card.days.push({
                                            date: this.parseISOString(segment.flightSegment.arrival.at),
                                            events: [data3]
                                        });
                                    }
                                }

                            } else {
                                data2.price = this.exchangeAmadeus(dragData);
                                data2.childPrice = this.exchangeAmadeusChild(dragData);
                                this.totalPackagePrice += parseFloat(data2.price) * coefficient;
                                console.log('______________________', this.totalPackagePrice, this.exchangeAmadeus(dragData), '__________________')
                                this.selectedDate.push(this.parseISOString(segment.flightSegment.departure.at));
                                this.getCroods(data2, data2.location.type);
                                this.card.days.push({
                                    date: this.parseISOString(segment.flightSegment.departure.at),
                                    events: [data2]
                                });
                                if (this.parseISOString(segment.flightSegment.arrival.at) === this.card.days[0].date) {
                                    this.getCroods(data3, data3.location.type);
                                    this.card.days[0].events.push(data3);
                                } else {
                                    this.selectedDate.push(moment(segment.flightSegment.arrival.at).format('DD/MM/YYYY'));
                                    this.card.days.push({
                                        date: moment(segment.flightSegment.arrival.at).format('DD/MM/YYYY'),
                                        events: [data3]
                                    });
                                    this.getCroods(data, data.location.type);
                                }
                            }
                            this.deleteDuplicateData()
                        }
                    }

                }
            } else {
                const notifyConfig = new NotifyConfig(
                    Notify.Type.WARNING,
                    Notify.Placement.TOP_CENTER,
                    Notify.TEMPLATES.Template2,
                    'duplicate component',
                    ''
                );
                Notify.showNotify(notifyConfig);
            }
            for (let item of this.card.days) {
                this.sortByTime(item);
            }

        }
        else if (e.previousContainer.id !== 'list-1') {
            if (e.previousContainer.id == e.container.id) {
                let indexCurrentDay = e.container.id.split('-')[3];
                this.card.days[indexCurrentDay].events = this.move(this.card.days[indexCurrentDay].events, e.previousIndex, e.currentIndex)
            } else {
                let indexPreviousDay = e.previousContainer.id.split('-')[3];
                let indexCurrentDay = e.container.id.split('-')[3];
                this.card.days[indexCurrentDay].events.splice(e.currentIndex, 0, this.card.days[indexPreviousDay].events[e.previousIndex]);
                this.card.days[indexPreviousDay].events.splice(e.previousIndex, 1);
                let event = this.card.days[indexCurrentDay].events[e.currentIndex]
                if (event.type === 'hotel-room' && event.externalRes) {
                    event.externalRes.details.from.arrival.date = this.generateDateFrom(this.card.days[indexCurrentDay].date)
                }
                if (event.type === 'hotel-room' || event.type === 'van-driver') {
                    this.calculateComponentDuration(event).then((component1: any) => {
                        event = component1;
                        for (let item of this.card.days) {
                            for (let sub of item.events) {
                                if (sub.componentId == event.componentId) {
                                    sub.dayOfTour = event.dayOfTour;
                                    if (event.type === 'hotel-room' && event.externalRes) {

                                        event.externalRes.details.dayOfTour = event.dayOfTour;
                                    }
                                }
                            }
                        }
                        this.calculatePackagePrice()
                    });
                }
            }
        }
        this.sortDays();

    }

    calculatePackagePrice() {
        this.totalPackagePrice = 0;
        for (let item of this.card.days) {
            for (let sub of item.events) {
                if (!sub.temp && !sub.pair) {
                    sub.quantity = sub.adult + sub.children + sub.infant;
                    let coefficient = 1;
                    if (sub.type === 'hotel-room') {
                        coefficient = Math.floor(sub.quantity / 2) + 1
                    } else if (sub.type === 'van-driver') {
                        coefficient = Math.floor(sub.quantity / 15) + 1
                    }
                    if (sub.type === 'hotel-room' || sub.type === 'van-driver') {
                        this.totalPackagePrice += (sub.price * sub.dayOfTour * coefficient) - ((sub.price - sub.childPrice) * sub.dayOfTour * coefficient);
                    } else {
                        this.totalPackagePrice += (sub.price * coefficient) - ((sub.price - sub.childPrice) * coefficient);
                    }
                }

            }
        }
    }

    calculateComponentDuration(component: Event) {
        return new Promise(resolve => {
            let from;
            let to;
            for (let item of this.card.days) {
                item.events.filter(event => {
                    if (event.componentId === component.componentId && event.temp) {
                        from = item.date;
                    } else if (event.componentId === component.componentId && !event.temp) {
                        to = item.date;
                    }
                })
            }
            component.dayOfTour = this.dayBetweenTwoDateInDay(from, to);
            if (component.type === 'van-driver') {
                component.dayOfTour += 1;
            }
            resolve(component)
        })

    }

    dayBetweenTwoDateInDay(from, to) {
        from = moment(from, 'DD/MM/YYYY').format('M/DD/YYYY');
        to = moment(to, 'DD/MM/YYYY').format('M/DD/YYYY');
        const date1 = new Date(from);
        const date2 = new Date(to);
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays
    }


    deleteDuplicateData() {
        for (let item of this.card.days) {
            item.events = this.getUnique(item.events, 'time')
        }
    }

    getUnique(arr, comp) {
        const unique = arr
            .map(e => e[comp])
            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)
            // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);
        return unique;
    }

    deleteDay(count, day: Day) {
        for (let item of day.events) {
            for (let dayItem of this.card.days) {
                let removeValFromIndex = [];
                let self = this;
                dayItem.events.forEach(function (eventItem, indexEvent) {
                    if (item.componentId === eventItem.componentId) {
                        removeValFromIndex.push(indexEvent);
                        if (!eventItem.temp || !eventItem.arrival) {
                            self.totalPackagePrice -= eventItem.price * eventItem.quantity
                        }
                    }
                });
                for (let i = removeValFromIndex.length - 1; i >= 0; i--)
                    dayItem.events.splice(removeValFromIndex[i], 1);
            }
        }
        this.selectedDate.splice(this.selectedDate.indexOf(day.date), 1);
        this.card.days.splice(count, 1);
        this.calculatePackagePrice()
        // if (this.card.days.length === 0) {
        // this.cardsData = [];
        // }
    }

    checkComponentValid(component) {
        let id = component._id
        for (let item of this.card.days) {
            for (let sub of item.events) {
                if (id == sub.componentId) {
                    return false;
                }
            }
        }
        return true
    }

    checkDateExist(date) {
        if (this.card.days.length > 0) {
            let i = 0;
            this.card.days.filter(value => {
                if (value.date === date) {
                    i++;
                }
            })
            return i > 0;
        }

    }

    parseISOString(s) {
        var b = s.split(/\D+/);
        return moment(new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]))).format('DD/MM/YYYY');
    }

    exchange(component) {
        if (component.currency) {
            if (component.currency === Memory.getActiveCurrency()) {
                return parseFloat(component.bulkPrice);
            } else if (component.currency != Memory.getActiveCurrency()) {
                return parseFloat(component.bulkPrice) * parseFloat(Memory.getCurrency()[`${component.currency}_${Memory.getActiveCurrency()}`])
            }
        } else {
            return parseFloat(component.bulkPrice);
        }
    }

    exchangeChild(component) {
        if (component.currency) {
            if (component.currency === Memory.getActiveCurrency()) {
                return parseFloat(component.bulkPriceChild);
            } else if (component.currency != Memory.getActiveCurrency()) {
                return parseFloat(component.bulkPriceChild) * parseFloat(Memory.getCurrency()[`${component.currency}_${Memory.getActiveCurrency()}`])
            }
        } else {
            return parseFloat(component.bulkPriceChild);
        }
    }

    exchangeAmadeus(component) {
        if (component.associated_agency === 'airasia') {
            if ('PHP' === Memory.getActiveCurrency()) {
                console.log(parseFloat(component.bulkPrice));
                return parseFloat(component.bulkPrice);
            } else {
                return parseFloat(component.bulkPrice) * parseFloat(Memory.getCurrency()[`PHP_${Memory.getActiveCurrency()}`])
            }
        } else {
            if ('EUR' === Memory.getActiveCurrency()) {
                return parseFloat(component.bulkPrice);
            } else {
                return parseFloat(component.bulkPrice) * parseFloat(Memory.getCurrency()[`EUR_${Memory.getActiveCurrency()}`])
            }
        }
    }

    exchangeAmadeusChild(component) {
        if (component.associated_agency === 'airasia') {
            if ('PHP' === Memory.getActiveCurrency()) {
                return parseFloat(component.bulkPriceChild);
            } else {
                return parseFloat(component.bulkPriceChild) * parseFloat(Memory.getCurrency()[`USD_${Memory.getActiveCurrency()}`])
            }
        } else {
            if ('EUR' === Memory.getActiveCurrency()) {
                return parseFloat(component.bulkPriceChild);
            } else {
                return parseFloat(component.bulkPriceChild) * parseFloat(Memory.getCurrency()[`EUR_${Memory.getActiveCurrency()}`])
            }
        }
    }

    move(arr, oldIndex, newIndex) {
        let removedElement;
        if (newIndex > -1 && newIndex < arr.length) {
            removedElement = arr.splice(oldIndex, 1)[0];
        }
        arr.splice(newIndex, 0, removedElement)
        return arr;
    }

    sortByTime(day) {
        for (let item of day.events) {
            let time = item.time.split(':');
            item.timeMin = parseInt(time[0]) * 60 + parseInt(time[1]);
        }
        day.events.sort((n1, n2) => n1.timeMin - n2.timeMin);
    }

    sortDays() {
        for (let item of this.card.days) {
            let splitDate = item.date.split('/');
            item.dateNative = new Date(splitDate[2], parseInt(splitDate[1]) - 1, splitDate[0])
        }
        this.card.days.sort((n1, n2) => n1.dateNative - n2.dateNative);
    }

    getConnectedListToComponent() {
        let idList = [];
        this.card.days.forEach(function (item, index) {
            idList.push(`cdk-drop-list-${index}`);
        });
        idList.push(`cdk-drop-list--1`);
        return idList
    }

    getConnectedDrop(count) {
        let idList = ['list-1'];
        this.card.days.forEach(function (item, index) {
            index !== count ? idList.push(`cdk-drop-list-${index}`) : null;
        });
        idList.push(`cdk-drop-list--1`);
        return idList
    }

    convertDataToPackage(event) {
        if (event) {
            Memory.setLoading(true);
            var externalComponents = [];
            this.card.days.filter(function (value) {
                value.events.filter(function (event) {

                    if (event.externalRes && !event.temp) {
                        externalComponents.push(event.externalRes);
                    }
                });
            });
            let components = [];
            let componentDetails = {};

            for (let item of this.card.days) {
                for (let sub of item.events) {
                    if (!sub.temp && (sub.type === 'hotel-room' || sub.type === 'van-driver')) {
                        componentDetails[sub.componentId] = {
                            duration: sub.dayOfTour,
                            type: sub.type,
                            from: this.topFilter.cityFrom,
                            departure: this.generateDateFromString(item.date),
                            count: {
                                adult: sub.adult,
                                children: sub.children,
                                infant: sub.infant
                            }
                        }
                    } else if (!sub.temp && sub.type === 'AIRPLANE') {
                        componentDetails[sub.componentId] = {
                            type: sub.type,
                            count: {
                                adult: sub.adult,
                                children: sub.children,
                                infant: sub.infant
                            }
                        }
                    }
                    this.cardsData.filter(function (value) {
                        if (sub.componentId && value._id === sub.componentId && !sub.pair && !sub.temp && !sub.externalRes) {
                            components.push(value);
                        }
                    })
                }
            }
            let cover = [];
            this.card.cover.filter(function (item) {
                cover.push(item.largeImageURL);
            });
            let packageData = {
                _id: this.update ? this.package.packageData._id : null,
                details: {
                    from: this.card.from.toLowerCase(),
                    to: this.card.to.toLowerCase()
                },
                components: components,
                externalResources: externalComponents,
                name: this.card.name,
                discount: this.card.discount,
                tripDeadline: this.card.deadline,
                associated_agency: Memory.getAgencyId(),
                images: cover,
                componentDetails: componentDetails,
                logo: this.card.logo,
                hasExternal: externalComponents.length > 0,
                remarks: this.card.remarks,
                status: this.card.isDraft ? 'DRAFT' : 'PUBLISHED',
                isFeatured: this.card.isFeatured,
                creator: Memory.getUserId,
                currency: Memory.getActiveCurrency() ? Memory.getActiveCurrency() : 'PHP'
            };
            if (!this.update) {
                delete packageData._id;
            }
            if (this.update) {
                this.componentService.editPackage(packageData).subscribe(
                    (response: any) => {
                        if (response) {
                            this.update = false;
                            const notifyConfig = new NotifyConfig(
                                Notify.Type.SUCCESS,
                                Notify.Placement.TOP_CENTER,
                                Notify.TEMPLATES.Template2,
                                'The package Successfully updated',
                                ''
                            );
                            Notify.showNotify(notifyConfig);
                            this.submitPackage.emit()
                            this.card = new Card();
                            this.card.days = [];
                            this.step = 1;

                        } else {
                            const notifyConfig = new NotifyConfig(
                                Notify.Type.DANGER,
                                Notify.Placement.TOP_CENTER,
                                Notify.TEMPLATES.Template2,
                                'some error has been occured',
                                ''
                            );
                            Notify.showNotify(notifyConfig);

                        }
                    });
            } else {
                this.componentService.addPackage(packageData).subscribe(
                    (response: any) => {
                        if (response) {
                            Memory.setLoading(false);
                            const notifyConfig = new NotifyConfig(
                                Notify.Type.SUCCESS,
                                Notify.Placement.TOP_CENTER,
                                Notify.TEMPLATES.Template2,
                                'The package Successfully created',
                                ''
                            );
                            Notify.showNotify(notifyConfig);
                            this.card = new Card();
                            this.card.days = [];
                            if (this.social.facebook.description) {
                                this.social.facebook.packageId = response._id;
                                let obj = {
                                    chatId: this.agencyDetails.social_media.facebook,
                                    agencyId: Memory.getAgencyId(),
                                    data: this.social.facebook
                                };
                                this.socialService.postFacebook(obj).subscribe(
                                    response1 => {
                                        if (response1) {
                                            console.log(response1);
                                        }
                                    });
                            }
                            if (this.social.twitter.description) {
                                this.social.twitter.packageId = response._id;

                                let obj1 = {
                                    oauth_token: this.agencyDetails.social_media.twitter.token,
                                    oauth_token_secret: this.agencyDetails.social_media.twitter.secret,
                                    agencyId: Memory.getAgencyId(),
                                    data: this.social.twitter
                                }
                                this.socialService.postTwitter(obj1).subscribe(
                                    (response: any) => {
                                        if (response) {
                                            console.log(response);
                                        }
                                    });
                            }
                            if (this.social.linkedin.description) {
                                let obj1 = {
                                    packageData: packageData,
                                    data: this.social.linkedin,
                                    chatId: this.agencyDetails.social_media.linkedin
                                }
                                this.socialService.postLinkedin(obj1).subscribe(
                                    (response: any) => {
                                        if (response) {
                                            console.log(response);
                                        }
                                    });
                            }
                            if (this.social.telegram.description) {
                                let obj1 = {
                                    packageData: packageData,
                                    data: this.social.telegram,
                                    agencyId: Memory.getAgencyId(),
                                    chatId: this.agencyDetails.social_media.telegram
                                }
                                this.socialService.postTelegram(obj1).subscribe(
                                    (response: any) => {
                                        if (response) {
                                            console.log(response);
                                        }
                                    });
                            }


                            this.submitPackage.emit();

                        } else {
                            const notifyConfig = new NotifyConfig(
                                Notify.Type.DANGER,
                                Notify.Placement.TOP_CENTER,
                                Notify.TEMPLATES.Template2,
                                'some error has been occured',
                                ''
                            );
                            Notify.showNotify(notifyConfig);

                        }
                    });
            }
        }


    }
    // expressSocialSend(){
    //     if (this.social.facebook.description) {
    //         this.social.facebook.packageId = response._id;
    //         let obj = {
    //             chatId: this.agencyDetails.social_media.facebook,
    //             agencyId: Memory.getAgencyId(),
    //             data: this.social.facebook
    //         };
    //         this.socialService.postFacebook(obj).subscribe(
    //             response1 => {
    //                 if (response1) {
    //                     console.log(response1);
    //                 }
    //             });
    //     }
    //     if (this.social.twitter.description) {
    //         this.social.twitter.packageId = response._id;

    //         let obj1 = {
    //             oauth_token: this.agencyDetails.social_media.twitter.token,
    //             oauth_token_secret: this.agencyDetails.social_media.twitter.secret,
    //             agencyId: Memory.getAgencyId(),
    //             data: this.social.twitter
    //         }
    //         this.socialService.postTwitter(obj1).subscribe(
    //             (response: any) => {
    //                 if (response) {
    //                     console.log(response);
    //                 }
    //             });
    //     }
    //     if (this.social.linkedin.description) {
    //         let obj1 = {
    //             packageData: packageData,
    //             data: this.social.linkedin,
    //             chatId: this.agencyDetails.social_media.linkedin
    //         }
    //         this.socialService.postLinkedin(obj1).subscribe(
    //             (response: any) => {
    //                 if (response) {
    //                     console.log(response);
    //                 }
    //             });
    //     }
    //     if (this.social.telegram.description) {
    //         let obj1 = {
    //             packageData: packageData,
    //             data: this.social.telegram,
    //             agencyId: Memory.getAgencyId(),
    //             chatId: this.agencyDetails.social_media.telegram
    //         }
    //         this.socialService.postTelegram(obj1).subscribe(
    //             (response: any) => {
    //                 if (response) {
    //                     console.log(response);
    //                 }
    //             });
    //     }
    // }
    validatePassenger(): boolean {
        if (this.passengers.length > 0) {
            for (let item of this.passengers) {
                if (item.name && item.family && item.birthDate && item.nationality) {

                } else {
                    return false;
                }
            }
        }
        return true;
    }

    submitCompanyPackage() {
        Memory.setLoading(true);
        var externalComponents = [];
        this.card.days.filter(function (value) {
            value.events.filter(function (event) {
                if (event.externalRes && !event.temp) {
                    externalComponents.push(event.externalRes);
                }
            });
        });
        let components = [];
        let componentDetails = {};

        for (let item of this.card.days) {
            for (let sub of item.events) {
                if (!sub.temp && (sub.type === 'hotel-room' || sub.type === 'van-driver')) {
                    componentDetails[sub.componentId] = {
                        duration: sub.dayOfTour,
                        type: sub.type,
                        departure: this.generateDateFromString(item.date),
                        count: {
                            adult: sub.adult,
                            children: sub.children,
                            infant: sub.infant
                        }
                    }
                } else if (!sub.temp && sub.type === 'AIRPLANE') {
                    componentDetails[sub.componentId] = {
                        type: sub.type,
                        count: {
                            adult: sub.adult,
                            children: sub.children,
                            infant: sub.infant
                        }
                    }
                }
                this.cardsData.filter(function (value) {
                    if (sub.componentId && value._id === sub.componentId && !sub.pair && !sub.temp && !sub.externalRes) {
                        components.push(value);
                    }
                })
            }
        }
        let cover = [];
        this.card.cover.filter(function (item) {
            cover.push(item.largeImageURL);
        });
        let packageData = {
            details: {
                from: this.card.from.toLowerCase(),
                to: this.card.to.toLowerCase()
            },
            components: components,
            externalResources: externalComponents,
            name: this.card.name,
            discount: this.card.discount,
            tripDeadline: this.card.deadline,
            associated_agency: Memory.getAgencyId(),
            images: cover,
            logo: this.card.logo,
            hasExternal: externalComponents.length > 0,
            remarks: this.card.remarks,
            status: this.card.isDraft ? 'DRAFT' : 'PUBLISHED',
            isFeatured: this.card.isFeatured,
            creator: Memory.getUserId,
            deleted: true,
            currency: Memory.getActiveCurrency() ? Memory.getActiveCurrency() : 'PHP'
        };

        this.componentService.addPackage(packageData).subscribe(
            (response: any) => {
                if (response) {
                    Memory.setLoading(false);
                    const notifyConfig = new NotifyConfig(
                        Notify.Type.SUCCESS,
                        Notify.Placement.TOP_CENTER,
                        Notify.TEMPLATES.Template2,
                        'The package Successfully created',
                        ''
                    );
                    Notify.showNotify(notifyConfig);
                    this.card = new Card();
                    this.card.days = [];
                    this.inquery.special_inst = "Booking from user";
                    this.inquery.inquirer = Memory.getUserIdStorage();
                    this.inquery.request = response._id;
                    this.inquery.to = Memory.getAgencyId();
                    this.inquery.status = 'PENDING';
                    this.inquery.mode = 'company';
                    componentDetails['passengers'] = this.passengers;
                    this.inquery.details = {
                        componentDetails: componentDetails,
                        mode: 'custom'
                    };

                    this.inqueryService.createInquery(this.inquery).subscribe((res: any) => {
                        this.card = new Card();
                        // this.stepper.previous();
                        this.router.navigateByUrl('/panel/inqueries')
                        this.totalPackagePrice = 0

                    })

                } else {
                    const notifyConfig = new NotifyConfig(
                        Notify.Type.DANGER,
                        Notify.Placement.TOP_CENTER,
                        Notify.TEMPLATES.Template2,
                        'some error has been occured',
                        ''
                    );
                    Notify.showNotify(notifyConfig);

                }
            });
    }

    submitCompanyPackage1() {
        Memory.setLoading(true);
        if (this.validatePassenger()) {
            Memory.setLoading(false);
            this.stepper.next();
        } else {
            Memory.setLoading(false);
            const notifyConfig = new NotifyConfig(
                Notify.Type.DANGER,
                Notify.Placement.TOP_CENTER,
                Notify.TEMPLATES.Template2,
                'please complete passengers data!',
                ''
            );
            Notify.showNotify(notifyConfig);
        }
    }

    convertPackageToCard(trip) {
        console.log('_______________',trip)
        for (let item of trip.componentsData) {
            if (item.associated_agency === 'amadeus' || item.associated_agency === 'airasia') {
                let index = 0;
                for (let segment of item.segments) {
                    if (this.card.days.length > 0) {
                        for (let sub of this.card.days) {
                            let data2: Event = new Event();
                            data2.time = segment.flightSegment.departure.at.split('T')[1].substring(0, 5);
                            data2.type = item.type;
                            // data2.quantity=item.quantity
                            data2.componentId = item._id;
                            data2.details.from = segment.flightSegment.departure.iataCode;
                            data2.details.to = segment.flightSegment.arrival.iataCode;
                            data2.location.address = 'Something Company #14 Main Ave. Detro St.';
                            data2.location.type = item.type === 'AIRPLANE' ? 'line' : 'pin';
                            data2.externalRes = item;
                            let data3: Event = new Event();
                            // data3.quantity=item.quantity
                            data3.time = segment.flightSegment.arrival.at.split('T')[1].substring(0, 5);
                            data3.type = item.type;
                            data3.componentId = item._id;
                            data3.details.from = segment.flightSegment.departure.iataCode;
                            data3.details.to = segment.flightSegment.arrival.iataCode;
                            data3.location.address = 'Something Company #14 Main Ave. Detro St.';
                            data3.location.type = item.type === 'AIRPLANE' ? 'line' : 'pin';
                            data3.externalRes = item;
                            data3.price = this.exchangeAmadeus(item);

                            data3.temp = true;
                            data3.arrival = true;
                            if (index === 0) {
                                data2.price = this.exchangeAmadeus(item);
                                this.totalPackagePrice += parseFloat(data2.price) * data2.quantity;
                            } else {
                                data2.temp = true;
                            }
                            index++;
                            data2.externalRes = item;
                            if (this.checkDateExist(this.parseISOString(segment.flightSegment.departure.at))) {
                                if (this.parseISOString(segment.flightSegment.departure.at) === sub.date) {
                                    this.getCroods(data2, data2.location.type);
                                    sub.events.push(data2);
                                }
                            } else {
                                this.selectedDate.push(this.parseISOString(segment.flightSegment.departure.at));
                                this.getCroods(data2, data2.location.type);

                                this.card.days.push({
                                    date: this.parseISOString(segment.flightSegment.departure.at),
                                    events: [data2]
                                });
                            }
                            if (this.checkDateExist(this.parseISOString(segment.flightSegment.arrival.at))) {
                                if (this.parseISOString(segment.flightSegment.arrival.at) === sub.date) {
                                    this.getCroods(data3, data3.location.type);
                                    sub.events.push(data3);
                                    break;
                                }
                            } else {
                                this.selectedDate.push(this.parseISOString(segment.flightSegment.arrival.at));
                                this.getCroods(data2, data2.location.type);

                                this.card.days.push({
                                    date: this.parseISOString(segment.flightSegment.arrival.at),
                                    events: [data3]
                                });
                                break;
                            }


                        }
                    } else {
                        index++;
                        let i = 0;
                        // for (let segment of item.segments) {
                        let data2: Event = new Event();
                        // data2.quantity=item.quantity

                        data2.time = segment.flightSegment.departure.at.split('T')[1].substring(0, 5);
                        data2.type = item.type;
                        data2.componentId = item._id;
                        data2.details.from = segment.flightSegment.departure.iataCode;
                        data2.details.to = segment.flightSegment.arrival.iataCode;
                        data2.location.address = 'Something Company #14 Main Ave. Detro St.';
                        data2.location.type = item.type === 'AIRPLANE' ? 'line' : 'pin';
                        data2.externalRes = item;
                        let data3: Event = new Event();
                        // data3.quantity=item.quantity

                        data3.time = segment.flightSegment.arrival.at.split('T')[1].substring(0, 5);
                        data3.type = item.type;
                        data3.componentId = item._id;
                        data3.details.from = segment.flightSegment.departure.iataCode;
                        data3.details.to = segment.flightSegment.arrival.iataCode;
                        data3.location.address = 'Something Company #14 Main Ave. Detro St.';
                        data3.location.type = item.type === 'AIRPLANE' ? 'line' : 'pin';
                        data3.externalRes = item;
                        data3.temp = true;
                        data3.price = this.exchangeAmadeus(item);
                        data3.arrival = true;

                        if (i === 0) {
                            data2.price = this.exchangeAmadeus(item);
                            this.totalPackagePrice += parseFloat(data2.price) * data2.quantity;
                        } else {
                            data2.temp = true;
                        }
                        i++;
                        data2.externalRes = item;

                        this.selectedDate.push(this.parseISOString(segment.flightSegment.departure.at));
                        this.getCroods(data2, data2.location.type);

                        this.card.days.push({
                            date: this.parseISOString(segment.flightSegment.departure.at),
                            events: [data2]
                        });
                        if (this.parseISOString(segment.flightSegment.arrival.at) === this.card.days[0].date) {
                            this.getCroods(data3, data3.location.type);
                            this.card.days[0].events.push(data3);
                        } else {
                            this.selectedDate.push(this.parseISOString(segment.flightSegment.arrival.at));
                            this.getCroods(data2, data2.location.type);

                            this.card.days.push({
                                date: this.parseISOString(segment.flightSegment.arrival.at),
                                events: [data3]
                            });
                        }


                        break;


                        // }
                    }
                }


            }
            else {
                if (this.card.days.length > 0) {
                    let data: Event = new Event();
                    data.time = item.details.from.departure.time;
                    data.type = item.type;
                    data.componentId = item._id;
                    data.details.from = item.details.from.city;
                    data.details.to = item.details.to.city;
                    data.location.address = 'Something Company #14 Main Ave. Detro St.';
                    data.location.type = item.type === 'AIRPLANE' ? 'line' : 'pin';
                    data.price = this.exchange(item);
                    data.externalRes = null;
                    item.details.roundTrip ? this.checkRoundTrip(item) : null;

                    let data1: Event = new Event();
                    // data2.quantity=item.quantity

                    data1.time = item.details.from.arrival.time;
                    data1.type = item.type;
                    data1.componentId = item._id;
                    data1.details.from = item.details.from.city;
                    data1.details.to = item.details.to.city;
                    data1.location.address = 'Something Company #14 Main Ave. Detro St.';
                    data1.location.type = item.type === 'AIRPLANE' ? 'line' : 'pin';
                    data1.externalRes = null;
                    data1.temp = true;
                    data1.price = this.exchange(item);

                    data1.arrival = true;
                    // if (this.card.days.length > 0) {
                        for (let sub of this.card.days) {
                            if (this.checkDateExist(moment(item.details.from.departure.date).format('DD/MM/YYYY'))) {
                                if (sub.date === moment(item.details.from.departure.date).format('DD/MM/YYYY')) {
                                    sub.events.push(data);
                                    break;
                                }
                            } else {
                                this.selectedDate.push(moment(item.details.from.departure.date).format('DD/MM/YYYY'));
                                this.card.days.push({
                                    date: moment(item.details.from.departure.date).format('DD/MM/YYYY'),
                                    events: [data]
                                });
                                break;
                            }
                        }
                        this.getCroods(data, data.location.type);
                        // this.card.days[indexOfDay].events.splice(e.currentIndex, 0, data);
                        this.totalPackagePrice += parseFloat(data.price) * data.quantity;
                        for (let sub of this.card.days) {
                            if (this.checkDateExist(moment(item.details.from.arrival.date).format('DD/MM/YYYY'))) {
                                if (sub.date === moment(item.details.from.arrival.date).format('DD/MM/YYYY')) {
                                    sub.events.push(data1);
                                    break;
                                }
                            } else {
                                this.selectedDate.push(moment(item.details.from.arrival.date).format('DD/MM/YYYY'));
                                this.card.days.push({
                                    date: moment(item.details.from.arrival.date).format('DD/MM/YYYY'),
                                    events: [data1]
                                });
                                break;
                            }
                        }
                    // } else {
                    //     this.selectedDate.push(moment(item.details.from.departure.date).format('DD/MM/YYYY'));
                    //     this.card.days.push({
                    //         date: moment(item.details.from.departure.date).format('DD/MM/YYYY'),
                    //         events: [data]
                    //     });
                    //     this.getCroods(data, data.location.type);
                    //     // this.card.days[indexOfDay].events.splice(e.currentIndex, 0, data);
                    //     this.totalPackagePrice += parseFloat(data.price) * data.quantity;
                    //     for (let sub of this.card.days) {
                    //         if (this.checkDateExist(moment(item.details.from.arrival.date).format('DD/MM/YYYY'))) {
                    //             if (sub.date === moment(item.details.from.arrival.date).format('DD/MM/YYYY')) {
                    //                 sub.events.push(data1);
                    //                 break;
                    //             }
                    //         } else {
                    //             this.selectedDate.push(moment(item.details.from.arrival.date).format('DD/MM/YYYY'));
                    //             this.card.days.push({
                    //                 date: moment(item.details.from.arrival.date).format('DD/MM/YYYY'),
                    //                 events: [data1]
                    //             });
                    //             break;
                    //         }
                    //
                    //     }
                    // }


                }
                else {
                    this.selectedDate.push(moment(item.pair ? item.details.to.departure.date : item.details.from.departure.date).format('DD/MM/YYYY'));
                    this.card.days.push({
                        date: moment(item.pair ? item.details.to.departure.date : item.details.from.departure.date).format('DD/MM/YYYY'),
                        events: this.convertComponentToEvent(item)
                    })
                }
            }
        }
        this.sortDays();
    }

    sameDay(date1, date2) {
        return date1.isSame(date2, 'year') && date1.isSame(date2, 'month') && date1.isSame(date2, 'day')
    }

    changeTo(event) {
        console.log('omaaaaaaaaaaaad');
        this.componentService.getAgodaCity(event).subscribe((res: any) => {
            if (res) {
                for (let item of res.ViewModelList) {
                    if (item.Name.toLowerCase() === this.card.to.toLowerCase() && item.CityId > 0) {
                        this.topFilter.agCityId = item.CityId;
                    }
                }
            }
        })
    }

    convertComponentToEvent(component): Array<Event> {
        let data: Event = new Event();
        // data.quantity=component.quantity

        data.time = component.pair ? component.details.to.departure.time : component.details.from.departure.time;
        data.pair = component.pair ? component.pair : null;
        data.type = component.type;
        data.componentId = component._id;
        data.details.from = (component.associated_agency !== 'amadeus' && component.associated_agency !== 'airasia') ? (component.pair ? component.details.to.city : component.details.from.city) : this.card.from;
        data.details.to = (component.associated_agency !== 'amadeus' && component.associated_agency !== 'airasia' && component.associated_agency !== 'agoda') ? (component.pair ? component.details.from.city : component.details.to.city) : this.card.to;
        data.location.address = 'Something Company #14 Main Ave. Detro St.';
        data.location.type = component.type === 'AIRPLANE' ? 'line' : 'pin';
        data.price = this.exchange(component);
        data.externalRes = (component.associated_agency === 'amadeus' || component.associated_agency === 'airasia') ? component : null;
        let data1: Event = new Event();
        // data1.quantity=component.quantity

        data1.time = component.pair ? component.details.to.arrival.time : component.details.from.arrival.time;
        data1.pair = component.pair ? component.pair : null;
        data1.type = component.type;
        data1.componentId = component._id;
        data1.details.from = (component.associated_agency !== 'amadeus' && component.associated_agency !== 'airasia') ? (component.pair ? component.details.to.city : component.details.from.city) : this.card.from;
        data1.details.to = (component.associated_agency !== 'amadeus' && component.associated_agency !== 'airasia'&& component.associated_agency !== 'agoda') ? (component.pair ? component.details.from.city : component.details.to.city) : this.card.to;
        data1.location.address = 'Something Company #14 Main Ave. Detro St.';
        data1.location.type = component.type === 'AIRPLANE' ? 'line' : 'pin';
        data1.price = this.exchange(component);
        data1.externalRes = (component.associated_agency === 'amadeus' || component.associated_agency === 'airasia') ? component : null;

        this.totalPackagePrice += this.exchange(component);
        this.getCroods(data, data.location.type);
        this.getCroods(data1, data1.location.type);
        return [data, data1];
    }

    convertAmadeusComponentToEvent(component): Event {
        let data: Event = new Event();
        data.time = component.segments[0].flightSegment.departure.at.split('T')[1].substring(0, 5);
        data.type = component.type;
        data.componentId = component._id;
        data.details.from = this.card.from;
        data.details.to = this.card.to;
        data.location.address = 'Something Company #14 Main Ave. Detro St.';
        data.location.type = component.type === 'AIRPLANE' ? 'line' : 'pin';
        data.price = this.exchangeAmadeus(component);
        data.externalRes = component;
        this.totalPackagePrice += this.exchangeAmadeus(component);
        this.getCroods(data, data.location.type);
        return data;
    }

    checkRoundTrip(component) {
        let newComp = Object.assign({}, component);
        newComp.pair = newComp._id;
        newComp.bulkPrice = 0;
        for (let sub of this.card.days) {
            if (sub.date === moment(newComp.pair ? newComp.details.to.departure.date : newComp.details.from.departure.date).format('DD/MM/YYYY')) {
                sub.events = sub.events.concat(this.convertComponentToEvent(newComp));
                break;
            } else {
                this.selectedDate.push(moment(newComp.pair ? newComp.details.to.departure.date : newComp.details.from.departure.date).format('DD/MM/YYYY'));
                this.card.days.push({
                    date: moment(newComp.pair ? newComp.details.to.departure.date : newComp.details.from.departure.date).format('DD/MM/YYYY'),
                    events: this.convertComponentToEvent(newComp)
                });
                break;
            }
        }
        let data1: Event = new Event();
        // data1.quantity=component.quantity

        data1.time = (component.type != 'van-driver' ? (component.pair ? component.details.to.arrival.time : component.details.from.arrival.time) : '13:00');
        data1.pair = component.pair ? component.pair : null;
        data1.type = component.type;
        data1.temp = true;
        data1.arrival = true;
        data1.componentId = component._id;
        data1.details.from = (component.associated_agency !== 'amadeus' && component.associated_agency !== 'airasia') ? (component.pair ? component.details.to.city : component.details.from.city) : this.card.from;
        data1.details.to = (component.associated_agency !== 'amadeus' && component.associated_agency !== 'airasia') ? (component.pair ? component.details.from.city : component.details.to.city) : this.card.to;
        data1.location.address = 'Something Company #14 Main Ave. Detro St.';
        data1.location.type = component.type === 'AIRPLANE' ? 'line' : 'pin';
        for (let sub of this.card.days) {
            if (sub.date === moment(newComp.pair ? newComp.details.to.arrival.date : newComp.details.from.arrival.date).format('DD/MM/YYYY')) {
                sub.events.push(data1);
                break;
            } else {
                this.selectedDate.push(moment(newComp.pair ? newComp.details.to.arrival.date : newComp.details.from.arrival.date).format('DD/MM/YYYY'));
                this.card.days.push({
                    date: moment(newComp.pair ? newComp.details.to.arrival.date : newComp.details.from.arrival.date).format('DD/MM/YYYY'),
                    events: [data1]
                });
                break;
            }
        }

    }

    goToStep2() {
        if (this.card.days.length > 0) {
            // for (let item of this.card.days) {
            //   if (item.events.length > 0) {
            //
            //   }
            // }
            if (this.role === 'company') {
                this.getAirplaneExist()
            }
            if (this.validComponent()) {
                this.stepper.next();
            } else {
                const notifyConfig = new NotifyConfig(
                    Notify.Type.WARNING,
                    Notify.Placement.TOP_CENTER,
                    Notify.TEMPLATES.Template2,
                    'component is not valid',
                    ''
                );
                Notify.showNotify(notifyConfig);
            }
        } else {
            const notifyConfig = new NotifyConfig(
                Notify.Type.WARNING,
                Notify.Placement.TOP_CENTER,
                Notify.TEMPLATES.Template2,
                'you must enter and select some component for your package',
                ''
            );
            Notify.showNotify(notifyConfig);
        }
    }


    validComponent(): boolean {
        this.sortDays();
        let valid = true
        let self = this;
        this.card.days.forEach(function (item, index) {
            for (let event of item.events) {
                if (event.type === 'hotel-room') {
                    self.card.days.forEach(function (item1, index1) {
                        for (let event1 of item1.events) {
                            if (event.componentId === event1.componentId && event1.temp !== event.temp && !event1.temp) {
                                if (self.generateNativeDateFromString(item.date) < self.generateNativeDateFromString(item1.date) && index !== index1) {
                                    console.log(index1, index);
                                    valid = false;
                                    break;
                                }
                            }
                        }
                    });
                }
            }
        });
        return valid;
    }

    adultExtra: Array<Passenger> = [];
    childExtra: Array<Passenger> = [];
    infantExtra: Array<Passenger> = [];

    addQuantityToHotel(type, event) {
        event[type.toLowerCase()] += 1;
        let newPass = new Passenger();
        newPass.type = type;
        if (type === 'Adult') {
            newPass.index = this.adultExtra.length;
            this.adultExtra.push(newPass)
        } else if (type === 'Children') {
            newPass.index = this.childExtra.length;
            this.childExtra.push(newPass)
        } else if (type === 'Infant') {
            newPass.index = this.infantExtra.length;
            this.infantExtra.push(newPass)
        }
        this.calculatePackagePrice()
    }

    removeQuantityHotel(type, event) {
        event[type.toLowerCase()] -= 1;
        if (type === 'Adult') {
            this.adultExtra.splice(this.adultExtra.length - 1, 1)
        } else if (type === 'Children') {
            this.childExtra.splice(this.childExtra.length - 1, 1)
        } else if (type === 'Infant') {
            this.infantExtra.splice(this.infantExtra.length - 1, 1)
        }
        this.calculatePackagePrice()

    }

    setPassenger(adult, child, infant) {
        this.passengers = [];
        for (let i = 0; i < adult; i++) {
            let pass = new Passenger();
            pass.type = 'Adult';
            pass.index = i + 1;
            this.passengers.push(pass)

        }
        for (let i = 0; i < child; i++) {
            let pass = new Passenger();
            pass.type = 'Children';
            pass.index = i + 1;
            this.passengers.push(pass)
        }
        for (let i = 0; i < infant; i++) {
            let pass = new Passenger();
            pass.type = 'Infant';
            pass.index = i + 1;
            this.passengers.push(pass)
        }
        if (this.adultExtra.length > 0) {
            for (let j = 0; j < this.adultExtra.length; j++) {
                this.adultExtra[j].index = j + adult + 1
                this.passengers.push(this.adultExtra[j])
            }
        }
        if (this.childExtra.length > 0) {
            for (let j = 0; j < this.childExtra.length; j++) {
                this.childExtra[j].index = j + child + 1
                this.passengers.push(this.childExtra[j])
            }
        }
        if (this.infantExtra.length > 0) {
            for (let j = 0; j < this.infantExtra.length; j++) {
                this.infantExtra[j].index = j + infant + 1
                this.passengers.push(this.infantExtra[j])
            }
        }
    }

    goToStep3() {
        if (this.role === 'company') {
            for (let i = 0; i < this.passenger; i++) {
                let pass = new Passenger();
                this.passengers.push(pass)
            }
        }
        if (this.card.name && this.card.deadline.date && this.card.remarks && this.card.discount >= 0 && this.card.discount < 100) {
            this.stepper.next();
        } else {
            const notifyConfig = new NotifyConfig(
                Notify.Type.WARNING,
                Notify.Placement.TOP_CENTER,
                Notify.TEMPLATES.Template2,
                'Trip name, its description and Deadline are mandatory, Please fill them up.',
                ''
            );
            Notify.showNotify(notifyConfig);
        }
    }

    goToStep1(stepper) {
        stepper.previous();
        stepper.selectedIndex = 0;
    }

    goToStep2From3() {
        this.stepper.previous()
        this.stepper.selectedIndex = 1;
    }

    getAirplaneExist() {
        let passengerCount = 0;
        // for (let item of this.card.days) {
        //   for(let sub of item.events){
        //     // if(sub.type==='AIRPLANE'){
        //       passengerCount=passengerCount<sub.quantity?sub.quantity:passengerCount;
        //     // }
        //   }
        // }
        passengerCount = this.adult + this.children + this.infant;
        if (passengerCount > 0) {
            this.passenger = passengerCount;
            this.setPassenger(this.adult, this.children, this.infant);
        }
    }

    getCountOfEvent(event: Event) {
        if (event.type === 'van-driver') {
            return Math.floor(event.quantity / 15) + 1;
        } else if (event.type === 'hotel-room') {
            return Math.floor(event.quantity / 2) + 1;
        } else if (event.type === 'AIRPLANE') {
            return event.quantity
        }
    }


    searchResult: Array<any> = [];

    getCountries(input) {
        this.loader = true;
        this.noDataNationality = false;
        this.searchResult = [];
        this.searchResult = this.nationality.filter((item) => item.toLowerCase().indexOf(input.toLowerCase()) > -1);
        if(this.searchResult.length<1){
            this.loader=false;
            this.noDataNationality=true;
        }
    }

    countrySelected(event, passenger: Passenger) {
        passenger.nationality = event.option.value;
    }

    validSearch: boolean = true;

    changeQuantity() {
        if (this.cardsData.length > 0 && this.card.days.length > 0) {
            if (window.confirm('do you want to change quantity (your card want to be changed)?')) {
                for (let day of this.card.days) {
                    for (let event of day.events) {
                        if (!event.temp) {
                            if (event.type === 'AIRPLANE') {
                                for (let item of this.cardsData) {
                                    if (item._id === event.componentId) {
                                        item.quantity += event.quantity;
                                        break;
                                    }
                                }
                            } else if (event.type == 'van-driver') {
                                for (let item of this.cardsData) {
                                    if (item._id === event.componentId) {
                                        item.quantity += event.quantity;
                                        break;
                                    }
                                }
                            } else {
                                for (let item of this.cardsData) {
                                    if (item._id === event.componentId) {
                                        item.quantity += event.quantity;
                                        break;
                                    }
                                }
                            }
                        }

                    }
                }
                this.totalPackagePrice = 0;
                this.card.days = [];
                this.cardsData = [];
                this.selectedDate = [];
                this.validSearch = true;
                this.topFilter.quantity = this.adult + this.children + this.infant;
                if (this.maxQuantity < this.topFilter.quantity) {
                    this.validSearch = false;
                    const notifyConfig = new NotifyConfig(
                        Notify.Type.WARNING,
                        Notify.Placement.TOP_CENTER,
                        Notify.TEMPLATES.Template2,
                        'Quantity is over than max quantity',
                        ''
                    );
                    Notify.showNotify(notifyConfig);
                }
            }
        } else {
            this.validSearch = true;
            this.topFilter.quantity = this.adult + this.children + this.infant;
            if (this.maxQuantity < this.topFilter.quantity) {
                this.validSearch = false;
                const notifyConfig = new NotifyConfig(
                    Notify.Type.WARNING,
                    Notify.Placement.TOP_CENTER,
                    Notify.TEMPLATES.Template2,
                    'Quantity is over than max quantity',
                    ''
                );
                Notify.showNotify(notifyConfig);
            }
        }

    }

    helperDisable() {
        let users = Memory.itinersryHelper() ? Memory.itinersryHelper() : [];
        users.push(Memory.getUserIdStorage());
        Memory.setItinersryHelper(users)
    }

    changeswap(i) {
        var temp = this.tmpImages[0];
        this.tmpImages[0] = this.tmpImages[i];
        this.tmpImages[i] = temp;
    }

    getShowHelper() {
        let users = Memory.itinersryHelper() ? Memory.itinersryHelper() : [];
        if (users.length > 0) {
            return users.indexOf(Memory.getUserIdStorage()) === -1

        } else {
            return true;
        }
    }
    startCoverUpload(){
        $('.cover-image label.img-ul-upload input[multiple]').trigger('click')
    }
    startLogoUpload(){
        $('.logo-image label.img-ul-upload input[multiple]').trigger('click')
    }
    
}


export class Card {
    from: string;
    fromIso: string;
    to: string;
    toIso: string;
    cover: Array<any> = [];
    logo: string;
    days: Array<Day> = [];
    totalPrice: number;
    deadline: DateTime = new DateTime();
    remarks: string = '';
    name: string;
    discount: number = 0;
    isDraft: boolean;
    isFeatured: boolean;
}

export class Day {
    date: any;
    dateNative?: any;
    events: Array<Event> = []
}

export class Event {
    externalRes: any;
    time: string;
    type: string;
    pair: string;
    dayOfTour: number = 1;
    componentId: string;
    price: any;
    childPrice: any;
    quantity: number = 1;
    adult: number = 1;
    children: number = 0;
    infant: number = 0;
    details: Detail = new Detail();
    location: ComponentLocation = new ComponentLocation();
    temp: boolean = false;
    images: Array<any> = [];
    arrival: boolean = false;
}

export class Detail {
    from: string;
    to: string;
}

export class ComponentLocation {

    address: string;
    type: string;
    pointA: Loc = new Loc();
    pointB: Loc = new Loc();


}

export class Loc {

    lat: number = 0;
    lng: number = 0

}

export class DateTime {
    date: Date;
    time: string = '00:00';
}

export class FilterAirAsia {
    from: string;
    to: string;
    date: any;
}

export class Passenger {
    name: string;
    family: string;
    birthDate: string;
    nationality: string;
    gender: string = 'male';
    type: string;
    index: number;
}








