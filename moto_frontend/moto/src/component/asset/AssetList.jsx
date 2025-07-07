//asset API 호출 함수
import { useEffect, useState } from 'react';
import { getAsset } from '../../utils/api';
import './asset.css';
import { Link } from 'react-router-dom';
import axiosInstance from "../../axios/Interceptor";

export default function AssetList() {
 
    const [assetList, setAssetList] = useState([]); //API 로 받아온 자산 목록
    const [loading, setLoading] = useState(true); //로딩 중 표시
    const [error, setError] = useState(null); //에러메시지

    useEffect(function() {
        //웹소켓으로 단순히 요청만 한번 보내고 끝내는 용도 => fetch 사용 : 서버 웹소켓 연결 시작 (Spring의 KisWebSocket 실행용)
        fetch("http://localhost:9999/asset/ws-start")
        .then(function(res) {
            if (!res.ok) console.error("WS Start 실패", res.status);
        })
        .catch(function(err) {
            console.error("WS 연결 오류", err)
        }); 
    }, []);

    useEffect(function() { //자산목록 처음 렌더링시에만 필요하기때문에 useEffect 사용.

            getAsset() //api.js 에 선언된 axiosInstance getAsset() 자산리스트를 받아옴. 
                .then(function(res) { 
                    //console.log(res); //객체리스트 반환받음.

                    const updatedAssetList = res.map(function(asset) {
                        return {
                            ...asset,
                            currentPrice: 0, //나중에 EventSource 로 받아올 새로운 값으로 리랜더링 되기 이전, 초기값 세팅.
                            priceChange: 0,
                            priceChangeRate: 0,
                            low52: asset.low52,
                            high52: asset.high52
                        };
                    });

                    setAssetList(updatedAssetList); 
                    setLoading(false);
                })  
                .catch(function(err) { 
                    setError(err.message);
                    setLoading(false); 
                });
            }, []);

        //실시간 구독 == 이벤트 리스너 : 실시간으로 종목별 가격을 불러오기위해 EventSource 사용
        useEffect(function() {

        const serverUrl = import.meta.env.VITE_BACK_SERVER;
        const eventSource = new EventSource(serverUrl + "/asset/price-stream");

        eventSource.addEventListener("asset", function (event) { //"asset" 이벤트 오면 실행됨
        //console.log(event.data);         
        if (!event || !event.data) return; //event.data 없으면 중단 (ping 같은 거 거르기) 

        //!event : event가 null, undefined, false 등
        //!event.data : event.data가 null, undefined, "", 0, 등
        
        const priceData = JSON.parse(event.data); //수신한 Asset JSON

        //console.log(priceData);

                //ping 같은 이벤트 무시
                if (!priceData.assetCode || priceData.currentPrice == null) return;
                
                setAssetList(function(prevList) { //여기서 prevList는 선언 없이, React가 알아서 최신 상태값을 전달해주는 함수 인자
                    return prevList.map(function(asset) {
                       if (asset.assetCode === priceData.assetCode) {
                            return {
                                ...asset,
                                currentPrice : priceData.currentPrice, //실시간 가격 반영
                                priceChange: priceData.priceChange,
                                priceChangeRate: priceData.changeRate
                            };
                       }else {
                        return asset; //나머지는 그대로
                       }
                    });
                });
            });
        
        return function() {
            eventSource.close(); //컴포넌트가 화면에서 사라질 때 실행
        }
    }, []);

    function isMarketClosed() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    return hour < 9 || (hour === 15 && minute > 30) || hour > 15;
    }   
        
    /*

    //워치리스트/즐겨찾기에 추가
    const [watchlist, setWatchlist] = useState([]); // 즐겨찾기 종목코드 리스트

    function handleToggleWatchlist(assetCode) {
        setWatchlist(function(prevList) {
            if (prevList.includes(assetCode)) {
                return prevList.filter(function(code) {
                    return code !== assetCode; // <-- 해당 종목코드 제거
                    });
            } else {
                return [...prevList, assetCode]; // <-- 추가
            }
        });
    }   

    */

    return(
        <>
        <section className="section asset-list">
            <div className="page-title">종목리스트</div>
        
        {
        loading
        ? <p>로딩 중…</p>
        : error
            ? <p>에러: {error}</p>
            : (
            <table className="tbl asset-table asset-list">
                <thead>
                    <tr>
                        <th></th>
                        <th style={{width:"25%"}}>종목명</th>
                        <th style={{width:"15%"}}>현재가</th>
                        <th style={{width: "30%"}}>52주 최저 최고가</th>
                        <th style={{width:"15%"}}>변동률(%)</th>
                        <th style={{width:"15%"}}>매수/매도</th>
                    </tr>
                </thead>
                <tbody>
                {assetList.map(function(asset, index) {



                    return (
                    <tr key={"asset" + index}>
                        <td>
                            
                           <span
                                //className="favorite-star"
                                //onClick={function() { //즐겨찾기 '워치리스트' 에 종목 추가
                                //    handleToggleWatchlist(asset.assetCode); // <-- 클릭 시 토글
                                //}}
                                >
                                {/*{watchlist.includes(asset.assetCode) ? "★" : "☆"} {/* <-- 즐겨찾기 여부에 따라 별 모양 변경 */}
                            </span>

                        </td>
                        <td><Link to={"/asset/" + asset.assetCode}>{asset.assetName}</Link></td>
                        <td>{asset.currentPrice != null ? asset.currentPrice == 0 ? "로딩 중" : parseFloat(asset.currentPrice).toFixed(0) : ""}</td>
                        <td>

                            
                            <div className="range-cell">
                            <div className="range-bar">
                                <div className="range-fill"
                                    style={{
                                    width: `${((asset.currentPrice - asset.low52) / (asset.high52 - asset.low52)) * 100}%`
                                    }}
                                ></div>

                                {/* 화살표 표시용 */}
                                <div className="range-indicator"
                                    style={{
                                    left: `${((asset.currentPrice - asset.low52) / (asset.high52 - asset.low52)) * 100}%`
                                    }}
                                >
                                    ▲
                                </div>
                                </div>

                            <div className="range-labels">
                                <span className="low">{asset.low52}</span>
                                <span className="high">{asset.high52}</span>
                            </div>
                            </div>

           

                        </td>
                        <td className={
                            asset.priceChangeRate != null && parseFloat(asset.priceChangeRate) > 0 
                                ? 'positive' 
                                : asset.priceChangeRate != null && parseFloat(asset.priceChangeRate) === 0 
                                    ? (isMarketClosed() ? 'closed' : 'zero')
                                    : 'negative'
                        }>
                            {
                                asset.priceChangeRate != null && parseFloat(asset.priceChangeRate) === 0 
                                    ? (isMarketClosed() ? '장마감' : '0.00%')
                                    : (asset.priceChangeRate != null ? parseFloat(asset.priceChangeRate).toFixed(2) + '%' : "")
                            }
                        </td>



                        <td>
                            <button className='buy'>매수</button>
                            <button className='sell'>매도</button>
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
            )
        }
        </section>
        </>
        
    )
}