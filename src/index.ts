import type { ElementContent, Root } from 'hast';
import type { Plugin } from 'unified';
import { CONTINUE, SKIP, visit } from 'unist-util-visit';

function allAscii(str: string): boolean {
  return /^[\x20-\x7F]*$/.test(str);
}

function allSpaces(str: string): boolean {
  return /^\s*$/.test(str);
}

/// 半角文字と全角文字の境界で分割する
function splitHalfAndFull(input: string, fullChars: string): string[] {
  return input.split(
    new RegExp(
      `(?<=[${fullChars}])\\s?(?=[\\x20-\\x7F])|(?<=[\\x20-\\x7F])\\s?(?=[${fullChars}])`,
      'u',
    ),
  );
}

type PartType = 'half' | 'full';
type Padding = [boolean, boolean];

export type Options = {
  padding?: string;
  fullChars?: string;
};

const resolveOptions = (options?: Options): Required<Options> => {
  return {
    padding: options?.padding ?? '.125em',
    fullChars:
      '\\p{Script=Hiragana}\\p{Script=Katakana}\\p{Script=Han}、。「」（）',
  };
};

const rehypeTextAutospace: Plugin<[Options?], Root> = (options) => (tree) => {
  const opts = resolveOptions(options);

  visit(tree, (node, index, parent) => {
    if (node.type === 'element') {
      // pre, code, ruby タグ内のテキストはスキップ
      if (['pre', 'code', 'ruby'].includes(node.tagName)) {
        return SKIP;
      }
    }
    if (node.type !== 'text' || index === undefined || parent === undefined) {
      return CONTINUE;
    }

    const newChildren: ElementContent[] = [];
    const parts = splitHalfAndFull(node.value, opts.fullChars).filter(
      (part) => !allSpaces(part),
    );
    const partTypes: PartType[] = parts.map((part) =>
      allAscii(part) ? 'half' : 'full',
    );
    for (let i = 0; i < parts.length; i++) {
      let padding: Padding;
      if (partTypes[i] === 'half') {
        // 半角なら padding は不要
        padding = [false, false];
      } else if (partTypes[i - 1] === 'half' && partTypes[i + 1] === 'half') {
        // 両隣が存在して、両方半角である場合
        padding = [true, true];
      } else if (partTypes[i - 1] === 'half') {
        // 左隣の part が存在していて、半角である場合
        padding = [true, false];
      } else if (partTypes[i + 1] === 'half') {
        // 右隣の part が存在していて、半角である場合
        padding = [false, true];
      } else {
        padding = [false, false];
      }
      if (
        partTypes[i] === 'full' &&
        i === 0 &&
        i === parts.length - 1 &&
        index - 1 >= 0 &&
        index + 1 < parent?.children?.length
      ) {
        // part は一つだけで、左右に兄弟要素が存在する場合
        padding = [true, true];
      } else if (partTypes[i] === 'full' && i === 0 && index - 1 >= 0) {
        // part が最左で、左に兄弟要素が存在する場合
        padding[0] = true;
      } else if (
        partTypes[i] === 'full' &&
        i === parts.length - 1 &&
        index + 1 < parent?.children?.length
      ) {
        // part が最右で、右に兄弟要素が存在する場合
        padding[1] = true;
      }

      if (padding[0] && padding[1]) {
        newChildren.push({
          type: 'element',
          tagName: 'span',
          properties: {
            style: `padding-right:${opts.padding};padding-left:${opts.padding}`,
          },
          children: [
            {
              type: 'text',
              value: parts[i],
            },
          ],
        });
      } else if (padding[0]) {
        newChildren.push({
          type: 'element',
          tagName: 'span',
          properties: {
            style: `padding-left:${opts.padding}`,
          },
          children: [
            {
              type: 'text',
              value: parts[i],
            },
          ],
        });
      } else if (padding[1]) {
        newChildren.push({
          type: 'element',
          tagName: 'span',
          properties: {
            style: `padding-right:${opts.padding}`,
          },
          children: [
            {
              type: 'text',
              value: parts[i],
            },
          ],
        });
      } else {
        newChildren.push({
          type: 'text',
          value: parts[i],
        });
      }
    }

    if (newChildren.length > 0) {
      parent.children[index] = {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: newChildren,
      };
    }
    return SKIP;
  });
};

export default rehypeTextAutospace;
