/**
 * @file AI service
 * @module module/ai/service
 * @author Surmon <https://github.com/surmon-china>
 */

import _omit from 'lodash/omit'
import _uniq from 'lodash/uniq'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { OptionsService } from '@app/modules/options/options.service'
import { ArticleService } from '@app/modules/article/article.service'
import { Comment } from '@app/modules/comment/comment.model'
import { GUESTBOOK_POST_ID } from '@app/constants/biz.constant'
import { ArticleAiSummaryExtraKeys } from '@app/constants/extras.constant'
import { getMessageFromAxiosError } from '@app/transformers/error.transformer'
import { getExtraValue } from '@app/transformers/extra.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { CF_AI_GATEWAY } from '@app/app.config'
import { AiModelIds, AiModelsMap, DEFAULT_AI_PROMPT_TEMPLATES } from './ai.config'
import { GenerateAiArticleContentDTO, GenerateAiCommentReplyDTO } from './ai.dto'
import { AiGenerateResult } from './ai.interface'

export const logger = createLogger({ scope: 'AIService', time: isDevEnv })

@Injectable()
export class AiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly optionsService: OptionsService,
    private readonly articleService: ArticleService
  ) {}

  private requestAiGateway(options: {
    prompt: string
    model: AiModelIds
    temperature: number
  }): Promise<AiGenerateResult> {
    // https://developers.cloudflare.com/ai-gateway/usage/chat-completion/
    const { accountId, gatewayId, token } = CF_AI_GATEWAY
    const url = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/compat/chat/completions`
    const requestParams = {
      stream: false,
      model: options.model,
      temperature: options.temperature,
      // MARK: Do not use the max_tokens parameter as its behavior is highly inconsistent across different models
      // max_tokens: options.maxTokens,
      messages: [{ role: 'user', content: options.prompt }]
    }

    return this.httpService.axiosRef
      .post(url, requestParams, {
        headers: {
          'cf-aig-authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then((response) => ({
        provider: AiModelsMap.get(options.model)!.provider,
        model: AiModelsMap.get(options.model)!.model,
        // https://developers.cloudflare.com/ai-gateway/usage/providers/deepseek/
        content: response.data?.choices?.[0]?.message?.content as string
      }))
      .catch((error) => {
        const errorInfos = error.response?.data?.error
        const errorObject = Array.isArray(errorInfos) ? errorInfos[0] : errorInfos
        const errorMessage = getMessageFromAxiosError(errorObject ?? error)
        logger.error(`AI Gateway Error: ${errorMessage}`)
        return Promise.reject(errorMessage)
      })
  }

  private renderTemplate(template: string, data: Record<string, string>) {
    return template.replace(/{{(\w+)}}/g, (_, key) => data[key] || '')
  }

  public async generateArticleSummary({ model, prompt, article_id }: GenerateAiArticleContentDTO) {
    const article = await this.articleService.getDetailByNumberIdOrSlug({ numberId: article_id, lean: true })
    const promptTemplate = prompt ?? DEFAULT_AI_PROMPT_TEMPLATES.articleSummary
    const finalPrompt = this.renderTemplate(promptTemplate, { article: article.content })
    return await this.requestAiGateway({
      prompt: finalPrompt,
      model: model ?? AiModelIds.DeepSeekChat,
      temperature: 0.4
    })
  }

  public async generateArticleReview({ model, prompt, article_id }: GenerateAiArticleContentDTO) {
    const article = await this.articleService.getDetailByNumberIdOrSlug({ numberId: article_id, lean: true })
    const promptTemplate = prompt ?? DEFAULT_AI_PROMPT_TEMPLATES.articleReview
    const finalPrompt = this.renderTemplate(promptTemplate, { article: article.content })
    return await this.requestAiGateway({
      prompt: finalPrompt,
      model: model ?? AiModelIds.DeepSeekChat,
      temperature: 1.4
    })
  }

  public async generateCommentReply(comment: Comment, payload?: GenerateAiCommentReplyDTO) {
    let contextInfo = 'nil'

    if (comment.post_id === GUESTBOOK_POST_ID) {
      const options = await this.optionsService.ensureAppOptions()
      contextInfo = [
        `This message is from the blog's general guestbook.`,
        `The following is the blogger's "Statement & FAQ". You may extract relevant information from it IF the user's comment requires specific answers. Otherwise, feel free to ignore this section and respond naturally:`,
        `"""`,
        options.statement,
        `"""`
      ].join('\n')
    } else {
      const article = await this.articleService.getDetailByNumberIdOrSlug({
        numberId: comment.post_id,
        lean: true
      })

      contextInfo = [
        `Article Title: ${article.title}`,
        `Article Summary: ${getExtraValue(article.extras, ArticleAiSummaryExtraKeys.Content) || article.content.substring(0, 800)}`
      ].join('\n')
    }

    const promptTemplate = payload?.prompt ?? DEFAULT_AI_PROMPT_TEMPLATES.commentReply
    const finalPrompt = this.renderTemplate(promptTemplate, {
      context: contextInfo,
      comment: comment.content
    })

    return await this.requestAiGateway({
      model: payload?.model ?? AiModelIds.Gemini25Flash,
      prompt: finalPrompt,
      temperature: 0.8
    })
  }
}
