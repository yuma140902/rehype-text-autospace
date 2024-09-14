import { h } from 'hastscript';
import { rehype } from 'rehype';
import { describe, expect, it } from 'vitest';
import rehypeTextAutospace from './index';

const bothStyle = { style: 'padding-right:0.125em;padding-left:0.125em;' };
const leftStyle = { style: 'padding-left:0.125em;' };
const rightStyle = { style: 'padding-right:0.125em;' };

describe('Single element tests', () => {
  it('full', async () => {
    const input = h(null, h('p', 'カタカナ'));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(null, h('p', h('span', 'カタカナ')));
    expect(output).toEqual(expected);
  });

  it('full, half, full', async () => {
    const input = h(null, h('p', 'あいうえおabc漢字'));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('span', [
          h('span', rightStyle, 'あいうえお'),
          'abc',
          h('span', leftStyle, '漢字'),
        ]),
      ]),
    );
    expect(output).toEqual(expected);
  });

  it('full, half', async () => {
    const input = h(null, h('p', 'あいうえおabc'));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [h('span', [h('span', rightStyle, 'あいうえお'), 'abc'])]),
    );
    expect(output).toEqual(expected);
  });

  it('half, full', async () => {
    const input = h(null, h('p', 'abcかきくけこ'));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [h('span', ['abc', h('span', leftStyle, 'かきくけこ')])]),
    );
    expect(output).toEqual(expected);
  });

  it('half, full, half', async () => {
    const input = h(null, h('p', 'abcあいうえおCDE123'));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('span', ['abc', h('span', bothStyle, 'あいうえお'), 'CDE123']),
      ]),
    );
    expect(output).toEqual(expected);
  });

  it('half', async () => {
    const input = h(
      null,
      h('p', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
    );
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('span', ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']),
      ]),
    );
    expect(output).toEqual(expected);
  });
});

describe('Left hand side sibling', () => {
  it('full', async () => {
    const input = h(null, h('p', [h('a', '123'), 'あいうえお']));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('a', h('span', '123')),
        h('span', h('span', leftStyle, 'あいうえお')),
      ]),
    );
    expect(output).toEqual(expected);
  });

  it('full, half, full', async () => {
    const input = h(null, h('p', [h('a', 'link'), 'あいうえおabc漢字']));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('a', h('span', 'link')),
        h('span', [
          h('span', bothStyle, 'あいうえお'),
          'abc',
          h('span', leftStyle, '漢字'),
        ]),
      ]),
    );
    expect(output).toEqual(expected);
  });

  it('full, half', async () => {
    const input = h(null, h('p', [h('a', 'link'), 'あいうえおabc']));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('a', h('span', 'link')),
        h('span', [h('span', bothStyle, 'あいうえお'), 'abc']),
      ]),
    );
    expect(output).toEqual(expected);
  });

  it('half, full', async () => {
    const input = h(null, h('p', [h('a', 'link'), 'abcかきくけこ']));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('a', h('span', 'link')),
        h('span', ['abc', h('span', leftStyle, 'かきくけこ')]),
      ]),
    );
    expect(output).toEqual(expected);
  });

  it('half, full, half', async () => {
    const input = h(null, h('p', [h('a', 'link'), 'abcあいうえおCDE123']));
    const output = await rehype().use(rehypeTextAutospace).run(h(null, input));
    const expected = h(
      null,
      h('p', [
        h('a', h('span', 'link')),
        h('span', ['abc', h('span', bothStyle, 'あいうえお'), 'CDE123']),
      ]),
    );
    expect(output).toEqual(expected);
  });

  it('half', async () => {
    const input = h(
      null,
      h('p', [
        h('a', 'link'),
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      ]),
    );
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('a', h('span', 'link')),
        h('span', ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']),
      ]),
    );
    expect(output).toEqual(expected);
  });
});

describe('Right hand side sibling', () => {
  it('full', async () => {
    const input = h(null, h('p', ['あいうえお', h('a', '123')]));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('span', h('span', rightStyle, 'あいうえお')),
        h('a', h('span', '123')),
      ]),
    );
    expect(output).toEqual(expected);
  });

  // TODO: 間にスペースが入っているパターンもテストを書く

  it('full, half, full', async () => {
    const input = h(null, h('p', ['あいうえおabc漢字', h('a', 'link')]));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('span', [
          h('span', rightStyle, 'あいうえお'),
          'abc',
          h('span', bothStyle, '漢字'),
        ]),
        h('a', h('span', 'link')),
      ]),
    );
    expect(output).toEqual(expected);
  });

  it('full, half', async () => {
    const input = h(null, h('p', ['あいうえおabc', h('a', 'link')]));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('span', [h('span', rightStyle, 'あいうえお'), 'abc']),
        h('a', h('span', 'link')),
      ]),
    );
    expect(output).toEqual(expected);
  });

  it('half, full', async () => {
    const input = h(null, h('p', ['abcかきくけこ', h('a', 'link')]));
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('span', ['abc', h('span', bothStyle, 'かきくけこ')]),
        h('a', h('span', 'link')),
      ]),
    );
    expect(output).toEqual(expected);
  });

  it('half, full, half', async () => {
    const input = h(null, h('p', ['abcあいうえおCDE123', h('a', 'link')]));
    const output = await rehype().use(rehypeTextAutospace).run(h(null, input));
    const expected = h(
      null,
      h('p', [
        h('span', ['abc', h('span', bothStyle, 'あいうえお'), 'CDE123']),
        h('a', h('span', 'link')),
      ]),
    );
    expect(output).toEqual(expected);
  });

  it('half', async () => {
    const input = h(
      null,
      h('p', [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        h('a', 'link'),
      ]),
    );
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('span', ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']),
        h('a', h('span', 'link')),
      ]),
    );
    expect(output).toEqual(expected);
  });
});

describe('Left and right hand side siblings', () => {
  it('full, half', async () => {
    const input = h(
      null,
      h('p', h('a', 'link1'), 'あいうえお', h('a', 'link2')),
    );
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [
        h('a', h('span', 'link1')),
        h('span', h('span', bothStyle, 'あいうえお')),
        h('a', h('span', 'link2')),
      ]),
    );
    expect(output).toEqual(expected);
  });
});

describe('Not siblings', () => {
  it('full, half', async () => {
    const input = h(null, [h('p', 'あいうえお'), h('p', 'abc')]);
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(
      null,
      h('p', [h('span', 'あいうえお')]),
      h('p', [h('span', ['abc'])]),
    );
    expect(output).toEqual(expected);
  });
});

describe('Skip pre, code and ruby', () => {
  it('pre', async () => {
    const input = h(null, [h('pre', 'あいうえお')]);
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(null, h('pre', 'あいうえお'));
    expect(output).toEqual(expected);
  });

  it('code', async () => {
    const input = h(null, [h('code', 'あいうえお')]);
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(null, h('code', 'あいうえお'));
    expect(output).toEqual(expected);
  });

  it('ruby', async () => {
    const input = h(null, [h('ruby', 'あいうえお')]);
    const output = await rehype().use(rehypeTextAutospace).run(input);
    const expected = h(null, h('ruby', 'あいうえお'));
    expect(output).toEqual(expected);
  });
});
