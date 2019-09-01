import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-website-header',
  templateUrl: './website-header.component.html',
  styleUrls: ['./website-header.component.scss']
})
export class WebsiteHeaderComponent implements OnInit {
  @Input() menuItem;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  login(){
    this.router.navigateByUrl('/auth/signup')
  }

  fb(){
    window.open('https://fb.com/nextjourney.co','_blank')
  }
}
