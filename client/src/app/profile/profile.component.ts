import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';
import { TwootService } from '../shared/twoot.service';
import { Twoot } from '../shared/twoot.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  error: string = null;
  twootsArray: Twoot[] = [];

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private twootService: TwootService
  ) {}

  ngOnInit() {
    this.getTwoots();
  }

  getTwoots() {
    let twootObs: any; //DEFINE TYPES FOR ALL OF THIS
    twootObs = this.profileService.getUserTwoots(this.router.url.substr(1));
    twootObs.subscribe(
      (twootsArray: Twoot[]) => {
        twootsArray.forEach(twoot => {
          twoot.createdAt = this.twootService.getTimeDifference(
            twoot.createdAt
          );
        });
        this.twootsArray = twootsArray;
        console.log(this.twootsArray);
      },
      errorMessage => {
        this.error = errorMessage;
      }
    );
  }
}
