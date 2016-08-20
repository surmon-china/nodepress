import { Component } from '@angular/core';
import { BaCard } from '../../../theme/components/baCard';
import { ArticleCategory } from './components/category';
import { ArticleContent } from './components/content';
import { ArticleDuoshuo } from './components/duoshuo';
import { ArticleSubmit } from './components/submit';
import { ArticleThumb } from './components/thumb';
import { ArticleTag } from './components/tag';


@Component({
  selector: 'edit',
  directives: [BaCard, ArticleCategory, ArticleContent, ArticleDuoshuo, ArticleSubmit, ArticleThumb, ArticleTag],
  template: require('./edit.html')
})

export class ArticleEdit {

  constructor() {
  }

  ngOnInit() {
  }
}
