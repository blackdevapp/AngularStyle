import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-website.land.sharable',
  templateUrl: './website.land.sharable.component.html',
  styleUrls: ['./website.land.sharable.component.scss']
})
export class SharableComponent implements OnInit {
	sections = [

		{
			title: "Secured Share Engine",
			description: "Share Engine presents capacity to travel agencies to get access to a wider range of trip elements from entire community such as airfare, accommodation, vans, trains, cruises and even tour guides to build affordable and quality tour packages for your customers."
		},
		{
			title: "Tie Up Mode",
			description: "Travel agencies can have tie up request to vans, tour guides and resorts. Building day trips would be even easier when your travel agency is now able to tie up an element."
		},
		{
			title: "Advance Inquiry System",
			description: "By every request you have made from a shared component, your inquiry will be forwarded to respective agency and you will be informed through email and right into your panel once your request has been approved."
		},
	];
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
	data = {
		title: "MEGA SOCIAL DISTRIBUTION CHANNEL ",
		img: "../../../../assets/img/coworker.jpg"
	}
  constructor() { }

  ngOnInit() {

  }

}
