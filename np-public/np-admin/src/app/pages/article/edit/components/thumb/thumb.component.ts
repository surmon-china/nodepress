import { Component } from '@angular/core';
import { BaPictureUploader } from '../../../../../theme/components';

@Component({
  selector: 'article-thumb',
  directives: [BaPictureUploader],
  template: require('./thumb.html')
})

export class ArticleThumb {

  public defaultThumb = 'assets/img/theme/no-photo.png';
  public articleThumb = 'assets/img/app/profile/Nasta.png';

  public uploaderOptions:any = {
    // url: 'http://website.com/upload'
  };

  constructor() {
  }

  ngOnInit() {
  }
}
