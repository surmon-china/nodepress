import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

@Injectable()
export class ArticleService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: Http) { }

  /*
  public getLists(params):Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(params);
      // reject();
    });
  }
  */

  getLists() {
    console.log(this)
    // return this.http.get(this.apiUrl)
               // .toPromise()
               // .then(response => response.json().data as Hero[])
               // .catch(this.handleError);
  }

  /*
  getItem(id: number) {
    return this.getHeroes()
               .then(heroes => heroes.find(hero => hero.id === id));
  }

  
  addItem(hero: Hero): Promise<Hero>  {
    if (hero.id) {
      return this.put(hero);
    }
    return this.post(hero);
  }

  delItem(hero: Hero) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.apiUrl}/${hero.id}`;
    return this.http
               .delete(url, {headers: headers})
               .toPromise()
               .catch(this.handleError);
  }

  */

  /*
  private post(hero: Hero): Promise<Hero> {
    let headers = new Headers({
      'Content-Type': 'application/json'});
    return this.http
               .post(this.apiUrl, JSON.stringify(hero), {headers: headers})
               .toPromise()
               .then(res => res.json().data)
               .catch(this.handleError);
  }

  // Update existing Hero
  private put(hero: Hero) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.apiUrl}/${hero.id}`;
    return this.http
               .put(url, JSON.stringify(hero), {headers: headers})
               .toPromise()
               .then(() => hero)
               .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  */
}
