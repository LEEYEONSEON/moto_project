import { create } from 'zustand';

// WebSocket 상태를 관리하는 Zustand 스토어 정의
const useWsStore = create(function(set) {
  return {
    // WebSocket이 시작되었는지 여부 (초기값: false)
    wsStarted: false,

    // WebSocket 시작 여부를 true/false로 설정하는 함수
    setWsStarted: function(val) {
      set({ wsStarted: val });
    }
  };
});

export default useWsStore;
