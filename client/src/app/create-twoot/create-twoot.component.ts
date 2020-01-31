import { Component, OnInit, Input } from '@angular/core';
import { TwootService } from '../shared/twoot.service';
import { AuthService } from '../auth/auth.service';
import {
  FileUploaderOptions,
  ParsedResponseHeaders,
  FileUploader
} from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';

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
  buttonDisabled = true;

  response: string;
  uploader: FileUploader;

  constructor(
    private twootService: TwootService,
    public authService: AuthService,
    private cloudinary: Cloudinary
  ) {}

  ngOnInit() {
    this.getProgressWidth();
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
      this.buttonDisabled = true;
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      form.append('folder', 'twoots');
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
      this.response = JSON.parse(response).secure_url;

      console.log(this.response);
      this.buttonDisabled = false;
    };
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
      this.response,
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
    let twootObs = this.twootService.createTwoot(
      this.twootContent,
      this.response
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

  async resetTwootForm() {
    this.twootContent = '';
    setTimeout(() => {
      this.progressWidth = 0;
      this.getProgressWidth();
    }, 900);
  }

  getProfileImage() {
    return `${this.authService.user.value.getProfilePicName}`;
  }
}
