/**
 * Markdown transform.
 * @file Markdown 转换器
 * @description Markdown 相关处理器
 * @module transformer/markdown
 * @author Surmon <https://github.com/surmon-china>
 */

import marked from 'marked';
// import escapeHtml from 'escape-html';

// const sanitizeRenderer = new marked.Renderer();
// sanitizeRenderer.html = (html: string): string => {
//   return escapeHtml(html);
// };

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  sanitize: true, // 升级后无法使用内置消毒
  breaks: false,
  pedantic: false,
  smartLists: true,
  smartypants: false,
});

/*
  TODO: 渲染器问题
  - 数据原则：
    1. 用户输入永远不篡改，不转码，用户输入什么，接口就输出什么
    2. 客户端在渲染 markdown 时进行消毒
  - 目前的问题：
    marked 0.7 要废弃 sanitize 项，导致调用方需要手动对所有的用户产生 html 进行消毒
  - 消毒方案：
    1. 不支持用户输入 html，所以只要让 markdown 不解析 html 就可以了，即对所有 html 标签和符号进行转码
      但问题是，sanitize 严格按照 html 规范来实现对 html 的识别，导致用户输入的不规范数据都无法被有效的 hook 处理；
      比如 <img onerror="test" src="" /> 就会被识别为图片或文本或段落，而不是 html，
      且，sanitize 选项在内部被广泛用于各种 链接、标符的识别，这些工作无法通过覆盖来做到
      模型：markdown string -> marked(hooks:escape(link/img/tag/html/text)) -> html string
    2. 支持用户输入 html，但在最终渲染产出之后，对整体的所有内容进行消毒，比如使用 DOMPurify，排除掉一切所有的用户非法输入，再拿去做渲染
      模型1: markdown string -> marked() -> html string -> DOMPurify -> html string
      模型: markdown string -> DOMPurify -> marked() -> html string
    3. 从 marked 的设计来看，cleanUrl 等方法的处理都会在后期移除，也就是说 markdown 中 [test](javascript:alert('test')) 这样的代码将不再会被默认消毒，
      也就是说，调用者必须要手动处理安全问题，所以看起来方案 2 才是最终的解决方案，
      但 2 会导致用户可操作性太强，如修改 css、定义样式属性、添加视频元素、这些都会引起业务、样式失控,
      但如果用，就要：禁掉大部分属性、标签... 最终发现还是方案 1 不错...
    4. 把方案 2 的消毒挪到第一步一切问题就都解决啦，比如：
        DOMPurify.sanitize('- 123123123\n\n<img class="asdasd" onerror="" />', { ALLOWED_ATTR: [] })
      把消毒后的内容在拿去解析就可以啦... 有一个巨大的缺陷，就是把用户写的 markdown code 也给消毒了...
        DOMPurify.sanitize('- 123123123\n\n```<img class="asdasd" onerror="" />```', { ALLOWED_ATTR: [] })
        -> '- 123123123\n\n`<img>`'
  - 最终结论：
      方案 2 无法实行，无论放在节点 2 还是 4，都会有无法承担的维护成本，放在节点 2 会吧用户输入的 code 进行消毒，放在节点 4 会导致用户可以输入任何前端需渲染的类型。
      最终选定方案 1，使用 escapeHtml 对 text、html、tag 进行 escape，对 link、image 进行 cleanLink
*/

export function parseMarkdownToHtml(value: string, sanitize = true): string {
  return marked(value, { sanitize });
}
