import { Component, OnInit,Input ,Output,EventEmitter} from '@angular/core';
import {SocialService} from "../../services/social.service";
import { AgenciesService } from '../../services/agencies.service';

@Component({
  selector: 'app-telegram',
  templateUrl: './telegram.component.html',
  styleUrls: ['./telegram.component.scss']
})
export class TelegramComponent implements OnInit {
  @Input() agencyDetails;
  @Output () telegramEvent = new EventEmitter<string>()

  telegram: String = 'hasChannel';
  searchResult = [];
  channelName: String = '';
  step: String = 'one';
  njIsAdmin: Boolean = false;
  tmpVal;
  constructor(
    private socialService:SocialService,
    private agenciesService:AgenciesService
  	) { }

  ngOnInit() {
  }
  getChannels(input){

    this.socialService.autoSuggestionChannels(input).subscribe(
        (response:any) => {
         
        if (response) {
          this.searchResult = [];
          this.searchResult.push(response);
        }
      }); 
  }
  checkStatus(input){
    this.socialService.checkStatus(input).subscribe(
        (response:any) => {
          let {user,status} = response
        if (response && status === 'administrator') {
            this.agencyDetails.social_media.telegram = '@'+this.channelName
            // add by masoud
            // alert(this.channelName)
            
           
            this.telegramEvent.emit('@'+this.channelName)
            this.socialService.setTelegramAccount('@'+this.channelName).subscribe((response:any)=>{
            
            })
            // add by masoud

            this.agenciesService.editAgencies(this.agencyDetails).subscribe(
        (response:any) => {
                if (response) {
                  this.njIsAdmin = true;
                  this.step = 'four';
                }
              });
          }else{
            this.checkStatusAgain();
          }
      });
  }
  checkStatusAgain(){
    setTimeout(() => {
      this.checkStatus('@'+this.channelName)  
    }, 4000);
    
  }
  goToTel(){
    window.open('https://telegram.org/tour/channels','_blank')
  }


}
