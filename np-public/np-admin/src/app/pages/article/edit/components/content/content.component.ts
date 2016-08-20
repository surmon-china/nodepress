import { Component } from '@angular/core';
import { CKEditor } from 'ng2-ckeditor';
window['CKEDITOR_BASEPATH'] = '//cdn.bootcss.com/ckeditor/4.5.9/';

@Component({
  selector: 'article-content',
  directives: [CKEditor],
  template: require('./content.html')
})

export class ArticleContent {

  // 文章内容
  public articleContent:string = '<p>在这里输入文章内容</p>';

  // 编辑器配置
  public config = {
    uiColor: '#F0F3F4',
    height: '600'
  };

  constructor() {
  }

  ngOnInit() {
  }
}
