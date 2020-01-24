import { Component, OnInit, Input } from '@angular/core';
import { TwootService } from '../shared/twoot.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-twoot',
  templateUrl: './twoot.component.html',
  styleUrls: ['./twoot.component.scss']
})
export class TwootComponent implements OnInit {
  @Input() twootContent: {
    twoot_id: string;
    first_name: string;
    last_name: string;
    username: string;
    img_name: string;
    user_id: string;
    createdAt: string;
    content: string;
  };
  userFav = false;
  img = null;

  constructor(
    private twootService: TwootService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    let getFavSub = this.twootService.getFav(
      this.twootContent.twoot_id,
      this.authService.user.value.getUsername
    );
    getFavSub.subscribe(isFaved => {
      if (isFaved) {
        this.userFav = true;
      } else {
        this.userFav = false;
      }
    });
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
    console.log(
      `/api/twoots/getTwootImage/${this.twootContent.user_id}/${this.twootContent.img_name}`
    );
    return `http://localhost:5000/api/twoots/getTwootImage/${this.twootContent.user_id}/${this.twootContent.img_name}`;
  }
}
