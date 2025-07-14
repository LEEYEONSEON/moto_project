import { useEffect, useState } from "react";
import "./portfolio.css"; // 필요 시 스타일 작성
import useWsStore from "../../store/useWsStore";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useUserStore from '../../store/useUserStore';
import createInstance from '../../axios/Interceptor';


export default function Portfolio() {
  
  const [myAsset, setMyAsset] = useState([]); //내 보유 자산 불러오기
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { loginMember, kakaoMember } = useUserStore();




  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();

    //보유중인 자산 불러오기
    useEffect(function() {

            let userNo;
                if(loginMember){
                    userNo = loginMember.userNo
                }else if(kakaoMember){
                    userNo = kakaoMember.userNo
                }else{
                    userNo = null;
            }
        //console.log(userNo);
        let options = {
            url: serverUrl + "/portfolio/" + userNo, // ← userNo path로 전달
            method: "get"
        }
        
        axiosInstance(options) 
        .then(function(res) {

            if (res.data.resData!=null) {
            //console.log(res.data.resData);
            const assetList = res.data.resData;

            const updatedAssetList = assetList.map(function(asset) {
                
                return {
                    ...asset,
                    currentPrice: 0,
                    profit: 0,
                    profitRate: 0
                };

            
            });
            //console.log(updatedAssetList);
            setMyAsset(updatedAssetList); // ← 리스트 저장
        
            }

            setLoading(false);
        })
        .catch(function(err) {
            console.error("포트폴리오 조회 실패", err);
            setLoading(false);
        });
    
    }, []);


    
    // SSE 실시간 가격 업데이트
    useEffect (function () {
        const eventSource = new EventSource(serverUrl + "/asset/price-stream");
        eventSource.addEventListener("asset", function (event) {
        if (!event || !event.data) return;

        const priceData = JSON.parse(event.data);
        if (!priceData.assetCode || priceData.currentPrice == null) return;

        setMyAsset(function (prevList) {
            return prevList.map(function (asset) {
            if (asset.assetCode === priceData.assetCode) {
                const newPrice = priceData.currentPrice;
                const profit = (newPrice - asset.avgBuyPrice) * asset.quantity;
                const profitRate = asset.avgBuyPrice === 0 ? 0 : ((newPrice - asset.avgBuyPrice) / asset.avgBuyPrice) * 100;

                return {
                    ...asset,
                    currentPrice: newPrice,
                    profit: profit,
                    profitRate: profitRate.toFixed(2)
                };
            }
            
            return asset;
            });
        });
        });

    }, []);

    



    // 주식 시장 마감 여부 판단
    function isMarketClosed() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        return hour < 9 || (hour === 15 && minute > 30) || hour > 15;

    }   

    




  return (
    <section className="section asset-list">
        <div className="page-title">내 포트폴리오</div>
        <table className="tbl asset-table asset-list">
        <thead>
            <tr>
            <th>자산명</th>
            <th>현재가₩</th>
            <th>보유수량</th>
            <th>평균단가₩</th>
            <th>손익(P/L)₩</th>
            <th>손익률(%)</th>
            </tr>
        </thead>
        <tbody>
            {myAsset.map(function (item) {
            const profit = (item.currentPrice - item.avgBuyPrice) * item.quantity;
            const profitRate = (
                ((item.currentPrice - item.avgBuyPrice) / item.avgBuyPrice) *
                100
            ).toFixed(2);

            let className = "";
            //console.log(item.currentPrice);
            if (profit > 0) {
                className = "positive";
            } else if (profit == 0) {
                className = isMarketClosed() ? "closed" : "zero";
            } else if (item.currentPrice == 0) {
                className = "zero";
            } else {
                className = "negative";
            }

            return (
                <tr key={item.assetCode}>
                <td>{item.assetName}</td>
                <td className={item.currentPrice ? "" : "zero"}>{item.currentPrice ? item.currentPrice.toLocaleString() : "로딩 중..."}</td>
                <td>{item.quantity}</td>
                <td>{item.avgBuyPrice.toLocaleString()}</td>
                <td className={className}>
                    {item.currentPrice 
                    ?
                    profit.toLocaleString()
                    : "로딩 중..."}
                </td>
                <td className={className}>
                    {item.currentPrice 
                    ?
                    profitRate + "%"
                    : "로딩 중..."
                    }
                    
                </td>
                </tr>
            );
            })}
        </tbody>
        </table>
    </section>
    );

}
