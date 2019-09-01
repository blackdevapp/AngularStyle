import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() tmpImages:Array<any>=[];
  mainSlideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": false,
    "infinite": true,
    "autoplay": false,
    "autoplaySpeed": 2500
  };
  constructor() { }

  ngOnInit() {
  }

}
