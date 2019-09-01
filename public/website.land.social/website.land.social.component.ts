import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-sharing',
  templateUrl: './website.land.social.component.html',
  styleUrls: ['./website.land.social.component.scss']
})
export class SocialSharingComponent implements OnInit {
	sections = [

		{
			title: "Social Media is The Real Business",
			description: "Next Journey provides single click authorization to your business' page and share every trip you built upon your selection in the preview mode."
		},
		{
			title: "Coverage",
			description: "We cover Facebook shares (Multiple pages), Telegram channels (Multiple Channels), Pinterest, Twitter, LinkedIn, YouTube and Flickr, including re-share and statistics."
		},
		{
			title: "Email Marketing",
			description: "You may send emails to all your clients for promotions, newsletters and newly changed trips and elements."
		},
	];
	data = {
		title: "SHARABLE TRIP ELEMENTS",
		img: "../../../../assets/img/marketing.png"
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
