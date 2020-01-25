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
  isLoading = true;
  profileInfo: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    about: string | null;
    createdAt: string;
    profile_img_name: string;
    cover_pic_name: string;
    twoot_count: string;
  };
  btnFollow: boolean = true;
  following: boolean = false;
  toggleModal = '';
  profilePic: ImageData = null;
  coverPic: ImageData = null;

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
      this.toggleModal = 'editProfileModal';
    } else {
      let followCheckObs = this.isFollowing(
        this.username,
        this.router.url.substr(1)
      );
      followCheckObs.subscribe(isFollowing => {
        if (isFollowing) {
          this.buttonText = 'Following';
          this.btnFollow = false;
          this.following = true;
          this.toggleModal = '';
        } else {
          this.buttonText = 'Follow';
          this.following = false;
          this.toggleModal = '';
        }
      });
    }
  }

  getButtonClass() {
    if (this.btnFollow) {
      return 'btn-clear btn-clear-big';
    }
    return 'btn-lightblue';
  }

  changeButton(action: string) {
    if (this.following) {
      if (action === 'entering') {
        this.buttonText = 'Unfollow';
      }
      if (action === 'exiting') {
        this.buttonText = 'Following';
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
        this.isLoading = false;
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
    profileObs.subscribe(
      (profileInfo: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        about: string | null;
        createdAt: string;
        profile_img_name: string;
        cover_pic_name: string;
        twoot_count: string;
      }) => {
        this.profileInfo = profileInfo;
        console.log(this.profileInfo);
      }
    );
  }

  profileButtonClick() {
    console.log(this.btnFollow);
    if (this.btnFollow) {
      if (this.buttonText === 'Edit profile') {
        return;
      }
      this.follow();

      return;
    }
    this.unfollow();
  }

  follow() {
    let followObs = this.followService.follow(
      this.username,
      this.router.url.substr(1)
    );
    followObs.subscribe(resData => {
      this.btnFollow = false;
      this.buttonText = 'Following';
      this.following = true;
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
      this.following = false;
    });
  }

  isFollowing(follower: string, following: string) {
    return this.followService.isFollowing(follower, following);
  }

  selectImage(event) {
    if (event.target.classList[0] === 'input-profile-picture') {
      this.profilePic = event.target.files[0];
    } else {
      this.coverPic = event.target.files[0];
    }
  }

  saveProfileChanges() {
    let profileSub = this.profileService.saveProfileChanges(
      this.profilePic,
      this.coverPic
    );
    profileSub.subscribe(resData => {
      //this.getProfileImg();
    });
  }

  getProfileImg() {
    return `http://localhost:5000/api/profile/getProfilePicture/${this.profileInfo.id}/${this.profileInfo.profile_img_name}`;
  }

  getCoverImg() {
    return `http://localhost:5000/api/profile/getProfilePicture/${this.profileInfo.id}/${this.profileInfo.cover_pic_name}`;
  }
}
