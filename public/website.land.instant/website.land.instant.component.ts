import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-website.land.instant',
  templateUrl: './website.land.instant.component.html',
  styleUrls: ['./website.land.instant.component.scss']
})
export class InstantComponent implements OnInit {
	sections = [

		{
			title: "Push to Update",
			description: "On each trip building, a notification for newly added or edited visa requirements, price change for component or even changes in image will be sent to your very own website to get you updated."
		},
		{
			title: "Booking Engine",
			description: "All websites are covered by a powerful booking engine for users. An end to end needs of your clients has already predicted and integrated in our engine. Clients would be able to send and follow up inquiries, book trips, sign up in your website and request or fill up customized forms for visa processing."
		},
		{
			title: "Upgradable and Trackable Data",
			description: "All information such as, emails, Skype names, phone numbers, social medias, etc. are editable at any time without any coding skills."
		},
		{
			title: "Mobile Friendly",
			description: "All websites are automatically mobile, tablet and kiosk friendly for your end to end needs. All features are available for total platforms."
		}
	];
	data = {
		title: "INSTANT WEBSITE UPDATE",
		img: "../../../../assets/img/webdesign.jpeg"
	};
  menuItem={
    home:{
      title:"Home",
      description:"",
      link:""
    },pricing:{
      title:"Pricing",
      description:"",
      link:""
    },api:{
      title:"Api",
      description:"",
      link:""
    },
  };
  constructor() { }

  ngOnInit() {
  }

}
