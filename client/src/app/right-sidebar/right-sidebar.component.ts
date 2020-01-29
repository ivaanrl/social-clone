import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
  searchContent: string = '';

  constructor(private router: Router) {}

  ngOnInit() {}

  search(event) {
    event.preventDefault();
    if (this.searchContent !== '') {
      this.router.navigate([`/search/${this.searchContent}`]);
    }
  }
}
