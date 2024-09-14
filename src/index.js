import { CONTINUE, SKIP, visit } from "unist-util-visit";
function allAscii(str) {
    return /^[\x00-\x7F]*$/.test(str);
}
function allSpaces(str) {
    return /^\s*$/.test(str);
}
function splitJapaneseAndEnglish(input) {
    return input.split(/(?<=[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}、。「」（）])\s?(?=[\x00-\x7F])|(?<=[\x00-\x7F])\s?(?=[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}、。「」（）])/u);
}
const rehypeTextAutospace = (_options) => (tree) => {
    visit(tree, (node, index, parent) => {
        if (node.type === "element") {
            // pre, code, ruby タグ内のテキストはスキップ
            if (["pre", "code", "ruby"].includes(node.tagName)) {
                return SKIP;
            }
        }
        if (node.type !== "text" || index === undefined || parent === undefined) {
            return CONTINUE;
        }
        let newChildren = [];
        const parts = splitJapaneseAndEnglish(node.value).filter((part) => !allSpaces(part));
        const partTypes = parts.map((part) => allAscii(part) ? "english" : "japanese");
        for (let i = 0; i < parts.length; i++) {
            let padding;
            if (partTypes[i] === "english") {
                // 英語なら padding は不要
                padding = [false, false];
            }
            else if (partTypes[i - 1] === "english" &&
                partTypes[i + 1] === "english") {
                // 両隣が存在して、両方英語である場合
                padding = [true, true];
            }
            else if (partTypes[i - 1] === "english") {
                // 左隣の part が存在していて、英語である場合
                padding = [true, false];
            }
            else if (partTypes[i + 1] === "english") {
                // 右隣の part が存在していて、英語である場合
                padding = [false, true];
            }
            else {
                padding = [false, false];
            }
            if (partTypes[i] === "japanese" &&
                i === 0 &&
                i === parts.length - 1 &&
                index - 1 >= 0 &&
                index + 1 < parent?.children?.length) {
                // part は一つだけで、左右に兄弟要素が存在する場合
                padding = [true, true];
            }
            else if (partTypes[i] === "japanese" && i === 0 && index - 1 >= 0) {
                // part が最左で、左に兄弟要素が存在する場合
                padding[0] = true;
            }
            else if (partTypes[i] === "japanese" &&
                i === parts.length - 1 &&
                index + 1 < parent?.children?.length) {
                // part が最右で、右に兄弟要素が存在する場合
                padding[1] = true;
            }
            if (padding[0] && padding[1]) {
                newChildren.push({
                    type: "element",
                    tagName: "span",
                    properties: {
                        style: "padding-right:0.125em;padding-left:0.125em;",
                    },
                    children: [
                        {
                            type: "text",
                            value: parts[i],
                        },
                    ],
                });
            }
            else if (padding[0]) {
                newChildren.push({
                    type: "element",
                    tagName: "span",
                    properties: {
                        style: "padding-left:0.125em;",
                    },
                    children: [
                        {
                            type: "text",
                            value: parts[i],
                        },
                    ],
                });
            }
            else if (padding[1]) {
                newChildren.push({
                    type: "element",
                    tagName: "span",
                    properties: {
                        style: "padding-right:0.125em;",
                    },
                    children: [
                        {
                            type: "text",
                            value: parts[i],
                        },
                    ],
                });
            }
            else {
                newChildren.push({
                    type: "text",
                    value: parts[i],
                });
            }
        }
        if (newChildren.length > 0) {
            parent.children[index] = {
                type: "element",
                tagName: "span",
                properties: {},
                children: newChildren,
            };
        }
        return SKIP;
    });
};
export default rehypeTextAutospace;
