import createInstance from "../axios/Interceptor"; // <-- 커스텀 axios 인스턴스 함수 import

// 전체 자산 목록 가져오기
export function getAsset() {
    const axiosInstance = createInstance(); //커스텀 axios 인스턴스 생성
    const serverUrl = import.meta.env.VITE_BACK_SERVER; //http://localhost:9999 <-- .env에 설정된 백엔드 주소


    const options={}; // <-- GET /asset 요청
    options.url = serverUrl + "/asset"; 
    options.method = 'get';

    //axios 호출 결과를 반환
    return axiosInstance(options)
        .then(function(res) { //콜백
          //console.log(res);
          return res.data; // <-- 응답 데이터 중 자산 리스트만 추출해서 반환
    });

    

}



