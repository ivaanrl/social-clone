import { Component, OnInit } from '@angular/core';
import { TwootService } from '../shared/twoot.service';
import { Twoot } from '../shared/twoot.interface';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  error: string = null;
  page = 0;
  loadMoreTwoots = 0;
  twootsArray: Twoot[] = [];
  isLoading = true;

  constructor(
    private twootService: TwootService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.page = 0;
    this.loadMoreTwoots = 0;
    this.getTwoots(this.page);
    this.twootService.NewTwootsEmitter.subscribe(async () => {
      await this.getTwoots(this.page);
    });

    this.twootService.NewTwootEmitter.subscribe((twoot: Twoot) => {
      twoot.createDate = this.twootService.getTimeDifference(twoot.createDate);
      this.twootsArray.unshift(twoot);
    });
  }

  async getTwoots(page: number) {
    let twootObs = this.twootService.getTwoots(page);
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
