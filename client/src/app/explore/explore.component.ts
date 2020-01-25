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

  constructor(private twootService: TwootService) {}

  async ngOnInit() {
    await this.getTwoots();
  }

  async getTwoots() {
    let twootObs = this.twootService.getExploreTwoots();
    twootObs.subscribe(
      (twootsArray: Twoot[]) => {
        twootsArray.forEach(twoot => {
          twoot.createdAt = this.twootService.getTimeDifference(
            twoot.createdAt
          );
        });
        this.isLoading = false;
        this.twootsArray = twootsArray;
        console.log(this.twootsArray);
      },
      errorMessage => {
        this.error = errorMessage;
      }
    );
  }
}
