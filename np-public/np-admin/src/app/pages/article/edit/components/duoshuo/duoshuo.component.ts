import { Component } from '@angular/core';
import { BaCheckbox } from '../../../../../theme/components';

@Component({
  selector: 'article-duoshuo',
  directives: [BaCheckbox],
  template: require('./duoshuo.html')
})

export class ArticleDuoshuo {

  public duoshuo = {
    weibo: true,
    qzone: true,
    renren: false,
    douban: true
  };

  constructor() {
  }

  ngOnInit() {
  }
}
