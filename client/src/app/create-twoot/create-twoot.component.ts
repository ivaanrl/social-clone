import { Component, OnInit, Input } from '@angular/core';
import { TwootService } from '../shared/twoot.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-create-twoot',
  templateUrl: './create-twoot.component.html',
  styleUrls: ['./create-twoot.component.scss']
})
export class CreateTwootComponent implements OnInit {
  @Input() placeHolder: string;
  @Input() twoot_id: string;
  progressWidth: number = 0;
  twootContent: string = '';
  error: string = null;
  image: ImageData = null;

  constructor(
    private twootService: TwootService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getProgressWidth();
  }

  getProgressWidth() {
    return `${this.progressWidth}%`;
  }

  async createTwoot() {
    if (this.placeHolder === 'Reply...') {
      await this.replyTwoot();
    } else {
      await this.submitTwoot();
    }
  }

  async replyTwoot() {
    this.progressWidth = 25;
    this.getProgressWidth();
    let twootObs = this.twootService.replyTwoot(
      this.twootContent,
      this.image,
      this.twoot_id
    );
    twootObs.subscribe(
      async resData => {
        this.progressWidth = 100;
      },
      errorMessage => {
        this.error = errorMessage;
        this.progressWidth = 0;
      }
    );
    await this.resetTwootForm();
    this.image = null;
  }

  async submitTwoot() {
    this.progressWidth = 25;
    this.getProgressWidth();
    let twootObs = this.twootService.createTwoot(this.twootContent, this.image);
    twootObs.subscribe(
      async resData => {
        this.progressWidth = 100;
      },
      errorMessage => {
        this.error = errorMessage;
        this.progressWidth = 0;
      }
    );
    await this.resetTwootForm();
    this.image = null;
  }

  async resetTwootForm() {
    this.twootContent = '';
    setTimeout(() => {
      this.progressWidth = 0;
      this.getProgressWidth();
    }, 900);
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
  }

  getProfileImage() {
    return `http://localhost:5000/api/profile/getProfilePicture/${this.authService.user.value.getid}/${this.authService.user.value.getProfilePicName}`;
  }
}
