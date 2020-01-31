import { Component, OnInit, NgZone, Input } from '@angular/core';
import { ProfileService } from './profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TwootService } from '../shared/twoot.service';
import { Twoot } from '../shared/twoot.interface';
import { AuthService } from '../auth/auth.service';
import { FollowService } from '../shared/follow.service';
import {
  FileUploaderOptions,
  ParsedResponseHeaders,
  FileUploader
} from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';

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
    followers: number;
    following: number;
  };
  btnFollow: boolean = true;
  following: boolean = false;
  toggleModal = '';
  profilePic: ImageData = null;
  coverPic: ImageData = null;
  page = 0;
  loadMoreTwoots = 0;
  buttonEnabled = true;

  response = {
    uploadCoverPic: '',
    uploadProfilePic: ''
  };
  uploader: FileUploader;
  currentInput: string;
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private followService: FollowService,
    public router: Router,
    private twootService: TwootService,
    private route: ActivatedRoute,
    private cloudinary: Cloudinary
  ) {}

  ngOnInit() {
    this.route.params.subscribe(param => {
      const uploaderOptions: FileUploaderOptions = {
        url: `https://api.cloudinary.com/v1_1/${
          this.cloudinary.config().cloud_name
        }/upload`,
        // Upload files automatically upon addition to upload queue
        autoUpload: true,
        // Use xhrTransport in favor of iframeTransport
        isHTML5: true,
        // Calculate progress independently for each uploaded file
        removeAfterUpload: true,
        // XHR request headers
        headers: [
          {
            name: 'X-Requested-With',
            value: 'XMLHttpRequest'
          }
        ]
      };

      this.uploader = new FileUploader(uploaderOptions);

      this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
        this.buttonEnabled = true;
        form.append('upload_preset', this.cloudinary.config().upload_preset);
        form.append('folder', this.profileInfo.id);
        form.append('file', fileItem);

        fileItem.withCredentials = false;
        return { fileItem, form };
      };

      this.uploader.onCompleteItem = (
        item: any,
        response,
        status: number,
        headers: ParsedResponseHeaders
      ) => {
        if (this.currentInput === 'uploadCoverPic') {
          this.response.uploadCoverPic = JSON.parse(response).secure_url;
        } else {
          this.response.uploadProfilePic = JSON.parse(response).secure_url;
        }
        this.buttonEnabled = false;
      };

      this.twootsArray = [];
      this.page = 0;
      this.loadMoreTwoots = 0;
      this.getTwoots(this.page);
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
    });
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

  selectInputId(event) {
    this.currentInput = event.target.id;
    console.log(this.currentInput);
  }

  getTwoots(page: number) {
    let twootObs = this.profileService.getUserTwoots(
      this.router.url.substr(1),
      page
    );
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
        followers: number;
        following: number;
      }) => {
        if (!profileInfo) {
          console.log('a');
          this.error = "This user doesn't exists";
        } else {
          this.profileInfo = profileInfo;
        }
        console.log(this.error);
      },
      errorMessage => {
        this.error = 'Something went wrong. Please try again.';
      }
    );
  }

  profileButtonClick() {
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

  async saveProfileChanges() {
    let profileSub = await this.profileService.saveProfileChanges(
      this.response
    );
    profileSub.subscribe(resData => {
      //this.getProfileImg();
    });
  }

  getProfileImg() {
    if (this.profileInfo) {
      return `${this.profileInfo.profile_img_name}`;
    }
  }

  getCoverImg() {
    if (this.profileInfo) {
      return `${this.profileInfo.cover_pic_name}`;
    }
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
