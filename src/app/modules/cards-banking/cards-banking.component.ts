import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-banking',
  templateUrl: './cards-banking.component.html',
  styleUrls: ['./cards-banking.component.scss']
})
export class CardsBankingComponent implements OnInit {
  public show_loader = false;
  constructor() { }
  
  ngOnInit(): void {
    this.show_loader = true;
   setTimeout(() => {
     this.show_loader = false;
   }, 300);
  }

}
