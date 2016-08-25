import { Component } from '@angular/core';
import { CKEditor } from 'ng2-ckeditor';
window['CKEDITOR_BASEPATH'] = '//cdn.bootcss.com/ckeditor/4.5.9/';

@Component({
  selector: 'article-main',
  directives: [CKEditor],
  template: require('./main.html')
})

export class ArticleMain {

  // Init
  public article = {
    title: '',
    content: '<p>在这里输入文章内容</p>'
    // extend: [{}]
  }

  // 编辑器配置
  public config = {
    uiColor: '#F0F3F4',
    height: '600'
  }

  constructor() {
  }

  ngOnInit() {
  }
}
