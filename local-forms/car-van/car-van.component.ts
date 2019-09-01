import {Component, OnInit, Input} from '@angular/core';
import {ComponentService} from '../../services/component.service';
import * as moment from 'moment';
import {AuthService} from "../../services/auth.service";
import {Memory} from "../../base/memory";
import {Validation} from "../../base/validation";
import {ValidationModel} from "../../base/validationModel";
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";

declare var $: any;

@Component({
    selector: 'app-car-van',
    templateUrl: './car-van.component.html',
    styleUrls: ['./car-van.component.scss']
})
export class CarVanComponent implements OnInit {
    tripValidationIntial: Array<any>;
    tripValidation: ValidationModel;
    @Input() contentData;
    @Input() componentName;
    @Input() editMode: boolean = false;
    moment = moment;
    endDate;
    memory = Memory;
    maxDate: Date = new Date();
    today = new Date();

    seatClass = [
        {
            displayName: "Business Class",
            name: "business-class",
            icon: "airline_seat_legroom_extra"
        },
        {
            displayName: "Economy Class",
            name: "economy-class",
            icon: "airline_seat_legroom_reduced"
        }
    ]
    trip;
    init = {
        type: "van-driver",
        company: "",
        currency: Memory.getActiveCurrency() ? Memory.getActiveCurrency() : 'PHP',
        user: localStorage.getItem("nj.user_id"),
        soloPrice: 0,
        bulkPrice: 0,
        soloPriceChild: 0,
        bulkPriceChild: 0,
        tax: 0,
        quantity: 0,
        asSolo: false,
        asSharable:true,
        asPackage: true,
        mode: 'transport',
        icon: 'airport_shuttle',
        associated_agency: Memory.getAgencyId(),
        details: {
            roundTrip: true,
            carModel: '',
            carNumber: '',
            quantity: 0,
            addons: [
                {
                    name: "Business Class",
                    availability: true,
                    icon: "airline_seat_legroom_extra",
                    type: 'mat'
                },
                {
                    name: "Gas",
                    availability: true,
                    icon: "event_seat",
                    type: 'mat'
                }],
            from: {
                city: "Manila",
                station: "Fairview",
                class: "ECONOMY"
            },
            to: {
                city: "Boracay",
                station: "Bacolod",
                class: "ECONOMY"
            }
        },
    }

    constructor(private componentService: ComponentService) {
        this.tripValidationIntial = [
            {field: 'company', toBe: ['cs-46']},
            {field: 'carModel', toBe: ['cs-46']},
            {field: 'carNumber', toBe: ['cs-46']},
            {field: 'from', toBe: ['cs-85']},
            {field: 'to', toBe: ['cs-85']},
            {field: 'tax', toBe: ['cn-2']},
            {field: 'quantity', toBe: ['cn-7']},
            {field: 'soloPrice', toBe: ['compare-gtt-bulkPrice']},
            {field: 'bulkPrice', toBe: ['compare-ltt-soloPrice']},
        ];
        this.tripValidation = Validation.intialObject(this.tripValidationIntial);
    }

    ngOnInit() {
        if (this.contentData && (this.contentData.type === this.init.type)) {
            this.trip = this.contentData;
            this.tripValidation.fields.company.originalValue = this.trip.company;
            this.tripValidation.fields.soloPrice.originalValue = this.trip.soloPrice;
            this.tripValidation.fields.bulkPrice.originalValue = this.trip.bulkPrice;
            this.tripValidation.fields.tax.originalValue = this.trip.tax;
            this.tripValidation.fields.quantity.originalValue = this.trip.quantity;
            this.tripValidation.fields.from.originalValue = this.trip.details.from.city;
            this.tripValidation.fields.to.originalValue = this.trip.details.to.city;
            this.editMode = true;
        } else {

            this.trip = this.init;
            this.tripValidation.fields.tax.originalValue = this.init.tax;
            this.tripValidation.fields.quantity.originalValue = this.init.quantity;
            this.tripValidation.fields.company.originalValue = this.init.company;
            this.tripValidation.fields.soloPrice.originalValue = this.init.soloPrice;
            this.tripValidation.fields.bulkPrice.originalValue = this.init.bulkPrice;
            this.tripValidation.fields.from.originalValue = this.init.details.from.city;
            this.tripValidation.fields.to.originalValue = this.init.details.to.city;
            this.editMode = false;
        }
    }

    getSelected(event: any) {
        console.log(event)
    }

    changeMaxDate() {
        this.maxDate = new Date(this.trip.details.from.departure.date.getFullYear(), this.trip.details.from.departure.date.getMonth(), this.trip.details.from.departure.date.getDate())
        this.trip.deadline.date = new Date(this.trip.details.from.departure.date.getFullYear(), this.trip.details.from.departure.date.getMonth(), this.trip.details.from.departure.date.getDate() - 1)
    }

    submitComponent() {
        this.trip.componentName = this.componentName;
        Memory.setLoading(true);
        setTimeout(function () {
            Memory.setLoading(false)
        }, 5000);
        this.trip.associated_agency = Memory.getAgencyId();
        this.trip.currency = Memory.getActiveCurrency() ? Memory.getActiveCurrency() : 'PHP';
        if (this.tripValidation.isValid) {
            this.trip.details.from.city = this.trip.details.from.city.toLowerCase();
            this.trip.details.to.city = this.trip.details.to.city.toLowerCase();
            if (!this.editMode) {
                this.componentService.addComponent(this.trip).subscribe(
                    (response: any) => {
                        if (response) {
                            const notifyConfig = new NotifyConfig(
                                Notify.Type.SUCCESS,
                                Notify.Placement.BOTTOM_CENTER,
                                Notify.TEMPLATES.Template2,
                                'Component sucessfully added.',
                                ''
                            );
                            Notify.showNotify(notifyConfig);
                        }
                    });
            } else {
                this.componentService.editComponent(this.trip).subscribe(
                    (response: any) => {
                        if (response) {
                            const notifyConfig = new NotifyConfig(
                                Notify.Type.SUCCESS,
                                Notify.Placement.BOTTOM_CENTER,
                                Notify.TEMPLATES.Template2,
                                'Component sucessfully updated.',
                                ''
                            );
                            Notify.showNotify(notifyConfig);
                        }
                    });
            }

        } else {
            Memory.setLoading(false)
            const notifyConfig = new NotifyConfig(
                Notify.Type.WARNING,
                Notify.Placement.TOP_CENTER,
                Notify.TEMPLATES.Template2,
                'The Form is Not Valid',
                ''
            );
            Notify.showNotify(notifyConfig);
        }

    }
    fromResult:Array<any>=[];
    toResult:Array<any>=[];

    getCitiesFrom(city,isDestination){
        this.componentService.autoSuggestionAirport(city,isDestination).subscribe((res:any)=>{
            if(res.isSuccessful) {
                if(isDestination){
                    this.toResult=res.result;
                }else{
                    this.fromResult=res.result;
                }
            }
        })
    }
}
