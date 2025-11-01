"use strict";
const input = document.getElementById("input"); // 入力フィールド
const output = document.getElementById("output"); // 出力フィールド
const button = document.getElementById("click"); // ボタン要素
input.addEventListener("input", () => {
    const value = input.value; // 入力値を取得
    output.textContent = `You typed: ${value}`; // 出力フィールドに表示
});
button.addEventListener("click", () => {
    const value = input.value;
    output.textContent = `Button clicked! You typed: ${value}`;
    input.value = ""; // 入力フィールドをクリア
});
