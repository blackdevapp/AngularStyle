import { Injectable } from '@angular/core';
import {HttpClientModule, HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Memory} from "../base/memory";
import {ServiceBase2} from "./serivce-base2.service";

@Injectable()
export class SocialService extends ServiceBase2{
  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/';
  }

  // add by masoud
  getSocialMedia(){
   
    
    return this.getService(`/auth/facebook?agency_id=${Memory.getAgencyId()}`)
    // return this.getService(`/auth/facebook?agency_id=j9AsGI11`)
  }
  setFacebookAccount(fb){

    // return this.getService(`/auth/facebook/callback?agency_id=${agency_id}`);
    console.log('agency id '+Memory.getAgencyId())
    return this.postService(`/auth/facebook?agency_id=${Memory.getAgencyId()}`,fb);
  }
  editFacebookPages(pages){

    // return this.getService(`/auth/facebook/callback?agency_id=${agency_id}`);
    console.log('agency id '+Memory.getAgencyId())
    return this.putService(`/auth/facebook/pages?agency_id=${Memory.getAgencyId()}`,pages);
  }
  logoutFacebookAccount(){
 
    // return this.getService(`/auth/facebook/callback?agency_id=${agency_id}`);
    console.log('agency id '+Memory.getAgencyId())
    return this.deleteService(`/auth/facebook?agency_id=${Memory.getAgencyId()}`);
  }
  logoutTwitterAccount(){
 
    // return this.getService(`/auth/facebook/callback?agency_id=${agency_id}`);
    console.log('agency id '+Memory.getAgencyId())
    return this.deleteService(`/auth/twitter?agency_id=${Memory.getAgencyId()}`);
  }
  logoutTelegramAccount(){
    return this.deleteService(`auth/telegram?agency_id=${Memory.getAgencyId()}`);
  }
  // add by masoud

  callAccessPage(){
    // alert('callll')
    return this.getService('/auth/facebook/register');
  }

  getTwitterAccess(){
    
    // return this.getService(`/auth/twitter?agency_id=${Memory.getAgencyId()}`)
  }
  
  setTelegramAccount(account){
    return this.getService(`/auth/telegram?agency_id=${Memory.getAgencyId()}&&account=${account}`);
  }

  autoSuggestionChannels(query: String){
  
    return this.getService(`social/telegram/channels/${query}`);
  }
  checkStatus(query: String) {
    return this.getService(`social/telegram/status/${query}`);
  }
  postTelegram(body) {
    return this.postService(`social/telegram/`,body);
    // return this.postService(`agencies/form`,JSON.stringify(form),{headers:headers});
  }

  postFacebook(body){
    return this.postService(`social/facebook/`,body);
  }
  postLinkedin(body){
    return this.postService(`social/linkedin/`,body);
  }
  postPinterest(body){
    return this.postService(`social/pinterest/`,body);
  }
  postYoutube(body){
    return this.postService(`social/youtube/`,body);
  }
  postTwitter(body){
    return this.postService(`social/twitter/`,body);
  }

  socialCallback(type,code){
    return this.getService(`auth/${type}/callback?agency_id=${code}`);

  }
  socialCallbackFacebook(code,agencyId){
    return this.getServiceF(`auth/facebook/callback?agency_id=${agencyId}&code=${code}`);
  }
  socialCallbackFacebookRegister(code){
    return this.getServiceF(`auth/facebook/callback/register?code=${code}`);
  }socialCallbackTwitterRegister(code,token){
    return this.getServiceF(`auth/twitter/callback/register?oauth_verifier=${code}&oauth_token=${token}`);
  }
  socialCallbackTwitter(code,token,agencyId){
    return this.getServiceF(`auth/twitter/callback?agency_id=${agencyId}&oauth_verifier=${code}&oauth_token=${token}`);
  }
  socialCallbackLinkedin(code,agencyId){
    return this.getServiceF(`auth/linkedin/callback?agency_id=${agencyId}&code=${code}`);
  }
  socialCallbackPinterest(code,agencyId){
    return this.getServiceF(`auth/pinterest/callback?agency_id=${agencyId}&code=${code}`);
  }
  socialCallbackYoutube(code,agencyId){
    return this.getServiceF(`auth/youtube/callback?agency_id=${agencyId}&code=${code}`);
  }
  socialCallbackFlickr(code,token,agencyId){
    return this.getServiceF(`auth/flickr/callback?agency_id=${agencyId}&oauth_verifier=${code}&oauth_token=${token}`);
  }


  getFacebooksPage(token){
    let headers = new HttpHeaders();
    headers = headers
      .set('facebookToken',token);
    return this._HttpClient.get(`${Memory.getUrl()}${this._objectName}social/facebook/pages`,{headers:headers});
  }
  // getFbPosts(){
  //   return this.getService(`social/facebook/posts/associated_agency=${Memory.getAgencyId()}`);
  // }
  getFbPosts(){
    let params = new HttpParams().set('agency_id', Memory.getAgencyId());
    return this._HttpClient.get(`${Memory.getUrl()}${this._objectName}social/facebook/posts`, { params: params });
  }
  getTTPosts(){
    return this.getService(`social/twitter/posts/associated_agency=${Memory.getAgencyId()}`);
  }
  getTelegramPosts(){
    return this.getService(`social/telegram/posts/associated_agency=${Memory.getAgencyId()}`);
  }
  getLinkedinPosts(){
    return this.getService(`social/linkedin/posts/associated_agency=${Memory.getAgencyId()}`);
  }
  autoSuggestTag(tag){
    return this.getService(`social/tag-generator?tag=${tag}`);
  }
}
