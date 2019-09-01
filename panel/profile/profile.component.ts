import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user:User=new User();
  preloading: boolean = true;
  constructor(private userService:UserService) { }

  ngOnInit() {
    let self2 =this;
    setTimeout(function () {
      self2.preloading=false
    },2000)
    this.user._id=localStorage.getItem('nj.user_id');
    this.userService.getUser(this.user).subscribe((res:User)=>{
      console.log(res);
    })
  }

}
