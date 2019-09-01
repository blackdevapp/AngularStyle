import { Component, OnInit } from '@angular/core';
import {ServerService} from '../../services/server.service';
@Component({
  selector: 'app-server-logs',
  templateUrl: './server-logs.component.html',
  styleUrls: ['./server-logs.component.scss']
})
export class ServerLogsComponent implements OnInit {
	serverLogs = []
  constructor(
  		private serverService: ServerService
  	) { }

  ngOnInit() {
  	this.getLogs('nj-dev');
  }
  getLogs(logType) {
  	this.serverService.getLogs(logType).subscribe((res: any) => {
        this.serverLogs = res.logs;
    })
  }

}
