import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';
import { TwootService } from '../shared/twoot.service';
import { Twoot } from '../shared/twoot.interface';
import { AuthService } from '../auth/auth.service';
import { FollowService } from '../shared/follow.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  error: string = null;
  twootsArray: Twoot[] = [];
  username: string = null;
  buttonText: string = null;
  profileInfo: string[];
  btnFollow: boolean = true;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private followService: FollowService,
    private router: Router,
    private twootService: TwootService
  ) {}

  ngOnInit() {
    this.getTwoots();
    this.getProfileInformation();
    this.username = this.authService.user.value.getUsername;
    if (this.username === this.router.url.substr(1)) {
      this.buttonText = 'Edit profile';
    } else {
      if (this.isFollowing(this.username, this.router.url.substr(1))) {
        this.buttonText = 'Following';
        this.btnFollow = false;
        console.log('ups');
      } else {
        this.buttonText = 'Follow';
      }
    }
  }

  getButtonClass() {
    if (this.btnFollow) {
      return 'btn-clear btn-clear-big';
    }
    return 'btn-lightblue';
  }

  changeButton() {
    if (!this.btnFollow) {
      if (this.buttonText === 'Unfollow') {
        this.buttonText = 'Following';
      } else {
        this.buttonText = 'Unfollow';
      }
    }
  }

  getTwoots() {
    let twootObs = this.profileService.getUserTwoots(this.router.url.substr(1));
    twootObs.subscribe(
      (twootsArray: Twoot[]) => {
        twootsArray.forEach(twoot => {
          twoot.createdAt = this.twootService.getTimeDifference(
            twoot.createdAt
          );
        });
        this.twootsArray = twootsArray;
      },
      errorMessage => {
        this.error = errorMessage;
      }
    );
  }

  getProfileInformation() {
    let profileObs = this.profileService.getProfileInfo(
      this.router.url.substr(1)
    );
    profileObs.subscribe((profileInfo: string[]) => {
      this.profileInfo = profileInfo;
      console.log(this.profileInfo);
    });
  }

  profileButtonClick() {
    console.log(this.btnFollow);
    if (this.btnFollow) {
      if (this.buttonText === 'Edit profile') {
        this.showEditProfile();
        return;
      }
      this.follow();

      return;
    }
    this.unfollow();
  }

  showEditProfile() {}

  follow() {
    let followObs = this.followService.follow(
      this.username,
      this.router.url.substr(1)
    );
    followObs.subscribe(resData => {
      this.btnFollow = false;
      this.buttonText = 'Following';
    });
  }

  unfollow() {
    console.log('unfollow');
    let unfollowObs = this.followService.unfollow(
      this.username,
      this.router.url.substr(1)
    );
    unfollowObs.subscribe(resData => {
      this.btnFollow = true;
      this.buttonText = 'Follow';
    });
  }

  isFollowing(follower: string, following: string) {
    return this.followService.isFollowing(follower, following);
  }
}
