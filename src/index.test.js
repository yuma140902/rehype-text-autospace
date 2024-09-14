import { describe, it, expect } from 'vitest';
import { h } from "hastscript";
import { rehype } from "rehype";
import rehypeTextAutospace from "./index.js";
const bothStyle = { style: "padding-right:0.125em;padding-left:0.125em;" };
const leftStyle = { style: "padding-left:0.125em;" };
const rightStyle = { style: "padding-right:0.125em;" };
describe('Single element tests', () => {
    it("full", async () => {
        const input = h("p", "カタカナ");
        const output = await rehype()
            .use(rehypeTextAutospace)
            .run(h(null, input));
        expect(output).toEqual(h(null, h('p', h('span', 'カタカナ'))));
    });
    it("full, half, full", async () => {
        const input = h("p", "あいうえおabc漢字");
        const output = await rehype()
            .use(rehypeTextAutospace)
            .run(h(null, input));
        expect(output).toEqual(h(null, h("p", [
            h("span", [
                h("span", rightStyle, "あいうえお"),
                "abc",
                h("span", leftStyle, "漢字"),
            ])
        ])));
    });
    it("full, half", async () => {
        const input = h("p", "あいうえおabc");
        const output = await rehype()
            .use(rehypeTextAutospace)
            .run(h(null, input));
        expect(output).toEqual(h(null, h("p", [
            h("span", [
                h("span", rightStyle, "あいうえお"),
                "abc",
            ])
        ])));
    });
    it("half, full", async () => {
        const input = h("p", "abcかきくけこ");
        const output = await rehype()
            .use(rehypeTextAutospace)
            .run(h(null, input));
        expect(output).toEqual(h(null, h("p", [
            h("span", [
                "abc",
                h("span", leftStyle, "かきくけこ"),
            ])
        ])));
    });
    it("half, full, half", async () => {
        const input = h("p", "abcあいうえおCDE123");
        const output = await rehype()
            .use(rehypeTextAutospace)
            .run(h(null, input));
        expect(output).toEqual(h(null, h("p", [
            h("span", [
                "abc",
                h("span", bothStyle, "あいうえお"),
                "CDE123",
            ])
        ])));
    });
    it("half", async () => {
        const input = h("p", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
        const output = await rehype()
            .use(rehypeTextAutospace)
            .run(h(null, input));
        expect(output).toEqual(h(null, h("p", [
            h("span", [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            ])
        ])));
    });
});
describe('Left hand side sibling', () => {
    it("full", async () => {
        const input = h("p", [h("a", ["123"]), "あいうえお"]);
        const output = await rehype()
            .use(rehypeTextAutospace)
            .run(h(null, input));
        const expected = h(null, h('p', [
            h('a', h('span', '123')),
            h('span', h('span', leftStyle, 'あいうえお'))
        ]));
        expect(output).toEqual(expected);
    });
    // TODO: テストの書き方を統一する
    // TODO: (swc/jest ではなく ts-jest を使うようにする)
    // TODO: jest で ESM を扱う方法をきちんと調べる
    // TODO: tsup.config.js、jest.config.json はコピペしてきたものなので書き直す
    // TODO: 間にスペースが入っているパターンもテストを書く
    // TODO: update
    it("full, half, full", async () => {
        const input = h("p", "あいうえおabc漢字");
        const output = await rehype()
            .use(rehypeTextAutospace)
            .run(h(null, input));
        expect(output).toEqual(h(null, h("p", [
            h("span", [
                h("span", rightStyle, "あいうえお"),
                "abc",
                h("span", leftStyle, "漢字"),
            ])
        ])));
    });
    // TODO: update
    it("full, half", async () => {
        const input = h("p", "あいうえおabc");
        const output = await rehype()
            .use(rehypeTextAutospace)
            .run(h(null, input));
        expect(output).toEqual(h(null, h("p", [
            h("span", [
                h("span", rightStyle, "あいうえお"),
                "abc",
            ])
        ])));
    });
    // TODO: update
    it("half, full", async () => {
        const input = h("p", "abcかきくけこ");
        const output = await rehype()
            .use(rehypeTextAutospace)
            .run(h(null, input));
        expect(output).toEqual(h(null, h("p", [
            h("span", [
                "abc",
                h("span", leftStyle, "かきくけこ"),
            ])
        ])));
    });
    // TODO: update
    it("half, full, half", async () => {
        const input = h("p", "abcあいうえおCDE123");
        const output = await rehype()
            .use(rehypeTextAutospace)
            .run(h(null, input));
        expect(output).toEqual(h(null, h("p", [
            h("span", [
                "abc",
                h("span", bothStyle, "あいうえお"),
                "CDE123",
            ])
        ])));
    });
    // TODO: update
    it("half", async () => {
        const input = h("p", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
        const output = await rehype()
            .use(rehypeTextAutospace)
            .run(h(null, input));
        expect(output).toEqual(h(null, h("p", [
            h("span", [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            ])
        ])));
    });
});
