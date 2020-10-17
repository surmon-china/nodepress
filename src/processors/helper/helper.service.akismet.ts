/**
 * Helper Akismet service.
 * @file Helper Akismet 评论反垃圾服务
 * @module processor/helper/akismet.service
 * @author Surmon <https://github.com/surmon-china>
 */

import akismet from 'akismet-api';
import { Injectable } from '@nestjs/common';
import { getMessageFromNormalError } from '@app/transformers/error.transformer';
import * as APP_CONFIG from '@app/app.config';

// 验证器支持的操作行为
export enum EAkismetActionType {
  CheckSpam = 'checkSpam',
  SubmitSpam = 'submitSpam',
  SubmitHam = 'submitHam',
}

// 验证体数据结构
export interface IContent {
  user_ip: string;
  user_agent: string;
  referrer: string;
  permalink: string;
  comment_type?: 'comment';
  comment_author?: string;
  comment_author_email?: string;
  comment_author_url?: string;
  comment_content?: string;
  is_test?: boolean;
}

@Injectable()
export class AkismetService {

  private client: akismet;
  private clientIsValid = null;

  constructor() {
    this.initClient();
    this.initVerify();
  }

  // 初始化客户端
  private initClient(): void {
    this.client = akismet.client({
      key: APP_CONFIG.AKISMET.key,
      blog: APP_CONFIG.AKISMET.blog,
    });
  }

  // 初始化验证
  private initVerify(): void {
    this.client.verifyKey()
      .then(valid => valid
        ? Promise.resolve(valid)
        : Promise.reject('Akismet Key 无效！'),
      )
      .then(() => {
        this.clientIsValid = true;
        console.info('Akismet key 有效，已准备好工作！');
      })
      .catch(error => {
        this.clientIsValid = false;
        console.warn('Akismet 验证失败！无法工作，原因：', getMessageFromNormalError(error));
      });
  }

  // 构造检查器
  private buildInterceptor(handleType: EAkismetActionType) {
    return (content: IContent): Promise<any> => {
      return new Promise((resolve, reject) => {
        // 确定验证失败的情况下才会拦截验证，未认证或验证通过都继续操作
        if (this.clientIsValid === false) {
          const message = `Akismet verifyKey 失败，放弃 ${handleType} 操作！`;
          console.warn(message);
          return resolve(message);
        }

        console.info(`Akismet ${handleType} 操作中...`, new Date());
        this.client[handleType](content).then(result => {
          // 如果是检查 spam 且检查结果为 true
          if (handleType === EAkismetActionType.CheckSpam && result) {
            console.warn(`Akismet ${handleType} 检测到 SPAM！`, new Date(), content);
            reject(new Error('SPAM!'));
          } else {
            console.info(`Akismet ${handleType} 操作成功！`);
            resolve(result);
          }
        }).catch(error => {
          const message = `Akismet ${handleType} 操作失败！`;
          console.warn(message, error);
          reject(message);
        });
      });
    };
  }

  // 检查 SPAM
  public checkSpam(content: IContent): Promise<any> {
    return this.buildInterceptor(EAkismetActionType.CheckSpam)(content);
  }

  // 提交 SPAM
  public submitSpam(content: IContent): Promise<any> {
    return this.buildInterceptor(EAkismetActionType.SubmitSpam)(content);
  }

  // 提交 HAM
  public submitHam(content: IContent): Promise<any> {
    return this.buildInterceptor(EAkismetActionType.SubmitHam)(content);
  }
}
