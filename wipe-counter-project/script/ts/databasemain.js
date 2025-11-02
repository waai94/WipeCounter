import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ntsgsutiifeelufmtrkt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50c2dzdXRpaWZlZWx1Zm10cmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MzIyMjAsImV4cCI6MjA3NzMwODIyMH0.HpTgcFM5jlsI29B4TnWGWFJHuUCcioO-9ke0OSSjfEA";
export const supabase = createClient(supabaseUrl, supabaseKey);
const input = document.getElementById("input"); // 入力フィールド
const output = document.getElementById("output"); // 出力フィールド
const button = document.getElementById("click"); // ボタン要素
const raidSelect = document.getElementById("raidSelect"); // セレクトボックス
const wipePhaseSelect = document.getElementById("wipePhaseSelect"); // pセレクトボックス
// セレクトボックスにオプションを追加
const raids = [{ value: "TUOB", text: "絶バハムート討滅戦" }, //
    { value: "UWU", text: "絶アルテマウェポン破壊作戦" },
    { value: "TEA", text: "絶アレキサンダー討滅戦" },
    { value: "DSR", text: "絶竜詩戦争" },
    { value: "TOP", text: "絶オメガ検証戦" },
    { value: "FRU", text: "絶もう一つの未来" }];
const wipephases = [
    { value: "p1", text: "p1" },
    { value: "p2", text: "p2" },
    { value: "p3", text: "p3" },
    { value: "p4", text: "p4" },
    { value: "p5", text: "p5" },
    { value: "p6", text: "p6" },
    { value: "p7", text: "p7" },
    { value: "p8", text: "p8" },
    { value: "p9", text: "p9" },
];
raids.forEach(raid => {
    const option = document.createElement("option");
    option.value = raid.value;
    option.textContent = raid.text;
    raidSelect.appendChild(option);
});
wipephases.forEach(phase => {
    const option = document.createElement("option");
    option.value = phase.value;
    option.textContent = phase.text;
    wipePhaseSelect.appendChild(option);
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
    const wipePhase = Number(wipePhaseSelect.selectedIndex); // pセレクトボックスの値を取得
    const { error } = await supabase.from("begin").insert([{ content: text, raid_tag: raid, wipe_phase: wipePhase }]); // Supabaseにデータを挿入
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
        var _a;
        const p = document.createElement("p");
        p.textContent = begin.content;
        output.appendChild(p);
        const raidName = ((_a = raids[begin.raid_tag]) === null || _a === void 0 ? void 0 : _a.text) || "Unknown Raid";
        const raidP = document.createElement("p");
        raidP.textContent = `Raid: ${raidName}`;
        output.appendChild(raidP);
    });
}
document.addEventListener("DOMContentLoaded", fetchLatestMessages); // ページ読み込み時にメッセージを取得
