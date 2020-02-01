import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwootService } from '../shared/twoot.service';
import { Twoot } from '../shared/twoot.interface';

@Component({
  selector: 'app-hashtag-explore',
  templateUrl: './hashtag-explore.component.html',
  styleUrls: ['./hashtag-explore.component.scss']
})
export class HashtagExploreComponent implements OnInit {
  twootContent: string = '';
  isLoading = true;
  twootsArray: Twoot[] = [];
  error: string = null;
  page = 0;
  loadMoreTwoots = 0;
  hashtag: string;
  constructor(
    private route: ActivatedRoute,
    private twootService: TwootService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.page = 0;
      this.loadMoreTwoots = 0;
      this.hashtag = params['hashtag'];
      this.getHashtagTwoots(this.hashtag, this.page);
    });
  }

  getHashtagTwoots(hashtag: string, page: number) {
    let twootObs = this.twootService.getHashtagTwoots(hashtag, page);
    twootObs.subscribe(
      (twootsArray: Twoot[]) => {
        twootsArray.forEach(twoot => {
          twoot.createDate = this.twootService.getTimeDifference(
            twoot.createDate
          );
        });
        this.isLoading = false;
        this.twootsArray = twootsArray;
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
      await this.getHashtagTwoots(this.hashtag, this.page);
    } else {
      this.loadMoreTwoots += 1;
    }
  }
}
