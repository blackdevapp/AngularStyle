import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {AgencyModel} from '../shared/models/agency.model';
import {ResponseContentType} from "@angular/http";
import {Memory} from "../base/memory";
import {ServiceBase2} from "./serivce-base2.service";

let BASE_URL = '';

@Injectable()
export class AgenciesService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/';
  }

  getAllAgencies() {
    return this.getService(`agencies/`);
  }

  getAgenciesPagable(page, limit) {
    return this.postService(`agencies/find/${page}/${limit}`, []);
  }

  getMembersByAgencyId(associatedAgency) {
    return this.getService(`agencies/filter?associated_agency=${associatedAgency}`);
  }

  getFilterAgency(query, page, limit) {
    return this.postService(`agencies/find/${page}/${limit}`, query);
  }

  getByReferalCode(code) {
    return this.getService(`agencies/find?agency_id=${code}`);
  }

  getTransactionById(id) {
    return this.getService(`accounting/transaction/_id=${id}`);
  }

  editAgencies(agencies) {
    return this.putService(`agencies/${agencies._id}`, agencies);
  }

  editAmadeusApi(agencies) {
    return this.putService(`agencies/amadeus-api`, agencies);
  }


  insertForm(form) {
    return this.postService(`agencies/form`, form);
  }

  registerAgency(entity) {
    return this.postService(`agencies`, entity);
  }

  getFormInfo(agency_code, formName) {
    return this.getService(`agencies/filter/form?form=${formName}&associated_agency=${agency_code}`);
  }

  getAllForm() {
    return this.getService(`agencies/filter/form/all?associated_agency=${Memory.getAgencyId()}`);
  }

  editAgencyForms(form) {
    return this.putService(`agencies/form`, {form: form, agency_id: Memory.getAgencyId()});
  }
}
