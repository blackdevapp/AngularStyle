import {Component, Input, OnInit} from '@angular/core';
import {Card, Event} from "../itinerary-details/itinerary-details.component";
import * as moment from 'moment';
import {UploadService} from "../../services/upload.service";
import {ActivatedRoute} from "@angular/router";
import {ComponentService} from "../../services/component.service";
import {Memory} from "../../base/memory";

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit {
  card:Card=new Card();
  selectedDate: Array<string> = [];
  packageId: string;
  packages: Array<any> = [];
  allPackage: Array<any> = [];
  item: any;
  packageItem: any;
  totalPackagePrice: number = 0;
  mainSlideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": false,
    "infinite": true,
    "autoplay": false,
    "autoplaySpeed": 2500
  };
  @Input() data:any;
  constructor(private uploadService: UploadService,
              private activeRoute: ActivatedRoute,
              private componentService: ComponentService) { }

  ngOnInit() {
    console.log('raft')
    this.convertPackageToCard(this.data);

    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.packageId = params['id'];
        this.componentService.getOneTopPackage(this.packageId).subscribe((res: any) => {
          if (res) {
            let self = this;
            res.forEach((v) => {
              self.getMultipleComponent2(v);
            });
            this.componentService.getMultipleComponent(res[0]).subscribe(
              (response: any) => {
                if (response) {
                  let tmpPackage = {
                    packageData: res[0],
                    componentsData: response
                  };
                  this.packageItem=tmpPackage;
                  console.log('item2',this.packageItem)

                }
              });
          }
        })

      }
    })

  }
  getMultipleComponent2(data) {
    this.componentService.getMultipleComponent(data).subscribe(
      (response: any) => {
        if (response) {
          let tmpPackage = {
            packageData: data,
            componentsData: response
          };
          this.allPackage.push(tmpPackage);
        }
      });
  }
  // fileChangeListenerPic($event) {
  //   let image = new Image();
  //   const file = $event.target.files[0];
  //   const myReader: FileReader = new FileReader();
  //   const that = this;
  //   myReader.onloadend = function (loadEvent: any) {
  //     image.src = loadEvent.target.result;
  //     that.card.cover.push({largeImageURL: image.src});
  //   };
  //   myReader.readAsDataURL(file);
  //   this.uploadService.upload(file, '5c15efb47b741fff2044ec26').subscribe((res: any) => {
  //     if (res.isSuccessful) {
  //       this.card.cover.push({largeImageURL: res.result.path});
  //     }
  //   })
  // }
  checkValidDate = (d: Date): boolean => {
    return this.selectedDate.indexOf(moment(d).format('DD/MM/YYYY')) == -1;
  }
  fileChangeListenerLogo($event) {
    let image = new Image();
    const file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.card.logo = image.src
    };
    myReader.readAsDataURL(file);
    this.uploadService.upload(file, '5c15efb47b741fff2044ec26').subscribe((res: any) => {
      if (res.isSuccessful) {
        this.card.logo = res.result.path;
      }
    })
  }

  convertPackageToCard(trip) {
    for (let item of trip.componentsData) {
      if (item.associated_agency === 'amadeus'||item.associated_agency === 'airasia') {

        let index = 0;
        for (let segment of item.segments) {
          if (this.card.days.length > 0) {
            for (let sub of this.card.days) {
              let data2: Event = new Event();
              data2.time = segment.flightSegment.departure.at.split('T')[1].substring(0, 5);
              data2.type = item.type;
              data2.componentId = item._id;
              data2.details.from = segment.flightSegment.departure.iataCode;
              data2.details.to = segment.flightSegment.arrival.iataCode;
              data2.location.address = 'Something Company #14 Main Ave. Detro St.';
              data2.location.type = item.type === 'AIRPLANE' ? 'line' : 'pin';
              data2.externalRes = item;
              let data3: Event = new Event();
              data3.time = segment.flightSegment.arrival.at.split('T')[1].substring(0, 5);
              data3.type = item.type;
              data3.componentId = item._id;
              data3.details.from = segment.flightSegment.departure.iataCode;
              data3.details.to = segment.flightSegment.arrival.iataCode;
              data3.location.address = 'Something Company #14 Main Ave. Detro St.';
              data3.location.type = item.type === 'AIRPLANE' ? 'line' : 'pin';
              data3.externalRes = item;
              data3.price = this.exchangeAmadeus(item);

              data3.temp = true;
              data3.arrival=true;
              if (index === 0) {
                data2.price = this.exchangeAmadeus(item);
                this.totalPackagePrice += parseFloat(data2.price);
              } else {
                data2.temp = true;
              }
              index++;
              data2.externalRes = item;
              if (this.checkDateExist(this.parseISOString(segment.flightSegment.departure.at))) {
                if (this.parseISOString(segment.flightSegment.departure.at) === sub.date) {
                  this.getCroods(data2, data2.location.type);
                  sub.events.push(data2);
                }
              } else {
                this.selectedDate.push(this.parseISOString(segment.flightSegment.departure.at));
                this.getCroods(data2, data2.location.type);

                this.card.days.push({
                  date: this.parseISOString(segment.flightSegment.departure.at),
                  events: [data2]
                });
              }
              if (this.checkDateExist(this.parseISOString(segment.flightSegment.arrival.at))) {
                if (this.parseISOString(segment.flightSegment.arrival.at) === sub.date) {
                  this.getCroods(data3, data3.location.type);
                  sub.events.push(data3);
                  break;
                }
              } else {
                this.selectedDate.push(this.parseISOString(segment.flightSegment.arrival.at));
                this.getCroods(data2, data2.location.type);

                this.card.days.push({
                  date: this.parseISOString(segment.flightSegment.arrival.at),
                  events: [data3]
                });
                break;
              }


            }
          }else {
            index++;
            let i = 0;
            // for (let segment of item.segments) {
            let data2: Event = new Event();
            data2.time = segment.flightSegment.departure.at.split('T')[1].substring(0, 5);
            data2.type = item.type;
            data2.componentId = item._id;
            data2.details.from = segment.flightSegment.departure.iataCode;
            data2.details.to = segment.flightSegment.arrival.iataCode;
            data2.location.address = 'Something Company #14 Main Ave. Detro St.';
            data2.location.type = item.type === 'AIRPLANE' ? 'line' : 'pin';
            data2.externalRes = item;
            let data3: Event = new Event();
            data3.time = segment.flightSegment.arrival.at.split('T')[1].substring(0, 5);
            data3.type = item.type;
            data3.componentId = item._id;
            data3.details.from = segment.flightSegment.departure.iataCode;
            data3.details.to = segment.flightSegment.arrival.iataCode;
            data3.location.address = 'Something Company #14 Main Ave. Detro St.';
            data3.location.type = item.type === 'AIRPLANE' ? 'line' : 'pin';
            data3.externalRes = item;
            data3.temp = true;
            data3.price=this.exchangeAmadeus(item);
            data3.arrival=true;

            if (i === 0) {
              data2.price = this.exchangeAmadeus(item);
              this.totalPackagePrice += parseFloat(data2.price);
            } else {
              data2.temp = true;
            }
            i++;
            data2.externalRes = item;

            this.selectedDate.push(this.parseISOString(segment.flightSegment.departure.at));
            this.getCroods(data2, data2.location.type);

            this.card.days.push({
              date: this.parseISOString(segment.flightSegment.departure.at),
              events: [data2]
            });
            if (this.parseISOString(segment.flightSegment.arrival.at) === this.card.days[0].date) {
              this.getCroods(data3, data3.location.type);
              this.card.days[0].events.push(data3);
            }else{
              this.selectedDate.push(this.parseISOString(segment.flightSegment.arrival.at));
              this.getCroods(data2, data2.location.type);

              this.card.days.push({
                date: this.parseISOString(segment.flightSegment.arrival.at),
                events: [data3]
              });
            }


            break;



            // }
          }
        }


      } else {
        if (this.card.days.length > 0) {
          let data: Event = new Event();
          data.time = item.details.from.departure.time;
          data.type = item.type;
          data.componentId = item._id;
          data.details.from = item.details.from.city;
          data.details.to = item.details.to.city;
          data.location.address = 'Something Company #14 Main Ave. Detro St.';
          data.location.type = item.type === 'AIRPLANE' ? 'line' : 'pin';
          data.price = this.exchange(item);
          data.externalRes = null;
          item.details.roundTrip ? this.checkRoundTrip(item) : null;

          let data1: Event = new Event();
          data1.time = item.details.from.arrival.time;
          data1.type = item.type;
          data1.componentId = item._id;
          data1.details.from = item.details.from.city;
          data1.details.to = item.details.to.city;
          data1.location.address = 'Something Company #14 Main Ave. Detro St.';
          data1.location.type = item.type === 'AIRPLANE' ? 'line' : 'pin';
          data1.externalRes = null;
          data1.temp = true;
          data1.price = this.exchange(item);

          data1.arrival=true;
          if(this.card.days.length>0){
            for (let sub of this.card.days) {
              if (this.checkDateExist(moment(item.details.from.departure.date).format('DD/MM/YYYY'))) {
                if (sub.date === moment(item.details.from.departure.date).format('DD/MM/YYYY')) {
                  sub.events.push(data);
                  break;
                }
              } else {
                this.selectedDate.push(moment(item.details.from.departure.date).format('DD/MM/YYYY'));
                this.card.days.push({
                  date: moment(item.details.from.departure.date).format('DD/MM/YYYY'),
                  events: [data]
                });
                break;
              }
            }
            this.getCroods(data, data.location.type);
            // this.card.days[indexOfDay].events.splice(e.currentIndex, 0, data);
            this.totalPackagePrice += parseFloat(data.price);
            for (let sub of this.card.days) {
              if (this.checkDateExist(moment(item.details.from.arrival.date).format('DD/MM/YYYY'))) {
                if (sub.date === moment(item.details.from.arrival.date).format('DD/MM/YYYY')) {
                  sub.events.push(data1);
                  break;
                }
              } else {
                this.selectedDate.push(moment(item.details.from.arrival.date).format('DD/MM/YYYY'));
                this.card.days.push({
                  date: moment(item.details.from.arrival.date).format('DD/MM/YYYY'),
                  events: [data1]
                });
                break;
              }

            }
          }else{
            this.selectedDate.push(moment(item.details.from.departure.date).format('DD/MM/YYYY'));
            this.card.days.push({
              date: moment(item.details.from.departure.date).format('DD/MM/YYYY'),
              events: [data]
            });
            this.getCroods(data, data.location.type);
            // this.card.days[indexOfDay].events.splice(e.currentIndex, 0, data);
            this.totalPackagePrice += parseFloat(data.price);
            for (let sub of this.card.days) {
              if (this.checkDateExist(moment(item.details.from.arrival.date).format('DD/MM/YYYY'))) {
                if (sub.date === moment(item.details.from.arrival.date).format('DD/MM/YYYY')) {
                  sub.events.push(data1);
                  break;
                }
              } else {
                this.selectedDate.push(moment(item.details.from.arrival.date).format('DD/MM/YYYY'));
                this.card.days.push({
                  date: moment(item.details.from.arrival.date).format('DD/MM/YYYY'),
                  events: [data1]
                });
                break;
              }

            }
          }



        }
        else {
          this.selectedDate.push(moment(item.pair ? item.details.to.departure.date : item.details.from.departure.date).format('DD/MM/YYYY'));
          this.card.days.push({
            date: moment(item.pair ? item.details.to.departure.date : item.details.from.departure.date).format('DD/MM/YYYY'),
            events: this.convertComponentToEvent(item)
          })
        }
      }
    }
    console.log(this.card);
    this.sortDays();
  }
  sortDays(){
    for(let item of this.card.days){
      let splitDate=item.date.split('/');
      item.dateNative=new Date(splitDate[2],parseInt(splitDate[1])-1,splitDate[0])
    }
    this.card.days.sort((n1, n2) => n1.dateNative - n2.dateNative);
  }
  checkRoundTrip(component) {
    let newComp = Object.assign({}, component);
    newComp.pair = newComp._id;
    newComp.bulkPrice = 0;
    for (let sub of this.card.days) {
      if (sub.date === moment(newComp.pair ? newComp.details.to.departure.date : newComp.details.from.departure.date).format('DD/MM/YYYY')) {
        sub.events = sub.events.concat(this.convertComponentToEvent(newComp));
        break;
      } else {
        this.selectedDate.push(moment(newComp.pair ? newComp.details.to.departure.date : newComp.details.from.departure.date).format('DD/MM/YYYY'));
        this.card.days.push({
          date: moment(newComp.pair ? newComp.details.to.departure.date : newComp.details.from.departure.date).format('DD/MM/YYYY'),
          events: this.convertComponentToEvent(newComp)
        });
        break;
      }
    }
    let data1: Event = new Event();
    data1.time = component.pair ? component.details.to.arrival.time : component.details.from.arrival.time;
    data1.pair = component.pair ? component.pair : null;
    data1.type = component.type;
    data1.temp = true;
    data1.arrival=true;
    data1.componentId = component._id;
    data1.details.from = (component.associated_agency !== 'amadeus'&&component.associated_agency !== 'airasia') ? (component.pair ? component.details.to.city : component.details.from.city) : this.card.from;
    data1.details.to = (component.associated_agency !== 'amadeus'&&component.associated_agency !== 'airasia') ? (component.pair ? component.details.from.city : component.details.to.city) : this.card.to;
    data1.location.address = 'Something Company #14 Main Ave. Detro St.';
    data1.location.type = component.type === 'AIRPLANE' ? 'line' : 'pin';
    for (let sub of this.card.days) {
      if (sub.date === moment(newComp.pair ? newComp.details.to.arrival.date : newComp.details.from.arrival.date).format('DD/MM/YYYY')) {
        sub.events.push(data1);
        break;
      } else {
        this.selectedDate.push(moment(newComp.pair ? newComp.details.to.arrival.date : newComp.details.from.arrival.date).format('DD/MM/YYYY'));
        this.card.days.push({
          date: moment(newComp.pair ? newComp.details.to.arrival.date : newComp.details.from.arrival.date).format('DD/MM/YYYY'),
          events: [data1]
        });
        break;
      }
    }

  }

  exchangeAmadeus(component) {
    if(component.associated_agency==='airasia'){
      if('PHP'===Memory.getActiveCurrency()){
        return parseFloat(component.bulkPrice);
      }else{
        return parseFloat(component.bulkPrice)*parseFloat(Memory.getCurrency()[`USD_${Memory.getActiveCurrency()}`])
      }
    }else{
      if('EUR'===Memory.getActiveCurrency()){
        return parseFloat(component.bulkPrice);
      }else{
        return parseFloat(component.bulkPrice)*parseFloat(Memory.getCurrency()[`EUR_${Memory.getActiveCurrency()}`])
      }
    }
  }

  checkDateExist(date) {
    let i = 0;
    this.card.days.filter(value => {
      if (value.date === date) {
        i++;
      }
    })
    return i > 0;
  }

  parseISOString(s) {
    var b = s.split(/\D+/);
    return moment(new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]))).format('DD/MM/YYYY');
  }

  getCroods(event, type) {
    if (type === 'line') {
      this.componentService.autoSuggestionCity(event.details.from, false).subscribe(
        (response:any) => {
          if (response) {

            let r = response.result.filter(function (d) {
              return d.CityName.toLowerCase().indexOf(event.details.from.toLowerCase()) > -1;
            });
            r = r[0];
            r.Location = r.Location.split(',');
            r.Location[0] = parseFloat(r.Location[0])
            r.Location[1] = parseFloat(r.Location[1]);
            event.location.pointA.lat = r.Location[0];
            event.location.pointA.lng = r.Location[1];
            this.componentService.autoSuggestionCity(event.details.to, false).subscribe(
        (response:any) => {
                if (response) {

                  let n = response.result.filter(function (d) {
                    return d.CityName.toLowerCase().indexOf(event.details.to.toLowerCase()) > -1;
                  });
                  n = n[0];
                  n.Location = n.Location.split(',');
                  n.Location[0] = parseFloat(n.Location[0]);
                  n.Location[1] = parseFloat(n.Location[1]);
                  event.location.pointB.lat = n.Location[0];
                  event.location.pointB.lng = n.Location[1];
                  console.log(1234567890, event);

                }
              });

          }
        });
    } else {
      this.componentService.autoSuggestionCity(event.details.to, false).subscribe(
        (response:any) => {
          if (response) {

            let n = response.result.filter(function (d) {
              return d.PlaceId.toLowerCase().indexOf(event.details.to.toLowerCase()) > -1;
            });
            n.Location = n.Location.split(',');
            n.Location[0] = parseFloat(n.Location[0]);
            n.Location[1] = parseFloat(n.Location[1]);
            event.location.pointA.lat = n.Location[0];
            event.location.pointA.lng = n.Location[1];

          }
        });
    }


  }

  exchange(component) {
    if (component.currency) {
      console.log(1);
      if (component.currency === Memory.getActiveCurrency()) {
        return parseFloat(component.bulkPrice);
      } else if (component.currency != Memory.getActiveCurrency()) {
        return parseFloat(component.bulkPrice) * parseFloat(Memory.getCurrency()[`${component.currency}_${Memory.getActiveCurrency()}`])
      }
    } else {
      return parseFloat(component.bulkPrice);
    }
  }

  convertComponentToEvent(component): Array<Event> {
    let data: Event = new Event();
    data.time = component.pair ? component.details.to.departure.time : component.details.from.departure.time;
    data.pair = component.pair ? component.pair : null;
    data.type = component.type;
    data.componentId = component._id;
    data.details.from = (component.associated_agency !== 'amadeus'&&component.associated_agency !== 'airasia') ? (component.pair ? component.details.to.city : component.details.from.city) : this.card.from;
    data.details.to = (component.associated_agency !== 'amadeus'&&component.associated_agency !== 'airasia') ? (component.pair ? component.details.from.city : component.details.to.city) : this.card.to;
    data.location.address = 'Something Company #14 Main Ave. Detro St.';
    data.location.type = component.type === 'AIRPLANE' ? 'line' : 'pin';
    data.price = this.exchange(component);
    data.externalRes = (component.associated_agency === 'amadeus'||component.associated_agency==='airasia') ? component : null;

    this.totalPackagePrice += this.exchange(component);
    this.getCroods(data, data.location.type);
    return [data];
  }
}
