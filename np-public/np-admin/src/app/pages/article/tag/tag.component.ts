import {Component} from '@angular/core';
import {BaCard} from '../../../theme/components/baCard';

@Component({
  selector: 'tag',
  directives: [BaCard],
  template: require('./tag.html')
})

export class ArticleTag {
  constructor() {
  }
}
