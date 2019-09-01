export class Memory {
  public static userId: string;
  public static agencyId: string;
  public static url: string = '/api';
  public static company_name: string;
  public static members: Array<any> = [];
  public static loading: boolean = false;


  public static setOnBoard(user: any) {
    localStorage.setItem('nj.onBoard', JSON.stringify(user));

  }

  public static getOnBoard() {
    let user1 = localStorage.getItem('nj.onBoard');
    return JSON.parse(user1);
  }

  public static clearOnBoard() {
    localStorage.removeItem('nj.onBoard');
  }

  public static setPermission(perm: any) {
    localStorage.setItem('nj.perm', JSON.stringify(perm));

  }

  public static getPermission() {
    let perm = localStorage.getItem('nj.perm');
    return JSON.parse(perm);
  }

  public static clearPermission() {
    localStorage.removeItem('nj.perm');
  }


  public static getAgencyId() {
    let agencyId = localStorage.getItem('nj.associated_agency');
    return agencyId;
  }

  public static setAgencyId(agencyId: string) {
    localStorage.setItem('nj.associated_agency', agencyId);
  }


  public static getCurrency() {
    let agencyId = localStorage.getItem('nj.currency');
    return JSON.parse(agencyId);
  }

  public static setCurrency(currency: string) {
    localStorage.setItem('nj.currency', currency);
  }


  public static getActiveCurrency() {
    let currency = localStorage.getItem('nj.active_currency');
    return currency;
  }

  public static getToken() {
    let token = localStorage.getItem('nj.token');
    return token;
  }
  public static setToken(token:string) {
    localStorage.setItem('nj.token',token);
  }
  public static setActiveCurrency(currency: string) {
    localStorage.setItem('nj.active_currency', currency);
  }

  public static getUserId() {
    return this.userId;
  }

  public static getUrl() {
    return this.url;
  }

  public static getUserIdStorage() {
    let id = localStorage.getItem('nj.user_id');
    return id;
  }

  public static setUserId(userId: string) {
    this.userId = userId;
  }

  public static getAgencyReferralId() {
    return this.agencyId;
  }

  public static setAgencyReferralId(id: string) {
    this.agencyId = id;
  }

  public static getCompanyName() {
    return localStorage.getItem('nj.company_name');
  }

  public static setCompanyName(id: string) {
    localStorage.setItem('nj.company_name', id);
  }

  public static clearCompanyName() {
    localStorage.removeItem('nj.company_name');
    localStorage.removeItem('nj.company_List');

  }
  public static getCompanyList() {
    return localStorage.getItem('nj.company_List');
  }

  public static setCompanyList(data) {
    localStorage.setItem('nj.company_List', JSON.stringify(data));
  }
  public static itinersryHelper() {
    return JSON.parse(localStorage.getItem('nj.itineraryHelper'));
  }

  public static setItinersryHelper(data) {
    localStorage.setItem('nj.itineraryHelper', JSON.stringify(data));
  }

  public static getMembers() {
    return this.members;
  }

  public static setMembers(members) {
    this.members = members
  }


  public static getLoading() {
    return this.loading;
  }

  public static setLoading(loading) {
    this.loading = loading;
  }


}
