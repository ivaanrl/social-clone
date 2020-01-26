import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Twoot } from '../shared/twoot.interface';

@Pipe({
  name: 'twootPipe'
})
export class TwootPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  regExpUsername: RegExp = /(@[^ ]+)/;
  regExpHashtag: RegExp = /(#[^ ]+)/;

  transform(twootContent: string): SafeHtml {
    let modifiedText = '';
    const text = this.sanitizer.sanitize(SecurityContext.HTML, twootContent);
    const splitText = text.split(' ');

    splitText.forEach(word => {
      if (word.match(this.regExpUsername)) {
        modifiedText += ` <a class="user-mention" href="/${word.substr(
          1
        )}" target="blank_" >${word}</a>`;
      } else if (word.match(this.regExpHashtag)) {
        modifiedText += ` <a href="/explore/${word.substr(
          1
        )}" target="blank_" class="hash"> ${word}</a> `;
      } else if (
        !word.match(this.regExpHashtag) &&
        !word.match(this.regExpUsername)
      ) {
        modifiedText += ' ' + word;
      }
    });

    splitText.forEach(word => {});

    console.log(modifiedText);

    return this.sanitizer.bypassSecurityTrustHtml(modifiedText);
  }
}
