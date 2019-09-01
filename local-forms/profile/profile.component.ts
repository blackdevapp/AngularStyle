import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../shared/models/user.model';
import {UserService} from '../../services/user.service';
import {AgenciesService} from '../../services/agencies.service';
import {Validation} from '../../base/validation';
import {ValidationModel} from '../../base/validationModel';
import {Notify} from '../../base/notify/notify';
import {NotifyConfig} from '../../base/notify/notify-config';
import {Memory} from '../../base/memory';
import {InquiryModel} from '../../shared/models/inquiry.model';
import {UserDataService} from '../../services/dataService/user-data.service';
import {AuthService} from "../../services/auth.service";
import {SocialService} from "../../services/social.service";
import {ActivatedRoute} from '@angular/router';
import {OnBoardingOrgModel} from '../../shared/models/onBoardingOrg.model';
import {PersonalInformation} from "../../shared/models/onBoarding.model";
import {UploadService} from '../../services/upload.service';

declare let $: any;
import CryptoJS from 'crypto-js'
import Utility from "../../../../server/controllers/utilityfunctions";

@Component({
    selector: 'app-profile-form',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    memory = Memory;
    agencyDetails: Agency = new Agency();
    mode: string = 'user';
    userValidationIntial: Array<any>;
    userValidation: ValidationModel;
    employeeList: Array<User> = [];
    user: User = new User();
    userEdit: User = new User();
    currentUser: User = new User();
    newEmployee: boolean = false;
    goRegister: boolean = false;
    name: string;
    role: string;
    validation = Validation;
    pages: Array<any> = [];
    amadeus: any = {
        clientId: '',
        clientSecret: ''
    };

    showPass1: boolean = true;
    showPass: boolean = true;
    confirmPassword: string;
    password: string;
    userOrg: OnBoardingOrgModel = new OnBoardingOrgModel();
    infoValidation: ValidationModel;

    @Input() info: PersonalInformation;
    maxDate: Date = new Date(2000, 11, 11);

    constructor(private userService: UserService, private agencyService: AgenciesService,
                private auth: AuthService,
                private route: ActivatedRoute,
                private uploadService: UploadService,
                private socialService: SocialService,
                private userDataService: UserDataService) {
        this.userValidationIntial = [
            {field: 'firstName', toBe: ['cs-26']},
            {field: 'lastName', toBe: ['cs-10']},
            {field: 'email', toBe: ['ce-46']}
        ];
        this.userValidation = Validation.intialObject(this.userValidationIntial);
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['mode'] && params['mode'] == 'complete') {
                $('#complete').modal();
            }
        });
        Memory.setLoading(true);
        setTimeout(function(){
            Memory.setLoading(false)
        },5000)
        this.role = this.auth.getRole();
        // this.employeeList.push({name:'Milad Ahmadi'},{name:'John Smith'})
        this.user._id = localStorage.getItem('nj.user_id');
        this.getUser();

    }

    goToMode(mode) {
        this.mode = mode;
    }

    onCheck(event) {
        if (event.target.checked) {
            if (this.agencyDetails.social_media.facebook.pages) {
                this.agencyDetails.social_media.facebook.pages.push(event.target.value)

            } else {
                this.agencyDetails.social_media.facebook.pages = [];
                this.agencyDetails.social_media.facebook.pages.push(event.target.value)

            }
        } else {
            this.agencyDetails.social_media.facebook.pages.splice(this.agencyDetails.social_media.facebook.pages.indexOf(event.target.value) - 1, 1)
        }
    }

    editAccessPage() {
        this.agencyService.editAgencies(this.agencyDetails).subscribe((res: any) => {
            console.log(res);
        })
    }


    getUser() {
        this.userService.getUser(this.user).subscribe((res: User) => {
            if (res) {
                this.user = res;
                this.userValidation.fields.firstName.originalValue = this.user.firstName;
                this.userValidation.fields.lastName.originalValue = this.user.lastName;
                this.userValidation.fields.email.originalValue = this.user.email;

                if (this.user.role === 'admin') {
                    this.getAllMembers(Memory.getAgencyId())
                } else {
                    Memory.setLoading(false);
                }
            }
        })
    }

    getAllMembers(associated_agency) {
        this.agencyService.getByReferalCode(associated_agency).subscribe((res: any) => {
            if (res.result) {
                Memory.setLoading(false);
                this.agencyDetails = res.result;
                if (this.agencyDetails.config) {
                    Memory.setActiveCurrency(this.agencyDetails.config.currency);
                }
                if (res.result.members.length > 0) {
                    let users = {
                        ids: res.result.members
                    };
                    this.userService.getUserMultiple(users).subscribe((res: any) => {
                        if (res) {
                            this.employeeList = res;
                        }
                    });
                    // for(let item of res.result.members){
                    //   this.getEmployee(item)
                    // }
                }
            } else {
                Memory.setLoading(false);
            }
        })
    }

    getEmployee(userId) {
        let user: User = new User();
        user._id = userId;
        this.userService.getUser(user).subscribe((res: User) => {
            if (res) {
                this.employeeList.push(res);
            }
        })
    }

    cancelEmployee() {
        this.name = '';
        this.newEmployee = false;
    }

    // addEmployee(){
    //   this.employeeList.push({name:this.name});
    //   this.name='';
    // }

    getRegisteredUser(user) {
        console.log(user.update);
        if (user && !user.update) {
            this.currentUser = user;
            this.employeeList.push(this.currentUser);
            $('#myModal').modal('toggle')
        } else if (user && !user.update) {
            $('#myModal').modal('toggle')
        } else {
            $('#myModal').modal('toggle')
        }
    }

    submit() {

        this.userValidation = Validation.checkObject(this.userValidation);
        if (this.userValidation.isValid == false) {
            const notifyConfig = new NotifyConfig(
                Notify.Type.WARNING,
                Notify.Placement.TOP_CENTER,
                Notify.TEMPLATES.Template2,
                'The Form is Not Valid',
                ''
            );
            Notify.showNotify(notifyConfig);
            window.scrollTo(0, 0)
        } else {
            Memory.setLoading(true);
            setTimeout(function(){
                Memory.setLoading(false)
            },5000)
            this.userService.editUser(this.user).subscribe((res: any) => {
                if (res) {
                    Memory.setLoading(false)

                    const notifyConfig = new NotifyConfig(
                        Notify.Type.SUCCESS,
                        Notify.Placement.TOP_CENTER,
                        Notify.TEMPLATES.Template2,
                        'Your Information Successfully updated',
                        ''
                    );
                    Notify.showNotify(notifyConfig);
                }
            })
        }
    }

    addNewEmployee() {
        this.newEmployee = true;
        // this.userEdit=new User();
        this.userDataService.setUser(null);
        $('#myModal').modal()

    }

    getSelectedCount() {
        let count = 0;
        this.employeeList.forEach(function (item) {
            if (item.selected == true)
                count += 1;
        });
        return count;
    }


    deleteEmployee(event) {
        let item: User = event.value;
        let index = event.index;
        if (window.confirm('do  you want to delete this employee?')) {
            item.deleted = true;
            this.userService.editUser(item).subscribe((res: any) => {
                this.employeeList.splice(index, 1);
            })
        }
    }

    changeStatus(item: User) {
        this.userService.editUser(item).subscribe((res: any) => {
            // this.employeeList.splice(index, 1);
        })
    }

    editUser(item: User) {
        this.userEdit = item;
        this.userDataService.setUser(this.userEdit);
        $('#myModal').modal()
    }

    multipleDelete() {
        if (window.confirm('Do you want to delete this inquiry?')) {
            let users = [];
            let indexes = [];
            this.employeeList.forEach(function (item, index) {
                if (item.selected == true) {
                    item.deleted = true;
                    users.push(item._id);
                    indexes.push(index);
                }
            });
            let data = {
                id: users,
                objects: {
                    deleted: true
                }
            };
            this.userService.deleteMultipleUsers(data).subscribe((res: any) => {
                if (res.result) {
                    this.employeeList = this.employeeList.filter(function (value) {
                        if (users.indexOf(value._id) === -1) {
                            return value;
                        }
                    });
                }
            })
        }
    }

    changePass() {
        this.user.password = this.password;
        Memory.setLoading(true);
        setTimeout(function(){
            Memory.setLoading(false)
        },5000)
        this.userService.editUser(this.user).subscribe((res: any) => {
            if (res) {
                Memory.setLoading(false)
                const notifyConfig = new NotifyConfig(
                    Notify.Type.SUCCESS,
                    Notify.Placement.TOP_CENTER,
                    Notify.TEMPLATES.Template2,
                    'Your Password Successfully updated!',
                    ''
                );
                Notify.showNotify(notifyConfig);
            }
        })
    }


    config = {
        actions: {
            edit: true,
            delete: true,
            pagination: false,
            select: true
        },
        columns: [
            {
                type: 'string',
                title: 'email',
                field: 'email',
                style:{'width':'40%'}

            }, {
                type: 'dropdown',
                title: 'hierarchy',
                field: 'role',
                data: ['agent', 'encoder', 'van-driver', 'tour-guide'],
                style:{'width':'30%'}

            }
        ]
    };


    ngOnDestroy(): void {
        $('#myModal').modal('hide')
        $('#complete').modal('hide')
        $('#telegram').modal('hide')

    }


    fileChangeListener($event) {
        let image = new Image();
        const file = $event.target.files[0];
        const myReader: FileReader = new FileReader();
        const that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.agencyDetails.logo = image.src
        };
        myReader.readAsDataURL(file);
        this.uploadService.upload(file, '5c15efb47b741fff2044ec26').subscribe((res: any) => {
            if (res.isSuccessful) {
                this.agencyDetails.logo = res.result.path;
            }
        })
    }

    remove(array, i) {
        array.splice(i, 1)
    }

    indexTracker(index: number, value: any) {
        return index;
    }

    editAgency() {
        Memory.setLoading(true);
        setTimeout(function(){
            Memory.setLoading(false)
        },5000)
        this.agencyService.editAgencies(this.agencyDetails).subscribe((res: any) => {
            Memory.setLoading(false)
            const notifyConfig = new NotifyConfig(
                Notify.Type.SUCCESS,
                Notify.Placement.TOP_CENTER,
                Notify.TEMPLATES.Template2,
                'Agency Information Successfully updated!',
                ''
            );
            Notify.showNotify(notifyConfig);
            this.mode = 'user';
        })
    }

    setCurrency(currency) {
        this.agencyDetails.config.currency = currency
        this.agencyService.editAgencies(this.agencyDetails).subscribe((res: any) => {
            const notifyConfig = new NotifyConfig(
                Notify.Type.SUCCESS,
                Notify.Placement.TOP_CENTER,
                Notify.TEMPLATES.Template2,
                'Agency Configuration Successfully updated!',
                ''
            );
            Notify.showNotify(notifyConfig);
            // this.mode='user';
        })
    }

    editAmadeusApi() {
        let amadeus_api = CryptoJS.AES.encrypt(JSON.stringify(this.amadeus), 'NextJourneyAmadeusSecretKey').toString()
        this.agencyService.editAmadeusApi({
            amadeus_api: amadeus_api,
            agency_id: Memory.getAgencyId()
        }).subscribe((res: any) => {
            if (res.isSuccessful) {
                const notifyConfig = new NotifyConfig(
                    Notify.Type.SUCCESS,
                    Notify.Placement.TOP_CENTER,
                    Notify.TEMPLATES.Template2,
                    'Your Amadeus api key successfully updated!',
                    ''
                );
                Notify.showNotify(notifyConfig);
                this.amadeus = {
                    clientId: '',
                    clientSecret: ''
                }
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
        })
    }
}

export class Agency {
    admin: string;
    agency_id: string;
    alternative_representative: Array<string> = [];
    amadeus_api: string;
    bankAccounts: Array<BankAcc> = [];
    city: string;
    company_name: string;
    config: Config = new Config();
    deleted: boolean;
    email_address: Array<string> = [];
    fax_number: Array<string> = [];
    forms: Array<any> = [];
    logo: string
    members: Array<any> = []
    mobile_number: Array<string> = []
    office_address: Array<any> = [];
    official_representative: string;
    onboarded: boolean;
    social_media: any;
    taxIdentificationNo: string
    telephone_number: Array<any> = [];
    website: string;
    _id: string;
}

export class BankAcc {
    type: string;
    accountNo: string;
}

export class Config {
    currency: string;
    max_quantity: number;
}
