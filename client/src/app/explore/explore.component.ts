import { Component, OnInit } from '@angular/core';
import { TwootService } from '../shared/twoot.service';
import { Twoot } from '../shared/twoot.interface';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  twootContent: string = '';
  isLoading = true;
  twootsArray: Twoot[] = [];
  error: string = null;
  page = 0;
  loadMoreTwoots = 0;

  constructor(private twootService: TwootService) {}

  async ngOnInit() {
    this.page = 0;
    await this.getTwoots(this.page);
  }

  async getTwoots(page: number) {
    let twootObs = this.twootService.getExploreTwoots(page);
    twootObs.subscribe(
      (twootsArray: Twoot[]) => {
        twootsArray.forEach(twoot => {
          twoot.createDate = this.twootService.getTimeDifference(
            twoot.createDate
          );
        });
        this.isLoading = false;
        twootsArray.forEach(twoot => {
          console.log(twoot);
          this.twootsArray.push(twoot);
        });
      },
      errorMessage => {
        this.error = errorMessage;
      }
    );
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
