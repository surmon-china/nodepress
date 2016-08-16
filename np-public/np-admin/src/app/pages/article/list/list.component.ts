import {Component} from '@angular/core';
import {BaCard} from '../../../theme/components/baCard';
import {ArticleService} from '../../../theme/services/article';

@Component({
  selector: 'list',
  directives: [BaCard],
  template: require('./list.html')
})

export class ArticleList {

  constructor() {
    this.articles = {};
  }

  public getArticles = params => {
    console.log('hello');
    let service = new ArticleService().getLists({ page: 1 });
    // service.then(articles => {
    //   this.articles = articles;
    //   console.log(this);
    // }).catch(error => {
    //   console.log(error);
    // });
  };

  ngOnInit() {
    console.log('init');
    // 初始化列表
    this.getArticles()
  }

  ngOnDestroy() {
    console.log('销毁');
  }

  ngDoCheck() {
    // Custom change detection
  }

  ngOnChanges(changes) {
    // Called right after our bindings have been checked but only
    // if one of our bindings has changed.
    //
    // changes is an object of the format:
    // {
    //   'prop': PropertyUpdate
    // }
  }

  ngAfterContentInit() {
    // Component content has been initialized
  }

  ngAfterContentChecked() {
    // Component content has been Checked
  }

  ngAfterViewInit() {
    // Component views are initialized
  }

  ngAfterViewChecked() {
    // Component views have been checked
  }
}
