import { Component, Input } from '@angular/core';
import { BaCheckbox } from '../../../../../theme/components';

@Component({
  selector: 'article-duoshuo',
  directives: [BaCheckbox],
  template: require('./duoshuo.html')
})

export class ArticleDuoshuo {
  @Input() duoshuo;

  constructor() {
  }

  ngOnInit() {
  }
}
