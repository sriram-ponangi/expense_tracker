import { Component, OnInit, Input  } from '@angular/core';

@Component({
  selector: 'app-cost-summary',
  templateUrl: './cost-summary.component.html',
  styleUrls: ['./cost-summary.component.css']
})
export class CostSummaryComponent implements OnInit {

  @Input() expenseSummaryInput = {
    total :  0,
    groceries: 0,
    home:  0,
    uncommon: 0,
    futile: 0
  };
  
  constructor() { }

  ngOnInit(): void {
  }

}
