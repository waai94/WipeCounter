import { createClient } from "@supabase/supabase-js";
// ==============================
//  Supabase 初期化
// ==============================
const supabaseUrl = "https://ntsgsutiifeelufmtrkt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50c2dzdXRpaWZlZWx1Zm10cmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MzIyMjAsImV4cCI6MjA3NzMwODIyMH0.HpTgcFM5jlsI29B4TnWGWFJHuUCcioO-9ke0OSSjfEA";
export const supabase = createClient(supabaseUrl, supabaseKey);
// ==============================
//  DOM 参照
// ==============================
const input = document.getElementById("input");
const output = document.getElementById("output");
const button = document.getElementById("click");
const raidSelect = document.getElementById("raidSelect");
const wipePhaseSelect = document.getElementById("wipePhaseSelect");
const raidTableBody = document.querySelector("#raid_table tbody");
const filterRaidSelect = document.getElementById("filterRaidSelect");
const filterWipePhaseSelect = document.getElementById("filterWipePhaseSelect");
const filterButton = document.getElementById("filterButton");
const clearFilterButton = document.getElementById("clearFilterButton");
// ==============================
//  定義データ
// ==============================
const raids = [
    { value: "TUOB", text: "絶バハムート討滅戦" },
    { value: "UWU", text: "絶アルテマウェポン破壊作戦" },
    { value: "TEA", text: "絶アレキサンダー討滅戦" },
    { value: "DSR", text: "絶竜詩戦争" },
    { value: "TOP", text: "絶オメガ検証戦" },
    { value: "FRU", text: "絶もう一つの未来" }
];
const wipephases = Array.from({ length: 9 }, (_, i) => ({
    value: `p${i + 1}`,
    text: `p${i + 1}`
}));
// ==============================
//  初期化処理
// ==============================
function setupSelectOptions() {
    raids.forEach(raid => {
        const option = new Option(raid.text, raid.value);
        raidSelect.appendChild(option);
        filterRaidSelect.appendChild(option.cloneNode(true));
    });
    wipephases.forEach(phase => {
        const option = new Option(phase.text, phase.value);
        wipePhaseSelect.appendChild(option);
        filterWipePhaseSelect.appendChild(option.cloneNode(true));
    });
}
function getRaidNumberFromName(raidName) {
    const index = raids.findIndex(r => r.text === raidName);
    return index >= 0 ? index : -1;
}
// ==============================
//  データ操作
// ==============================
async function insertMessage() {
    let text = input.value.trim() || "nope";
    const raid = raidSelect.selectedIndex;
    const wipePhase = wipePhaseSelect.selectedIndex;
    const { error } = await supabase
        .from("begin")
        .insert([{ content: text, raid_tag: raid, wipe_phase: wipePhase }]);
    if (error) {
        console.error("Error inserting message:", error);
        alert("送信に失敗しました。");
        return;
    }
    await fetchLatestMessages();
    input.value = "";
}
// ==============================
//  データ取得・描画
// ==============================
async function fetchLatestMessages() {
    console.log("fetchLatestMessages called");
    const { data, error } = await supabase
        .from("begin")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);
    if (error) {
        console.error("Error fetching messages:", error);
        return;
    }
    raidTableBody.innerHTML = "";
    data.forEach(begin => {
        var _a, _b;
        const raidName = ((_a = raids[begin.raid_tag]) === null || _a === void 0 ? void 0 : _a.text) || "Unknown Raid";
        const raidClass = `raid-${getRaidNumberFromName(raidName)}`;
        const tr = document.createElement("tr");
        const dateTd = createCell(new Date(begin.created_at).toLocaleString(), raidClass);
        const raidTd = createCell(raidName, raidClass);
        const wipeTd = createCell(((_b = wipephases[begin.wipe_phase]) === null || _b === void 0 ? void 0 : _b.text) || "Unknown Phase", raidClass);
        const contentTd = createCell(begin.content, raidClass);
        tr.append(dateTd, raidTd, wipeTd, contentTd);
        raidTableBody.appendChild(tr);
    });
    console.log("updated");
}
function createCell(text, className) {
    const td = document.createElement("td");
    td.textContent = text;
    td.classList.add(className);
    return td;
}
// ==============================
//  フィルタリング
// ==============================
async function filterMessages() {
    const raid = filterRaidSelect.selectedIndex;
    const wipePhase = filterWipePhaseSelect.selectedIndex;
    let query = supabase
        .from("begin")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);
    if (raid > 0)
        query = query.eq("raid_tag", raid);
    if (wipePhase > 0)
        query = query.eq("wipe_phase", wipePhase);
    const { data, error } = await query;
    if (error) {
        console.error("Error fetching filtered messages:", error);
        return;
    }
    raidTableBody.innerHTML = "";
    data.forEach(begin => {
        var _a, _b;
        const raidName = ((_a = raids[begin.raid_tag]) === null || _a === void 0 ? void 0 : _a.text) || "Unknown Raid";
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${new Date(begin.created_at).toLocaleString()}</td>
      <td>${raidName}</td>
      <td>${((_b = wipephases[begin.wipe_phase]) === null || _b === void 0 ? void 0 : _b.text) || "Unknown Phase"}</td>
      <td>${begin.content}</td>
    `;
        raidTableBody.appendChild(tr);
    });
    console.log("filtered");
}
function clearFilters() {
    filterRaidSelect.selectedIndex = 0;
    filterWipePhaseSelect.selectedIndex = 0;
    fetchLatestMessages();
}
// ==============================
//  イベント登録
// ==============================
function setupEventListeners() {
    input.addEventListener("input", () => {
        output.textContent = `You typed: ${input.value}`;
    });
    button.addEventListener("click", insertMessage);
    filterButton.addEventListener("click", filterMessages);
    clearFilterButton.addEventListener("click", clearFilters);
}
// ==============================
//  起動処理
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    setupSelectOptions();
    setupEventListeners();
    fetchLatestMessages();
    // setInterval(fetchLatestMessages, 5000);
});
