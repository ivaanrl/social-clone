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

  constructor(
    private route: ActivatedRoute,
    private twootService: TwootService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let hashtag = params['hashtag'];
      this.getHashtagTwoots(hashtag);
    });
  }

  getHashtagTwoots(hashtag) {
    let twootObs = this.twootService.getHashtagTwoots(hashtag);
    twootObs.subscribe(
      (twootsArray: Twoot[]) => {
        twootsArray.forEach(twoot => {
          twoot.createdAt = this.twootService.getTimeDifference(
            twoot.createdAt
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
}
