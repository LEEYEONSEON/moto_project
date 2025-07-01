import { useParams } from "react-router-dom";
import createInstance from "../axios/Interceptor";


export function getAsset() {
    const axiosInstance = createInstance(); //커스텀 axios 인스턴스
    const serverUrl = import.meta.env.VITE_BACK_SERVER; //http://localhost:9999


    const options={};
    options.url = serverUrl + "/asset";
    options.method = 'get';

    //axios 호출 결과를 반환
    return axiosInstance(options)
        .then(function(res) { //콜백
           //반환되는 값은 배열
                return res.data.resData; //resData 배열 반환
    });

    

}


export function getAssetByCode(assetCode) {
  const axiosInstance = createInstance();
  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const options = {};
  options.url = serverUrl + "/asset?assetCode=" + encodeURIComponent(assetCode);
  options.method = 'get';

  return axiosInstance(options)
  .then(function(res) {
    return res.data.resData;
  });
}

