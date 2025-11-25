<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAttendance } from './composables/useAttendance';

const { 
  records, 
  isWorking, 
  loading, 
  initData,
  page,
  lastPage,
  changePage,
  fetchRecords, 
  checkIn, 
  checkOut 
} = useAttendance();

// 即時時鐘邏輯
const currentTime = ref(new Date());
let timer: number | undefined;

// 更新時間的函式
const updateTime = () => {
  currentTime.value = new Date();
};

// 計算屬性：格式化時間 (YYYY/MM/DD HH:mm:ss)
const formattedTime = computed(() => {
  const d = currentTime.value;
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const date = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  
  return `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
});

// 計算工時秒數
const calculateDuration = (start: string, end: string | null): number => {
  if (!end) return 0;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  // 轉為秒數 (無條件捨去)
  return Math.floor((endTime - startTime) / 1000);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-TW', {
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

// --- 生命週期 ---
onMounted(() => {
  initData();
  // 每秒更新一次時間
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  // 元件銷毀時清除計時器，避免記憶體洩漏
  if (timer) clearInterval(timer);
});
</script>

<template>
  <main class="container">
    <header>
      <h1>📅 簡易出勤系統</h1>
    </header>

    <div class="clock-display">
      {{ formattedTime }}
    </div>

    <section class="dashboard" :class="{ 'active': isWorking }">
      <div class="status-display">
        <span class="status-light"></span>
        <h2>{{ isWorking ? '工作中 (Working)' : '已下班 (Off Duty)' }}</h2>
      </div>
      
      <div class="controls">
        <button 
          v-if="!isWorking" 
          @click="checkIn" 
          :disabled="loading"
          class="btn btn-primary"
        >
          {{ loading ? '處理中...' : '上班打卡' }}
        </button>
        
        <button 
          v-else 
          @click="checkOut" 
          :disabled="loading"
          class="btn btn-danger"
        >
          {{ loading ? '處理中...' : '下班打卡' }}
        </button>
      </div>
    </section>

    <hr class="divider" />

    <section class="history">
      <h3>📜 近期出勤紀錄</h3>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>上班時間</th>
              <th>下班時間</th>
              <th>工時長度</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in records" :key="index">
              <td>{{ formatDate(record.checkIn) }}</td>
              <td>
                <span v-if="record.checkOut">{{ formatDate(record.checkOut) }}</span>
                <span v-else class="tag-working">工作中...</span>
              </td>
              <td>
                {{ record.checkOut 
                  ? formatDuration(calculateDuration(record.checkIn, record.checkOut)) 
                  : '-' }}
              </td>
            </tr>
            <tr v-if="records.length === 0">
              <td colspan="3" class="text-center">目前尚無任何紀錄</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-controls">
        <button 
          class="btn-page" 
          :disabled="page === 1 || loading" 
          @click="changePage(page - 1)"
        >
          &lt; 上一頁
        </button>
        
        <span class="page-info">
          Page <strong>{{ page }}</strong> of {{ lastPage }}
        </span>

        <button 
          class="btn-page" 
          :disabled="page === lastPage || loading" 
          @click="changePage(page + 1)"
        >
          下一頁 &gt;
        </button>
      </div>
    </section>
  </main>
</template>