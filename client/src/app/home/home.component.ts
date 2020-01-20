import { Component, OnInit } from '@angular/core';
import { TwootService } from '../shared/twoot.service';
import { Observable } from 'rxjs';
import { TwootContent } from '../shared/twoot.service';

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

  ngOnInit() {
    this.getProgressWidth();
  }

  async createTwoot() {
    let twootObs: Observable<TwootContent>;
    this.progressWidth = 25;
    this.getProgressWidth();
    twootObs = this.twootService.createTwoot(this.twootContent);
    twootObs.subscribe(
      resData => {
        this.progressWidth = 100;
      },
      errorMessage => {
        this.error = errorMessage;
        this.progressWidth = 0;
      }
    );
    await this.resetTwootForm();
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
}
