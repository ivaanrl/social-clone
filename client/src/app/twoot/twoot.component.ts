import { Component, OnInit, Input, HostListener } from '@angular/core';
import { TwootService } from '../shared/twoot.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-twoot',
  templateUrl: './twoot.component.html',
  styleUrls: ['./twoot.component.scss']
})
export class TwootComponent implements OnInit {
  @Input()
  twootContent: {
    twoot_id: string;
    first_name: string;
    last_name: string;
    username: string;
    img_name: string;
    user_id: string;
    createdAt: string;
    content: string;
    profile_img_name: string;
  };
  userFav = false;
  img = null;
  isLoading = true;
  error: string = null;

  constructor(
    private twootService: TwootService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    let getFavSub = this.twootService.getFav(
      this.twootContent.twoot_id,
      this.authService.user.value.getUsername
    );
    getFavSub.subscribe(
      isFaved => {
        this.isLoading = false;
        if (isFaved) {
          this.userFav = true;
        } else {
          this.userFav = false;
        }
      },
      errorMessage => {
        this.error = "Couldn't load twoot properly.";
      }
    );
  }

  getRoute(event) {
    if (event.target.tagName === 'A') {
      this.router.navigate([event.target.getAttribute('href')]);
      event.preventDefault();
    } else {
      return;
    }
  }

  sendFav() {
    let favSub = this.twootService.favClick(
      this.twootContent.twoot_id,
      this.authService.user.value.getUsername
    );
    favSub.subscribe(resData => {
      this.userFav = !this.userFav;
    });
  }

  getImg() {
    return `http://localhost:5000/api/twoots/getTwootImage/${this.twootContent.user_id}/${this.twootContent.img_name}`;
  }

  getProfileImg() {
    return `http://localhost:5000/api/profile/getProfilePicture/${this.twootContent.user_id}/${this.twootContent.profile_img_name}`;
  }

  navigateToTwoot() {
    this.router.navigate([`/twoot/${this.twootContent.twoot_id}`]);
  }
}
