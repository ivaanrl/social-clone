import { Component, OnInit } from '@angular/core';
import { TwootService } from '../shared/twoot.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Twoot } from '../shared/twoot.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  error: string = null;
  page = 0;
  loadMoreTwoots = 0;
  twootsArray: Twoot[] = [];
  isLoading = true;
  searchContent: string = null;

  constructor(
    private twootService: TwootService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.twootsArray = [];
      this.searchContent = this.router.url.split('/')[2];
      this.page = 0;
      this.loadMoreTwoots = 0;
      this.getTwoots(this.page);
    });
  }

  async getTwoots(page: number) {
    let twootObs = this.twootService.getSearchTwoots(this.searchContent, page);
    twootObs.subscribe(
      (twootsArray: Twoot[]) => {
        twootsArray.forEach(twoot => {
          twoot.createDate = this.twootService.getTimeDifference(
            twoot.createDate
          );
        });
        this.isLoading = false;
        twootsArray.forEach(twoot => {
          this.twootsArray.push(twoot);
        });
      },
      errorMessage => {
        this.error = 'Something went wrong.';
      }
    );
  }

  search(event) {
    event.preventDefault();
    if (this.searchContent !== '') {
      this.router.navigate([`/search/${this.searchContent}`]);
    }
  }

  async onScroll() {
    if (this.loadMoreTwoots > 10) {
      this.page += 1;
      this.loadMoreTwoots = 0;
      await this.getTwoots(this.page);
    } else {
      this.loadMoreTwoots += 1;
    }
  }
}
