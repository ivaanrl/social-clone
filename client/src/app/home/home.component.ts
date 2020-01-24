import { Component, OnInit } from '@angular/core';
import { TwootService } from '../shared/twoot.service';
import { Twoot } from '../shared/twoot.interface';
import { stringify } from 'querystring';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  twootContent: string = '';
  progressWidth: number = 0;
  constructor(private twootService: TwootService) {}
  error: string = null;
  twootsArray: Twoot[] = [];
  image: ImageData;

  ngOnInit() {
    this.getProgressWidth();
    this.getTwoots();
  }

  async createTwoot() {
    let twootObs: any;
    this.progressWidth = 25;
    this.getProgressWidth();
    twootObs = this.twootService.createTwoot(this.twootContent, this.image);
    twootObs.subscribe(
      async resData => {
        await this.getTwoots();
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

  getProgressWidth() {
    return `${this.progressWidth}%`;
  }

  async resetTwootForm() {
    this.twootContent = '';
    setTimeout(() => {
      this.progressWidth = 0;
      this.getProgressWidth();
    }, 900);
  }

  async getTwoots() {
    let twootObs: any; //DEFINE TYPES FOR ALL OF THIS

    twootObs = this.twootService.getTwoots();
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

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
  }
}
