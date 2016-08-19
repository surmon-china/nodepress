import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/catch';

@Injectable()
export class ArticleService {

  private _apiUrl:string = 'http://localhost:8000/api/article';

  constructor(private _http: Http) {}

  getLists(params) {

    // Observable 解决方案
    return this._http.get(this._apiUrl).map(responce => responce.json());

    /*
    // Promise 解决方案
    let testArticle = {
      "_id": "579f4cf968c4a1b04af57d74",
      "id": 1,
      "title": "一群各怀鬼胎的人心照不宣的骗局",
      "content": "文章1内容",
      "description": "国内创业潮从前年到今年年中，近乎到了疯狂的程度。从政府政策上的刺激，到整个金融界的参与，助推着是不是创业者的人都以自称创业者为傲。背后的原因自然是政府无奈的经济结构调整。中国正面临着近20年来最大的经济危机威胁，传统行业的产能过剩，制造业的成本的上升，都对中国整体依赖的经济体系产生了极大极大的影响。于是，科技业的发展是政府急切期待的。",
      "slug": "article1",
      "password": "123456",
      "__v": 0,
      "meta": {
        "comments": 0,
        "favs": 0,
        "views": 0
      },
      "sidebar": "2",
      "category": [
        {
          "_id": "579610183b6d2f7c19ed3e46",
          "id": 10,
          "name": "分类1",
          "slug": "cate2",
          "__v": 0,
          "extend": [],
          "created_at": "2016-07-25T13:11:52.091Z",
          "pid": null
        },
        {
          "_id": "57961c4a0975a2dc0de4b626",
          "id": 13,
          "name": "分类2",
          "slug": "cate2",
          "__v": 0,
          "extend": [],
          "created_at": "2016-07-25T14:03:54.158Z",
          "pid": "579610183b6d2f7c19ed3e46"
        },
        {
          "_id": "57961c500975a2dc0de4b627",
          "id": 14,
          "name": "分类3",
          "slug": "cate3",
          "__v": 0,
          "extend": [],
          "created_at": "2016-07-25T14:04:00.113Z",
          "pid": "579610183b6d2f7c19ed3e46"
        }
      ],
      "tag": [
        {
          "_id": "579f48972d037640432046f7",
          "id": 1,
          "name": "标签1",
          "slug": "tag1",
          "description": "标签描述",
          "count": 10,
          "__v": 0,
          "extend": []
        },
        {
          "_id": "579f48bb2d037640432046f8",
          "id": 2,
          "name": "标签2",
          "slug": "tag2",
          "description": "标签2描述",
          "count": 1,
          "__v": 0,
          "extend": []
        }
      ],
      "date": "2016-08-01T13:22:01.061Z",
      "public": 1,
      "status": 1,
      "keyword": [
        "文章1关键字1",
        "文章1关键字2"
      ]
    };
    return new Promise((resolve, reject) => {
      resolve([testArticle, testArticle, testArticle, testArticle, testArticle, testArticle, testArticle]);
      // resolve(params);
      // reject();
    });
    */

  }
}
