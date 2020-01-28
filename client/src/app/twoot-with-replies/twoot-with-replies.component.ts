import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Twoot } from '../shared/twoot.interface';
import { TwootService } from '../shared/twoot.service';

@Component({
  selector: 'app-twoot-with-replies',
  templateUrl: './twoot-with-replies.component.html',
  styleUrls: ['./twoot-with-replies.component.scss']
})
export class TwootWithRepliesComponent implements OnInit {
  twoot_id: string = null;
  page = 0;
  loadMoreTwoots = 0;
  twootsArray: Twoot[] = [];
  error: string = null;
  isLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private twootService: TwootService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.twoot_id = this.router.url.split('/')[2];
      this.twootsArray = [];
      this.page = 0;
      this.loadMoreTwoots = 0;
      this.getTwoots(this.page);
    });
  }

  getTwoots(page: number) {
    let twootObs = this.twootService.getTwootsWithReplies(page, this.twoot_id);
    twootObs.subscribe(
      (twootsArray: Twoot[]) => {
        twootsArray.forEach(twoot => {
          twoot.createdAt = this.twootService.getTimeDifference(
            twoot.createdAt
          );
        });
        this.isLoading = false;
        twootsArray.forEach(twoot => {
          this.twootsArray.push(twoot);
        });
      },
      errorMessage => {
        this.error =
          'Something went wrong retrieving some twoots. Please try again.';
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
