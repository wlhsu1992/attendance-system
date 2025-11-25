import { ref, computed } from 'vue';

// 定義與後端一致的資料介面
export interface AttendanceRecord {
  userId: string;
  checkIn: string; // ISO Date String
  checkOut: string | null;
}

export interface PaginatedResponse {
  data: AttendanceRecord[];
  total: number;
  page: number;
  lastPage: number;  
}

export function useAttendance() {
  // 後端 API 位址
  const API_URL = 'http://localhost:3000/attendance';
  
  const records = ref<AttendanceRecord[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isWorking = ref(false);

  const page = ref(1);
  const limit = ref(5); // 每頁顯示 5 筆
  const total = ref(0);
  const lastPage = ref(1);

  const initData = async () => {
    await Promise.all([
      fetchStatus(),
      fetchRecords(1) 
    ]);
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/status`);
      if (!res.ok) throw new Error('無法取得目前狀態');
      const data = await res.json();
      console.log(data);
      isWorking.value = data.isWorking;
    } catch (err) {
      console.error('Fetch status failed:', err);
      // 若查詢失敗，可選擇不跳錯誤提示，避免干擾使用者操作
    }
  };

  // Action: 取得列表
  const fetchRecords = async (targetPage = 1) => {
    loading.value = true;
    try {
      const res = await fetch(`${API_URL}?page=${targetPage}&limit=${limit.value}`);
      if (!res.ok) throw new Error('無法取得紀錄');

      const responseData: PaginatedResponse = await res.json();

      records.value = responseData.data;
      total.value = responseData.total;
      page.value = responseData.page;
      lastPage.value = responseData.lastPage;

      error.value = null;
    } catch (err) {
      error.value = (err as Error).message;
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Action: 換頁
  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= lastPage.value) {
      fetchRecords(newPage);
    }
  };

  // Action: 上班打卡
  const checkIn = async () => {
    loading.value = true;
    try {
      const res = await fetch(`${API_URL}/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        // 解析後端回傳的錯誤訊息 (例如 409 Conflict)
        const data = await res.json();
        throw new Error(data.message || '打卡失敗');
      }
      
      // 成功後重新整理列表
      await initData();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      loading.value = false;
    }
  };

  // Action: 下班打卡
  const checkOut = async () => {
    loading.value = true;
    try {
      const res = await fetch(`${API_URL}/check-out`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '簽退失敗');
      }
      
      await initData();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      loading.value = false;
    }
  };

  return {
    records,
    isWorking,
    loading,
    initData,
    error,
    page,
    lastPage,
    changePage,
    fetchRecords,
    checkIn,
    checkOut,
  };
}