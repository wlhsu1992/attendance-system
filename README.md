# 簡易出勤系統
專案使用 **NestJS** 與 **Vue 3** 開發。
採用 Monorepo 架構，並已完全容器化 (Dockerized)。

## 🛠 專案結構
├── docker-compose.yml      # 容器編排設定
├── backend/                # NestJS 後端專案
│   ├── src/
│   │   ├── attendance/     # 核心模組 (Controller, Service, Schema, Spec)
│   │   └── app.module.ts   # 資料庫連線設定 (Env aware)
│   ├── test.http           # API 端點測試檔 (httpYac)
│   └── Dockerfile          # Multi-stage build for NestJS
└── frontend/               # Vue 3 前端專案
    ├── src/
    │   ├── composables/    # 商業邏輯封裝 (useAttendance.ts)
    │   ├── assets/css/     # 樣式系統 (Variables, Layout, Components)
    │   └── App.vue         # 主介面
    ├── nginx.conf          # Nginx SPA 路由設定
    └── Dockerfile          # Nginx build for Vue

## ✨ 功能性需求 

* **上班打卡:** 點擊上班打卡按鈕紀錄上班打卡時間。狀態為上班時則不可重複打卡。
* **下班打卡:** 點擊下班打卡按鈕紀錄下班打卡時間。狀態為下班時則不可重複打卡。
* **查詢出勤:** 以伺服器分頁取得打卡出勤紀錄 (上班時間/下班時間/工時長度)。
* **狀態儀錶板:** 根據工作狀態顯示 工作中、已下班
* **打卡按鈕:** 根據目前狀態，動態切換顯示「上班打卡」或「下班打卡」按鈕。

## ✨ 非功能性需求
* **Unit Test:** 重複上班打卡/重複下班打卡/成功下班
* **e2e Test:** 所有 API 端點測試檔案 (http yac)) 
* **Error Handling:** 針對業務邏輯錯誤回傳錯誤碼 & 特定錯誤訊息
* **Git Commit Message:** 使用英文撰寫，開頭第一個單詞需大寫且為動詞

---

## 🚀 快速啟動 (Docker Quick Start)

1. 下載專案
2. 使用 docker 建置並啟動所有服務 $ docker-compose up -d --build
3. 開啟網頁 http://localhost:8080

![啟動畫面](https://lurl.cc/MZd97)

