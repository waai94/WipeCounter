import { defineConfig } from "vite";

export default defineConfig({
  base: "/WipeCounter/", // ← リポジトリ名を入れる
  root: "./src", // ソースコードのディレクトリ
  server: {
    port: 5173,   // 好きなポート
  },
   build: {
    outDir: "./docs"
  }
});
