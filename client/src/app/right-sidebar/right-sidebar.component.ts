import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TwootService } from '../shared/twoot.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
  searchContent: string = '';
  mostUsedHashtags;

  constructor(public router: Router, private twootService: TwootService) {}

  ngOnInit() {
    this.getMostUsedHashtags();
  }

  getMostUsedHashtags() {
    let hashObs = this.twootService.getMostUsedHashtags();
    hashObs.subscribe(resData => {
      this.mostUsedHashtags = resData;
    });
  }

  search(event) {
    event.preventDefault();
    if (this.searchContent !== '') {
      this.router.navigate([`/search/${this.searchContent}`]);
    }
  }
}
