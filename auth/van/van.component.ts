import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../shared/models/user.model";
import {ValidationModel} from "../../base/validationModel";
import {UserService} from "../../services/user.service";
import {UserDataService} from "../../services/dataService/user-data.service";
import {Validation} from "../../base/validation";
import {Memory} from "../../base/memory";
import * as moment from 'moment';
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-van',
    templateUrl: './van.component.html',
    styleUrls: ['./van.component.scss']
})
export class VanComponent implements OnInit {

    @Input() mode: string;
    @Input() local: boolean = false;
    user: User;
    userValidation: ValidationModel;
    userValidationIntial: Array<any>;
    update: boolean = false;
    loading: boolean = false;
    birthDate: Date;
    maxDate: Date = new Date(2000, 11, 11);

    constructor(private userService: UserService,
                private auth: AuthService,
                private router: Router,
                private userDataService: UserDataService) {
        this.userValidationIntial = [
            {field: 'firstName', toBe: ['cs-26']},
            {field: 'lastName', toBe: ['cs-10']},
            {field: 'email', toBe: ['ce-46']},
            {field: 'address', toBe: ['cs-46']},
            {field: 'state', toBe: ['cs-46']},
            {field: 'city', toBe: ['cs-46']},
            {field: 'mobileNo', toBe: ['cn-12']}
        ];
        this.userValidation = Validation.intialObject(this.userValidationIntial);
    }

    ngOnInit() {

        this.user = {
            birthDate: '',
            firstName: '',
            lastName: '',
            address: '',
            password: '123456',
            state: '',
            city: '',
            email: '',
            age: 0,
            markup: 0,
            role: 'van-driver',
            mobileNo: '',
            title: 'Mr.',
            purposeOfVisit: 'tourist',
            deleted: false,
            associated_agency: Memory.getAgencyId()
        }
    }

    getValidationClass(field) {
        return this.userValidation.fields[field].isValid ? '' : 'has-error';
    }

    checkBirthDate(date) {
        let checkDate = moment(this.maxDate);
        return checkDate.isSameOrAfter(moment(date), 'year') && checkDate.isSameOrAfter(moment(date), 'month') && checkDate.isSameOrAfter(moment(date), 'day')
    }

    addUser() {
        if (this.checkBirthDate(this.birthDate)) {
            this.user.age = new Date().getFullYear() - this.birthDate.getFullYear();
            this.userValidation = Validation.checkObject(this.userValidation);
            if (this.userValidation.isValid) {
                this.registerVan();
            } else {
                const notifyConfig = new NotifyConfig(
                    Notify.Type.WARNING,
                    Notify.Placement.TOP_CENTER,
                    Notify.TEMPLATES.Template2,
                    'The Form is Not Valid',
                    ''
                );
                Notify.showNotify(notifyConfig);
            }
        } else {
            const notifyConfig = new NotifyConfig(
                Notify.Type.WARNING,
                Notify.Placement.TOP_CENTER,
                Notify.TEMPLATES.Template2,
                'The BirthDate is Not Valid',
                ''
            );
            Notify.showNotify(notifyConfig);
        }

    }

    registerVan() {
        this.loading = true;
        this.userService.registerVan(this.user).subscribe((res: any) => {
            if (res.isSuccessful) {
                this.loading = false;
                if (this.auth.loginWithToken(res.token)) {
                    this.router.navigateByUrl('/panel/packages');
                }
            } else if (res.message) {
                this.loading = false;
                const notifyConfig = new NotifyConfig(
                    Notify.Type.DANGER,
                    Notify.Placement.BOTTOM_CENTER,
                    Notify.TEMPLATES.Template2,
                    res.message,
                    ''
                );
                Notify.showNotify(notifyConfig);
            } else {
                this.loading = false;
                const notifyConfig = new NotifyConfig(
                    Notify.Type.DANGER,
                    Notify.Placement.BOTTOM_CENTER,
                    Notify.TEMPLATES.Template2,
                    'Invalid data!',
                    ''
                );
                Notify.showNotify(notifyConfig);
            }
        }, err => {
            this.loading = false;
            const notifyConfig = new NotifyConfig(
                Notify.Type.DANGER,
                Notify.Placement.BOTTOM_CENTER,
                Notify.TEMPLATES.Template2,
                'Invalid data!',
                ''
            );
            Notify.showNotify(notifyConfig);
        })
    }

}
