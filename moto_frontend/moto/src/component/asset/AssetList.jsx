//asset API 호출 함수
import { useEffect, useState } from 'react';
import { getAsset } from '../../utils/api';
import './asset.css';
import { Link } from 'react-router-dom';
export default function AssetList() {
 
    const [assetList, setAssetList] = useState([]); //API 로 받아온 자산 목록
    const [loading, setLoading] = useState(true); //로딩 중 표시
    const [error, setError] = useState(null); //에러메시지

     useEffect(function() {
            getAsset()  
                .then(function(res) { 
                    const updated = res.map(function(asset) {
                        return {
                            ...asset,
                            currentPrice: asset.prevClose,
                            priceChangeRate: 0,

                        };
                    });

                    setAssetList(updated); 
                    setLoading(false);
                })  
                .catch(function(err) { 
                    setError(err.message);
                    setLoading(false); 
                });
            }, []);

       useEffect(function() {
        const eventSource = new EventSource("/api/price-stream");

        eventSource.addEventListener("price", function (event) {
         console.log(event.data);
         if(!event?.data) return;

         const parsed = JSON.parse(event.data); //{data : [...]}
        //가격 배열 하나씩 처리
        if(Array.isArray(parsed.data)) {
            parsed.data.forEach(function(priceData) {
                //ping 같은 이벤트 무시
                if (!priceData.s || !priceData.p) return;
                
                setAssetList(function(prevList) {
                    return prevList.map(function(asset) {
                       if (asset.assetCode.toUpperCase() === priceData.s.toUpperCase()){
                            const newPrice = priceData.p;
                            const prevClose = asset.prevClose;

                            const priceChangeRate = (!prevClose || prevClose ===0)
                            ? 0 
                            : ((newPrice - prevClose) /prevClose) * 100;

                            return {
                                ...asset,
                                currentPrice : newPrice,
                                priceChangeRate : priceChangeRate,
                            };
                       }
                       return asset;
                    });
                });
            });
        }
        });

        return function() {
            eventSource.close();
        }
    }, []);
        


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
                        <td><Link to={"/asset/" + asset.assetCode}>{asset.assetName}</Link></td>
                        <td>{asset.currentPrice > 0 ? asset.currentPrice.toFixed(2) : asset.prevClose}</td>
                        <td>
                             {asset.low52 && asset.high52 ? (
                                <div className="range-cell">
                                <div className="range-labels">
                                    <span>{asset.low52}</span>
                                    <span>{asset.high52}</span>
                                </div>
                                <div className="range-bar">
                                    <div
                                    className="range-fill"
                                    style={{
                                        width: `${((asset.currentPrice - asset.low52) / (asset.high52 - asset.low52)) * 100}%`
                                    }}
                                    ></div>
                                </div>
                                </div>
                            ) : '-'}



                        </td>
                        <td className={
                            asset.priceChangeRate > 0 
                            ?'positive'
                                : asset.priceChangeRate == 0
                                    ? 'zero' 
                                        : 'negative'}>
                        {asset.priceChangeRate == 0 ?'장마감':asset.priceChangeRate.toFixed(2)+'%'}
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