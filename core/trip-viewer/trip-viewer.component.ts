import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { DateManagerService } from "../../services/date-manager.service";
import { ImageService } from "../../services/image.service";
declare var moment;
declare let $: any;
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Memory } from "../../base/memory";
import { Notify } from '../../base/notify/notify';
import { NotifyConfig } from '../../base/notify/notify-config';
import {AppSettings} from "../../app.setting";

@Component({
  selector: 'app-trip-viewer',
  templateUrl: './trip-viewer.component.html',
  styleUrls: ['./trip-viewer.component.scss']
})
export class TripViewerComponent implements OnInit, AfterViewInit, OnDestroy,OnChanges {
  elementViewer: boolean = false;
  moment = moment;
  console = console;
  totalPackPrice: number = 0;
  options: any;
  images: Array<any> = [];
  name: string;
  tripDeadline = {
    date: new Date(),
    time: '00:00'
  };
  today=new Date();
  discount: string;
  remarks: String = '';
  isFeatured: boolean = false;
  isDrafted: boolean = false;
  isSharable: boolean = false;
  isSharableFacebook: boolean = false;
  isSharableLinkedin: boolean = false;
  isSharablePinterest: boolean = false;
  isSharableTwitter: boolean = false;
  isSharableYoutube: boolean = false;
  isSharableFlickr: boolean = false;
  status: string = 'PUBLISHED';
  hideShowMore = false;
  suggestionImages: any = [];
  totalSuggestions;
  queryData;
  @Input() tripData: Array<any> = [];
  @Input() range: string;
  @Input() update: boolean;
  @Input() packageData: any;
  @Input() agencyDetail: any;
  @Output() clicked: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  @Output() updated: EventEmitter<any> = new EventEmitter();
  @Output() deleteAll: EventEmitter<any> = new EventEmitter();
  @Output() cancelUpdateComponent: EventEmitter<any> = new EventEmitter();
  public Editor = ClassicEditor;
  memory = Memory;
  appSetting=AppSettings;

  constructor(public dateService: DateManagerService, public imageService: ImageService) {
    this.options = {
      onUpdate: (event: any) => {
        this.updated.emit(true)
      }
    };
  }

  checkAll() {

  }

