import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SocialService} from "../../services/social.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Memory} from "../../base/memory";
import {AppSettings} from "../../app.setting";
@Component({
    selector: 'app-itinerary-social',
    templateUrl: './itinerary-social.component.html',
    styleUrls: ['./itinerary-social.component.scss']
})
export class ItinerarySocialComponent implements OnInit {
    // ~Social Start
    fbData: FacebookPageData;
    @Input() agencyDetails: any;
    @Input() totalPackagePrice: any;
    panelOpenState: any;
    @Input() social: Social;
    @Output() submit: EventEmitter<any> = new EventEmitter();
    @Output() back: EventEmitter<any> = new EventEmitter();

    submittTags: boolean = false;
    submittTagsT: boolean = false;
    submittTagsFB: boolean = false;
    submittTagsY: boolean = false;
    submittTagsTel: boolean = false;
    tagLoader: boolean = false;
    lnTags: boolean = false;
    ttTags: boolean = false;
    fbTags: boolean = false;
    telTags: boolean = false;
    youTags: boolean = false;
    tag: string;
    visible = true;
    selectable = true;
    role: string;
    memory=Memory;
    math=Math;
    appSetting = AppSettings;

    constructor(private socialService: SocialService,
                private auth: AuthService,
                private router: Router) {
    }
    triggerUpload(sClass){
        $(`.${sClass} .img-ul-file-upload .img-ul-upload input`).click()
    }
    socialUploadFinished(event,social){
        this.social[social].images = [];
        if (!event.serverResponse.response.body) {
         event.serverResponse.response['body'] = JSON.parse(event.serverResponse.response._body);
        }
        this.social[social].images.push(event.serverResponse.response.body.result.path);
    }
    getFbData() {
        if (this.agencyDetails.social_media.facebook.pages) {
            this.fbData = {
                img: `http://graph.facebook.com/${this.agencyDetails.social_media.facebook.pages[0].id}/picture?access_token=${this.agencyDetails.social_media.facebook.pages[0].access_token}`,
                title: this.agencyDetails.social_media.facebook.pages[0].name
            };
            this.social.facebook.logo = this.fbData.img;
            this.social.facebook.title = this.fbData.title;
            return this.fbData.img;
        }
    }

    goToMarketing() {
        this.router.navigateByUrl('/panel/marketing')
    }

    ngOnInit() {
        console.log(this.totalPackagePrice,'<<<<<<')
        this.role = this.auth.getRole();
        let self = this;
        setTimeout(function () {
            console.log(self.agencyDetails);
            if (self.agencyDetails.social_media && self.agencyDetails.social_media.twitter)
                self.social.twitter.title = self.agencyDetails.social_media.twitter ? self.agencyDetails.social_media.twitter.screen_name : null;
        }, 1000)
    }

    submitPackage() {
        this.submit.emit(true);
    }
    uploadFinished(event) {
        this.social.facebook.images = [];
        if (!event.serverResponse.response.body) {
         event.serverResponse.response['body'] = JSON.parse(event.serverResponse.response._body);
        }
        this.social.facebook.images.push(event.serverResponse.response.body.result.path);
    }

    onUploadFinished(file: any) {
        this.social.facebook.images = [];
        this.social.facebook.images.push(file)
    }

    getTags(social) {
        if (this.tag) {
            this.tagLoader = true;
            this.socialService.autoSuggestTag(this.tag).subscribe((res: any) => {
                if (res.isSuccessful) {
                    this.social[social].tags = res.result;
                    this.tagLoader = false;
                    if (social === 'linkedin') {
                        this.submittTags = true;
                    } else if (social === 'twitter') {
                        this.submittTagsT = true;
                    } else if (social === 'facebook') {
                        this.submittTagsFB = true;
                    } else if (social === 'youtube') {
                        this.submittTagsY = true;
                    } else if (social === 'telegram') {
                        this.submittTagsTel = true;
                    }
                }
            })
        }
    }

    add(event: MatChipInputEvent, field) {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            this.social[field].tags.push(value.trim());
        }
        if (input) {
            input.value = '';
        }
    }

    goBack() {
        this.back.emit(true)
    }

}

export class FacebookPageData {
    img: string;
    title: string;
}

export class Social {
    facebook: FacebookData = new FacebookData();
    twitter: TwitterData = new TwitterData();
    linkedin: LinkedinData = new LinkedinData();
    telegram: TelegramData = new TelegramData();

}

export class FacebookData {
    description: string;
    logo: string;
    title: string;
    packageId: string;
    images: Array<any> = [];
    active: boolean;
    hasHashtag: boolean;
    tags: Array<any> = [];
}

export class TwitterData {
    description: string;
    logo: string;
    packageId: string;
    title: string;
    images: Array<any> = [];
    active: boolean;
    hasHashtag: boolean;
    tags: Array<any> = [];

}

export class LinkedinData {
    description: string;
    logo: string;
    packageId: string;
    title: string;
    images: Array<any> = [];
    active: boolean;
    hasHashtag: boolean;
    tags: Array<any> = [];

}

export class TelegramData {
    description: string;
    logo: string;
    packageId: string;
    title: string;
    images: Array<any> = [];
    active: boolean;
    hasHashtag: boolean;
    tags: Array<any> = [];

}
