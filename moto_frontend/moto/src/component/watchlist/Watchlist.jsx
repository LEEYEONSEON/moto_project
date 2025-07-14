import { useEffect, useState } from "react";
import '../../component/asset/asset.css'
import { Link, useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import useWsStore from "../../store/useWsStore";

//워치리스트 리스트
export default function Watchlist() {
        
    const [watchlist, setWatchlist] = useState([]); //서버에서 받아온 즐겨찾기 목록 
    const [watchlistCode, setWatchlistCode] = useState([]); //즐겨찾기 토글 위한, 종목별 코드 리스트.
    const [loading, setLoading] = useState(true); //로딩 중 표시
    const [error, setError] = useState(null); //에러 메시지

    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    const axiosInstance = createInstance();

    const {loginMember, kakaoMember} = useUserStore(); //userNo 가져오기
    const navigate = useNavigate();
    let member = null;
    
    if(loginMember != null){
        member = loginMember;
    }else if(kakaoMember != null){
        member = kakaoMember;
    }

    //워치리스트 목록 조회 == 처음 랜더링 시에만 필요 (불러올 항목, assetCode, assetName, high_52, low_52)
    useEffect(function() {
         
        if (member != null) { // 로그인 되어 있을 때만 요청
            let userNo = member.userNo;
            
            let options = {
                url: serverUrl + "/watchlist/" + userNo, // ← userNo path로 전달
                method: "get"
            }
            
            axiosInstance(options) 
            .then(function(res) {
                if (res.data.resData!=null) {

                const assetList = res.data.resData;

                const updatedAssetList = assetList.map(function(asset) {
                    return {
                        ...asset,
                        currentPrice: 0, //나중에 EventSource 로 받아올 새로운 값으로 리랜더링 되기 이전, 초기값 세팅.
                        priceChange: 0,
                        priceChangeRate: 0,
                        low52: asset.low52,
                        high52: asset.high52
                    };
                });
                setWatchlist(updatedAssetList); // ← 리스트 저장
                
                const newWatchlistCode = assetList.map(function(item, index) {
                    return item.assetCode;
                });
                
                setWatchlistCode(newWatchlistCode);
                }

                setLoading(false);
            })
            .catch(function(err) {
                console.error("워치리스트 조회 실패", err);
                setLoading(false);
            });
        }
    }, []);


    //실시간 구독 == 이벤트 리스너 : 실시간으로 종목별 가격을 불러오기위해 EventSource 사용
    useEffect(function() {

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
                
                setWatchlist(function(prevList) { //여기서 prevList는 선언 없이, React가 알아서 최신 상태값을 전달해주는 함수 인자
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
    
    








    //즐겨찾기 토글
    function handleToggleWatchlist(assetCode) {
            
        if(member == null) {
        //로그인 하지 않은 회원인 경우
            Swal.fire({
                title : "알림",
                text:"로그인후 이용 가능합니다.",
                icon: "warning",
                confirmButtonText:"확인"
            });

            navigate("/login");

        }else {
        //로그인한 회원일경우.
            let userNo = member.userNo;
            let options = {
                url: serverUrl + "/watchlist",
                method: "delete",
                params: { // <-- delete는 data 대신 params 사용해야 함!!
                    userNo: userNo,
                    assetCode: assetCode
                }
            }

            axiosInstance(options)// 즐겨찾기 제거 요청
            .then(function(res) {
                setWatchlist(function(prevList) {
                    return prevList.filter(function(asset) { // 기존 종목코드 배열(prevList)에서 code 들과 제거 대상(assetCode)를 비교하여, 제거 대상 assetCode 만 필터링해서 나머지만 반환.
                        return asset.assetCode !== assetCode;
                    });
                });
            })    

        
        }


            
        }

    return (
        <>

        {watchlist.length === 0 ? (
            <section className="section asset-list">
            <div className="page-title">워치리스트</div>
            <p>등록된 워치리스트가 없습니다.</p>
            </section>
        ) : (
        <section className="section asset-list">
            <div className="page-title">워치리스트</div>
        
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
                {watchlist.map(function(asset, index) {

                    return (
                    <tr key={"asset" + index}>
                        <td>
                            
                           <span
                                className="favorite-star"
                                onClick={function() { //즐겨찾기 '워치리스트' 에 종목 추가
                                    handleToggleWatchlist(asset.assetCode); // <-- 클릭 시 토글
                                }}
                                >
                                {watchlistCode.includes(String(asset.assetCode)) ? "★" : "☆"}  {/* <-- 즐겨찾기 여부에 따라 별 모양 변경 */}
                            </span>

                        </td>
                        <td><Link to={"/asset/" + asset.assetCode}>{asset.assetName}</Link></td>
                        <td className={asset.currentPrice != null ? asset.currentPrice == 0 ? "zero" : parseFloat(asset.currentPrice).toFixed(0) : ""}>
                            {asset.currentPrice != null ? asset.currentPrice == 0 ? "로딩 중..." : parseFloat(asset.currentPrice).toFixed(0) : ""}</td>
                        <td>

                            
                            <div className="range-cell">
                            <div className="range-bar">
                            <div
                            className="range-fill"
                            style={{
                                width:

                                
                                asset.currentPrice < asset.low52 
                                ? "0%" 
                                :asset.currentPrice > asset.high52 
                                ? "100%"
                                :
                                ((asset.currentPrice - asset.low52) / (asset.high52 - asset.low52)) * 100 + "%"
                                }}>
                                
                            </div>

                                {/* 화살표 표시용 */}
                                <div
                                    className="range-indicator"
                                    style={{
                                    left:
                                        asset.currentPrice < asset.low52 
                                        ? "0%" 
                                        :asset.currentPrice > asset.high52 
                                        ? "100%"
                                        : ((asset.currentPrice - asset.low52) / (asset.high52 - asset.low52)) * 100 + "%",
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
                                asset.currentPrice != null && parseFloat(asset.currentPrice) === 0 
                                    ? (isMarketClosed() ? '장마감' : '로딩 중...')
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
        )}
        </>



    )


}