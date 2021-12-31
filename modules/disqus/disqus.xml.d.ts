import { Comment } from '@app/modules/comment/comment.model';
import { Article } from '@app/modules/article/article.model';
export interface XMLItemData {
    article: Article;
    comments: Array<Comment>;
}
export declare const getDisqusXML: (data: XMLItemData[], guestbook: Array<Comment>) => string;
