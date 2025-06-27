
//asset API 호출 함수
import { useEffect, useState } from 'react';
import { getAsset } from '../../utils/api';

export default function AssetList() {
 
    const [assetList, setAssetList] = useState([]); //API 로 받아온 자산 목록
    const [loading, setLoading] = useState(true); //로딩 중 표시
    const [error, setError] = useState(null); //에러메시지

     useEffect(function() {
            getAsset()  
                .then(function(res) { 
                    setAssetList(res); 
                    setLoading(false);
                })  
                .catch(function(err) { 
                    setError(err.message);
                    setLoading(false); 
                });
            }, []);

       useEffect(() => {
        const eventSource = new EventSource("/api/price-stream");

        eventSource.addEventListener("price", function (event) {
         console.log(event.data);
         if(!event?.data) return;
         const priceData = JSON.parse(event.data);  // {s: "AAPL", p: 123.45, ...} 이런 형태

            setAssetList(prevList =>
                prevList.map(asset =>
                asset.assetCode === priceData.s
                    ? {
                        ...asset,
                        currentPrice: priceData.p, // c일 수도 있으니 구조 확인
                        priceChangeRate: ((priceData.p - asset.prevClose) / asset.prevClose) * 100,
                    }
                    : asset
                )
            );
         });

        return () => {
            eventSource.close();
        };
        }, []); 

    return(
        <>
        <section className="section">
            <div className="page-title">종목리스트</div>
        
        {
        loading
        ? <p>로딩 중…</p>
        : error
            ? <p>에러: {error}</p>
            : (
            <table className="tbl asset-table">
                <thead>
                    <tr>
                        <th style={{width:"25%"}}>코드</th>
                        <th style={{width:"25%"}}>종목명</th>
                        <th style={{width:"25%"}}>현재가</th>
                        <th style={{width:"25%"}}>변동률(%)</th>
                    </tr>
                </thead>
                <tbody>
                {assetList.map(function(asset, index) {



                    return (
                    <tr key={"asset" + index}>
                        <td>{asset.assetCode}</td>
                        <td>{asset.assetName}</td>
                        <td>{asset.currentPrice > 0 ? asset.currentPrice : asset.prevClose}</td>
                        <td className={asset.priceChangeRate>=0?'positive':'negative'}>
                        {isNaN(asset.priceChangeRate)?'-':asset.priceChangeRate.toFixed(2)+'%'}
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