  ngAfterViewInit(): void {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
  deleteComponent(trip) {
    this.deleted.emit(trip);
  }
  resetComponents() {
    this.deleteAll.emit(true);
  }
  cancelUpdate() {
    this.cancelUpdateComponent.emit(true);
  }

  ngOnInit() {
    console.log(this.agencyDetail)
    if (this.packageData) {
      this.images = this.packageData.images;
      this.discount = this.packageData.discount;
      this.name = this.packageData.name;
      this.remarks = this.packageData.remarks;
      this.isFeatured = this.packageData.isFeatured;
      this.isDrafted = this.packageData.status == 'draft';
      this.status = this.packageData.status;
    }

    // if (this.tripData[0].images) {
    //   this.tripData[0]['images'] = [];
    // }
  }
  getImageSuggestion(all?) {
    this.buildQueryData();
    this.imageService.getImageSuggestion(this.queryData, all).subscribe((r:any) => {
      this.totalSuggestions = r.result;
      this.suggestionImages = r.result.hits.map(function (item) { return { preview: item.previewURL, large: item.largeImageURL, web: item.webformatURL } })
      console.log('totalSuggestions.totalHits !== totalSuggestions.hits.length', this.totalSuggestions.totalHits !== this.totalSuggestions.hits.length)
    })
  }
  openModal() {
    $('#submitModal').modal();
    // this.maxDate=new Date(this.tripData[0].deadline)
    let date=this.tripData[0].deadline.date.substring(0,10).split('-')
    this.maxDate=new Date(date[0],date[1],date[2])
    // console.log(this.tripData[0].deadline.date.substring(0,10).split('-'))
    // console.log(this.maxDate)
    // let queryData;
    this.getImageSuggestion(false);
  }
  buildQueryData() {
    this.tripData.forEach((v, k) => {
      this.queryData = [];
      this.queryData.push(v.details.to.city)
    });
    this.queryData = Array.from(new Set(this.queryData))
    if (this.queryData.length > 1) {
      this.queryData = this.queryData.join('+')
    }
  }
  checkPrice() {
    return this.tripData.reduce((a, b) => +a + +b.bulkPrice, 0);
  }
  formatDate(date) {
    return moment(date).format('DD MMM YYYY')
  }
  maxDate = new Date(2020, 0, 1);
  broadCastClickEvent() {
    if (this.name) {
      let fromDate = moment(this.tripData[0].deadline.date)
      let toDate = moment(this.tripDeadline.date)
      let fromTime = this.tripData[0].deadline.time
      let toTime = this.tripDeadline.time;
      fromTime = fromTime.split(':')[0] * 60 + fromTime.split(':')[1]
      toTime = parseInt(toTime.split(':')[0]) * 60 + toTime.split(':')[1]
      let checkDateTime = true;
      if (toDate.isSame(moment(fromDate))) {
        if (fromTime > toTime) {
          checkDateTime = true;
        } else {
          checkDateTime = false;
        }
      }
      // if (toDate.isSameOrBefore(fromDate) && checkDateTime) {
      if (1===1) {
        $('#submitModal').modal('toggle');
        if (this.isDrafted) {
          this.status = 'DRAFT';
        }
        this.clicked.emit({
          submit: 'submit',
          name: this.name,
          discount: this.discount,
          images: this.images ? this.images : [],
          remarks: this.remarks,
          isFeatured: this.isFeatured,
          status: this.status,
          sharable: this.isSharable,
          tripDeadline: this.tripDeadline,
          sharableFacebook: this.isSharableFacebook,
          sharableLinkedin: this.isSharableLinkedin,
          sharableTwitter: this.isSharableTwitter,
          sharableYoutube: this.isSharableYoutube,
          sharableFlickr: this.isSharableFlickr,
          sharablePinterest: this.isSharablePinterest
        })
      } else {
        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.TOP_CENTER,
          Notify.TEMPLATES.Template2,
          'Please enter a valid trip deadline',
          ''
        );
        Notify.showNotify(notifyConfig);
      }


    } else {
      const notifyConfig = new NotifyConfig(
        Notify.Type.DANGER,
        Notify.Placement.TOP_CENTER,
        Notify.TEMPLATES.Template2,
        'Please enter a trip name! ',
        ''
      );
      Notify.showNotify(notifyConfig);
    }

  }
  uploadFinished(event) {
    // TODO 
    console.log('event', event);
    let newImage = '';
    if (event.serverResponse) {
      newImage = JSON.parse(event.serverResponse.response._body).result.path;
      this.images.push(newImage);
    } else {
      // toggle process for autosuggestion selector
      if (this.images.indexOf(event) < 0) {
        newImage = event;
        this.images.push(newImage);
      } else {
        let k = this.images.indexOf(event);
        this.images.splice(k, 1)
        // this.images = this.images.filter(function(v){return v!==''});
      }
    }

    //     // newImageObj = {url: newImage}

    // console.log(this.images);
    // this.tripData[0].images = this.images;
  }
  onRemoved(event) {
    let toRemoveImage = JSON.parse(event.serverResponse.response._body).result.path,
      index = this.images.indexOf(toRemoveImage);

    this.images.splice(index, 1)
    // this.tripData[0].images
  }



  mouseEnter(trip) {
    this.tripData.forEach(function (item) {
      if(!trip._id){
        item.hasBorder=false;
      }else if(!item._id){
        item.hasBorder=false;
      }else if (item.pair == trip._id) {
        item.hasBorder = true;
      }else if (trip.pair == item._id) {
        item.hasBorder = true;
      }

    })
  }
  mouseOut(trip) {
    this.tripData.forEach(function (item) {
      if (item.pair == trip._id) {
        item.hasBorder = false;
      }
      if (trip.pair == item._id) {
        item.hasBorder = false;
      }
    })
  }


  ngOnChanges() {
    console.log(this.tripData);
  }

  ngOnDestroy() {
    $('#submitModal').modal('hide')
  }

}
