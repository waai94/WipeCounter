const input = document.getElementById("input") as HTMLInputElement; // 入力フィールド
const output = document.getElementById("output") as HTMLParagraphElement;// 出力フィールド
const button = document.getElementById("click") as HTMLButtonElement;// ボタン要素
input.addEventListener("input", () => { // 入力イベントリスナーを追加
    const value = input.value;// 入力値を取得
    output.textContent = `You typed: ${value}`;// 出力フィールドに表示
});

button.addEventListener("click", () => { // ボタンクリックイベントリスナーを追加
    const value = input.value;
    output.textContent = `Button clicked! You typed: ${value}`;
    input.value = ""; // 入力フィールドをクリア
});

