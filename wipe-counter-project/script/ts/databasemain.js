import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ntsgsutiifeelufmtrkt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50c2dzdXRpaWZlZWx1Zm10cmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MzIyMjAsImV4cCI6MjA3NzMwODIyMH0.HpTgcFM5jlsI29B4TnWGWFJHuUCcioO-9ke0OSSjfEA";
export const supabase = createClient(supabaseUrl, supabaseKey);
const input = document.getElementById("input"); // 入力フィールド
const output = document.getElementById("output"); // 出力フィールド
const button = document.getElementById("click"); // ボタン要素
const raidSelect = document.getElementById("raidSelect"); // セレクトボックス
// セレクトボックスにオプションを追加
const raids = [{ value: "TUOB", text: "絶バハムート討滅戦" }, //
    { value: "UWU", text: "絶アルテマウェポン破壊作戦" },
    { value: "TEA", text: "絶アレキサンダー討滅戦" },
    { value: "DSR", text: "絶竜詩戦争" },
    { value: "TOP", text: "絶オメガ検証戦" },
    { value: "FRU", text: "絶もう一つの未来" }];
raids.forEach(raid => {
    const option = document.createElement("option");
    option.value = raid.value;
    option.textContent = raid.text;
    raidSelect.appendChild(option);
});
input.addEventListener("input", () => {
    const value = input.value; // 入力値を取得
    output.textContent = `You typed: ${value}`; // 出力フィールドに表示
});
button.addEventListener("click", async () => {
    const value = input.value;
    const text = input.value.trim();
    if (text.length === 0) {
        alert("Please enter a valid message.");
        return;
    }
    const raid = Number(raidSelect.selectedIndex); // セレクトボックスの値を取得
    const raidText = raidSelect.options[raidSelect.selectedIndex].text;
    console.log("Selected raid:", raid);
    console.log("Selected raid text:", raidText);
    const { error } = await supabase.from("begin").insert([{ content: text, raid_tag: raid }]); // Supabaseにデータを挿入
    if (error) {
        console.error("Error inserting message:", error);
        alert("Failed to send message. Please try again.");
        return;
    }
    await fetchLatestMessages(); // メッセージを再取得して表示を更新
    input.value = ""; // 入力フィールドをクリア
});
async function fetchLatestMessages() {
    const { data, error } = await supabase.from("begin").select("*").order("created_at", { ascending: false }).limit(1); // 最新の1件のメッセージを取得
    if (error) {
        console.error("Error fetching messages:", error);
        return;
    }
    output.innerHTML = ""; // 出力フィールドをクリア
    data.forEach((begin) => {
        const p = document.createElement("p");
        p.textContent = begin.content;
        output.appendChild(p);
    });
}
document.addEventListener("DOMContentLoaded", fetchLatestMessages); // ページ読み込み時にメッセージを取得
