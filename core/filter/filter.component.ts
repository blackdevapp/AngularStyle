import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
    @Input() typeOfFilter = [];
    @Input() data: any;
    @Input() mode: boolean=false;
    @Output() updated: EventEmitter<any> = new EventEmitter();
    @Output() submit: EventEmitter<any> = new EventEmitter();

    query = '';
    filters = [];
    displaySearch = false;

    constructor() {
    }

    ngOnInit() {
        if(!this.mode){
            this.filters.push({
                data: this.typeOfFilter,
                value: '',
                type: this.typeOfFilter[0].type,
                selected: this.typeOfFilter[0].name,
                displayName: this.typeOfFilter[0].displayName,
                currentData: this.typeOfFilter[0].type == 'dropdown' ? this.typeOfFilter[0].data : []
            })
        }
    }

    buildQuery(event) {
        this.query = Object.keys(this.filters).map(k => `${this.filters[k].selected}=${this.filters[k].value}`).join('&');
    }

    organizeAndAdd() {
        if (this.filters.length != this.typeOfFilter.length) {
            this.filters.push({
                data: this.typeOfFilter,
                value: '',
                type: this.typeOfFilter[0].type,
                selected: this.typeOfFilter[0].name,
                displayName: this.typeOfFilter[0].displayName,
                currentData: this.typeOfFilter[0].type == 'dropdown' ? this.typeOfFilter[0].data : []
            })
        }
        // this.buildQuery();
    }

    search() {
        let searchQuery = [];
        Object.keys(this.filters).map(k => {
            if (this.filters[k].type == 'string') {
                searchQuery.push({type: 'string', name: this.filters[k].selected, value: this.filters[k].value})
            } else if (this.filters[k].type == 'array') {
                searchQuery.push({type: 'array', name: this.filters[k].selected, value: [this.filters[k].value]})
            } else if (this.filters[k].type == 'dropdown') {
                searchQuery.push({type: 'dropdown', name: this.filters[k].selected, value: this.filters[k].value})
            } else if (this.filters[k].type == 'dateRange') {
                searchQuery.push({
                    type: 'dateRange',
                    name: this.filters[k].selected,
                    value: `${moment(this.filters[k].valueFrom).format('DD MM YYYY')}-${moment(this.filters[k].valueTo).format('DD MM YYYY')}`
                })
            }
        });
        this.updated.emit({query: searchQuery})
    }
    submit1(){
        this.submit.emit(this.data);
    }

}
