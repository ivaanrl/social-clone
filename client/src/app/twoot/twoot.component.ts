import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-twoot',
  templateUrl: './twoot.component.html',
  styleUrls: ['./twoot.component.scss']
})
export class TwootComponent implements OnInit {
  @Input() twootContent: {
    first_name: string;
    last_name: string;
    username: string;
    createdAt: string;
    content: string;
  };
  constructor() {}

  ngOnInit() {}
}
