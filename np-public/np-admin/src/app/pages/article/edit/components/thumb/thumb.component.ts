import { Component, Input } from '@angular/core';
import { BaPictureUploader } from '../../../../../theme/components';

@Component({
  selector: 'article-thumb',
  directives: [BaPictureUploader],
  template: require('./thumb.html')
})

export class ArticleThumb {

  @Input() articleThumb;
  
  public defaultThumb = 'assets/img/theme/no-photo.png';
  public uploaderOptions:any = {
    // url: 'http://website.com/upload'
  };

  constructor() {
  }

  ngOnInit() {
  }
}
