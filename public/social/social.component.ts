import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Memory} from '../../base/memory';
import {AppSettings} from "../../app.setting";

@Component({
    selector: 'app-social',
    templateUrl: './social.component.html',
    styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {

    constructor(private route: ActivatedRoute) {
    }

    social: string;
    mode: string = null;
    modeFB: string = null;
    modeTT: string = null;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['type']) {
                this.social = params['type']
                let self = this;
                setTimeout(function () {
                    self.goToSocial()
                }, 500)
            }
            if (params['mode']) {
                this.mode = params['mode'];
            }
            if (params['modeFB']) {
                this.modeFB = params['modeFB'];
            }
            if (params['modeTT']) {
                this.modeTT = params['modeTT'];
            }
        })

    }

    goToSocial() {
        if (this.social == 'twitter' &&!this.modeTT)
            window.location.href = `${AppSettings.DOMAIN}/api/auth/twitter?agency_id=${Memory.getAgencyId()}${this.getMode()}`;
        if (this.social == 'google')
            window.location.href = `${AppSettings.DOMAIN}/api/auth/google?agency_id=${Memory.getAgencyId()}`;
        if (this.social == 'twitter' &&this.modeTT){
            console.log('omad',`${AppSettings.DOMAIN}/api/auth/twitter/register`)
            window.location.href = `${AppSettings.DOMAIN}/api/auth/twitter/register`;
        }

        if (this.social == 'linkedin')
            window.location.href = `${AppSettings.DOMAIN}/api/auth/linkedin?agency_id=${Memory.getAgencyId()}${this.getMode()}`;

        if (this.social == 'pinterest')
            window.location.href = `${AppSettings.DOMAIN}/api/auth/pinterest?agency_id=${Memory.getAgencyId()}${this.getMode()}`;

        if (this.social == 'flickr')
            window.location.href = `${AppSettings.DOMAIN}/api/auth/flickr?agency_id=${Memory.getAgencyId()}${this.getMode()}`;

        if (this.social == 'facebook' && !this.modeFB)
            window.location.href = `${AppSettings.DOMAIN}/api/auth/facebook?agency_id=${Memory.getAgencyId()}${this.getMode()}`;


        if (this.social == 'facebook' && this.modeFB)
            window.location.href = `${AppSettings.DOMAIN}/api/auth/facebook/register`;

        if (this.social == 'youtube')
            window.location.href = `${AppSettings.DOMAIN}/api/auth/youtube?agency_id=${Memory.getAgencyId()}${this.getMode()}`;

    }

    getMode() {
        return this.mode !== null ? '&mode=onboard' : ''
    }

}
