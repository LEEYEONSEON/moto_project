import createInstance from "../axios/Interceptor";


export function getAsset() {
    const axiosInstance = createInstance();
    const serverUrl = import.meta.env.VITE_BACK_SERVER; //http://localhost:9999


    const options={};
    options.url = serverUrl + "/asset";
    options.method = 'get';

    //axios 호출 결과를 반환
    return axiosInstance(options)
        .then(function(res) { //콜백
            console.log(res.data.resData);
        return res.data.resData; //resData 배열 반환
    });

}