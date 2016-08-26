import { Component, Input } from '@angular/core';
import { CKEditor } from 'ng2-ckeditor';
window['CKEDITOR_BASEPATH'] = '//cdn.bootcss.com/ckeditor/4.5.9/';

@Component({
  selector: 'article-main',
  directives: [CKEditor],
  template: require('./main.html')
})
export class ArticleMain {

  @Input() article;

  // 编辑器配置
  public ckeditorConfig = {
    uiColor: '#F0F3F4',
    height: '600'
  }

  constructor() {
  }

  ngOnInit() {
  }
}
