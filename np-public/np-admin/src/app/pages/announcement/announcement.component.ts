import {Component} from '@angular/core';
import {BaCard} from '../../theme/components/baCard';

@Component({
  selector: 'announcement',
  directives: [BaCard],
  template: require('./announcement.html')
})

export class Announcement {
  constructor() {
  }
}
