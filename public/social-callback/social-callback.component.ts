import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialService } from '../../services/social.service';
import { Memory } from '../../base/memory';

@Component({
  selector: 'app-social-callback',
  templateUrl: './social-callback.component.html',
  styleUrls: ['./social-callback.component.scss']
})
export class SocialCallbackComponent implements OnInit {

  constructor(private route:ActivatedRoute,
    private socialService:SocialService,
    private router:Router) { }
  social:string;
  code:string;
  mode:string;
  token:string;
  ngOnInit() {
    this.route.params.subscribe(params=>{
      if(params['type']){
        this.social=params['type']
      }
    })
    this.route.queryParams.subscribe(params=>{
      if(params['code']){
        //facebook && pinterest && linkedin
        this.code=params['code'];
      }
      if(params['mode']){
        //facebook && pinterest && linkedin
        this.mode=params['mode'];
      }
      if(params['oauth_verifier']){
        //facebook && pinterest && linkedin
        this.code=params['oauth_verifier'];
      }
      if(params['oauth_token']){
        //facebook && pinterest && linkedin
        this.token=params['oauth_token'];
      }
    })
    let self=this;
    self.goToMarketing()

    // setTimeout(function(){
    //   self.goToMarketing()
    // },5000)
  }
  goToMarketing(){
    switch(this.social){
      case "facebook":{
        if(this.mode){
          this.socialService.socialCallbackFacebookRegister(this.code).subscribe((res:any)=>{
            if(res.token){
              this.router.navigate(['/login'],{queryParams:{token:res.token}})
            }
          })
        }else{
          this.socialService.socialCallbackFacebook(this.code,Memory.getAgencyId()).subscribe((res:any)=>{
            if(res.isSuccessful){
              this.router.navigateByUrl('/panel/marketing')
  
            }
          })
        }
        
        break;
      }
      case "twitter":{
          if(this.mode){
              this.socialService.socialCallbackTwitterRegister(this.code,this.token).subscribe((res:any)=>{
                  if(res.token){
                      this.router.navigate(['/login'],{queryParams:{token:res.token}})
                  }
              })
          }else{
              this.socialService.socialCallbackTwitter(this.code,this.token,Memory.getAgencyId()).subscribe((res:any)=>{
                  if(res.isSuccessful){
                      this.router.navigateByUrl('/panel/marketing')

                  }
              })
          }

        break;
      }
      case "linkedin":{
        
        this.socialService.socialCallbackLinkedin(this.code,Memory.getAgencyId()).subscribe((res:any)=>{
          if(res.isSuccessful){
            this.router.navigateByUrl('/panel/marketing')

          }
        })
        break;
      }
      case "pinterest":{
        this.socialService.socialCallbackPinterest(this.code,Memory.getAgencyId()).subscribe((res:any)=>{
          if(res.isSuccessful){
            this.router.navigateByUrl('/panel/marketing')

          }
        })
        break;
      }
      case "youtube":{
        this.socialService.socialCallbackYoutube(this.code,Memory.getAgencyId()).subscribe((res:any)=>{
          if(res.isSuccessful){
            this.router.navigateByUrl('/panel/marketing')

          }
        })
        break;
      }
      case "flickr":{
        this.socialService.socialCallbackFlickr(this.code,this.token,Memory.getAgencyId()).subscribe((res:any)=>{
          if(res.isSuccessful){
            this.router.navigateByUrl('/panel/marketing')

          }
        })
        break;
      }
    }
  }

}
