import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Twoot } from '../shared/twoot.interface';

@Pipe({
  name: 'twootPipe'
})
export class TwootPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(twootContent: string, username: string): SafeHtml {
    let text = this.sanitizer.sanitize(SecurityContext.HTML, twootContent);
    let user = this.sanitizer.sanitize(SecurityContext.HTML, username);
    text = text
      .replace(
        /(@[^ ]+)/g,
        `<a class="user" href="${user}" target="blank_" >@${user}</a>`
      )
      .replace(/(#[^ ]+)/g, `<a class="hash" href="$1" target="blank_" >$1</a>`)
      .replace(/\n/gm, '<br />');
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }
}
