import {Component} from '@angular/core';
import {BaCard} from '../../theme/components/baCard';

@Component({
  selector: 'file',
  directives: [BaCard],
  template: require('./file.html')
})

export class File {
  constructor() {
  }
}
