# 簡易出勤系統
https://github.com/user-attachments/assets/40a33ecf-9da3-487c-80ba-2f1ff20c30ff

專案使用 **NestJS** 與 **Vue 3** 開發。 <br>
可通過 Docker 依照以下步驟啟動專案：<br>

1. 取得 Docker Compose 專案 <br>
   ```git clone https://github.com/wlhsu1992/attendance-system.git```
3. 於 attendance-system 目錄下使用 docker 建置並啟動所有服務 <br>
   ```docker-compose up -d --build```
5. 開啟網頁 <br>
   ```http://localhost:8080```

專案為方便使用 Docker 建置額外合併到此 Repo 中，前後端個別開發歷程可參考以下Repo <br>
後端專案 ```git clone https://github.com/wlhsu1992/attendance-system-backend.git``` <br>
前端專案 ```git clone https://github.com/wlhsu1992/attendance-system-frontend.git``` <br>

```
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
```

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



