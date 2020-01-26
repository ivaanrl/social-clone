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

  constructor(
    private twootService: TwootService,
    private authService: AuthService
  ) {}

  twootsArray: Twoot[] = [];

  isLoading = true;

  ngOnInit() {
    this.getTwoots();
    this.twootService.NewTwootsEmitter.subscribe(async () => {
      await this.getTwoots();
    });
  }

  async getTwoots() {
    let twootObs = this.twootService.getTwoots();
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

  formatTwoots() {}
}
