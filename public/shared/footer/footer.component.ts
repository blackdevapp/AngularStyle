import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() agency:any;
  constructor(private router:Router) { }

  ngOnInit() {
    console.log(this.agency);
  }
  navigateTo(route){
    this.router.navigateByUrl(route)


  }
}
