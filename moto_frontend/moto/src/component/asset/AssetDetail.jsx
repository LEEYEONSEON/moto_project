import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssetByCode } from "../../utils/api";
import './asset.css';
import AssetChart from "./assetChart";

export default function AssetDetail() {
  const { assetCode } = useParams();
  const [asset, setAsset] = useState(null);

  useEffect(function () {
    getAssetByCode(assetCode)
      .then(function (res) {
        setAsset(res);
      })
      .catch(function (err) {
        console.error("자산 상세 조회 실패", err);
      });


    const eventSource = new EventSource("/api/price-stream");
    eventSource.addEventListener("price", function (event) {
        const data = JSON.parse(event.data);
        if (data.s === assetCode) {
        setAsset(function (prev) {
            return {
            ...prev,
            currentPrice: data.p,
            priceChangeRate: prev.prevClose
                ? ((data.p - prev.prevClose) / prev.prevClose) * 100
                : 0,
            };
        });
        }
    });

return function(){
    eventSource.close();
  };
}, [assetCode]);


  if (!asset) {
    return <p>자산 정보를 불러오는 중...</p>;
  }

  return (

    <section className="section asset-list">
        <div className="page-title">{asset.assetName}</div>
            <table className="tbl asset-table asset-detail">
                <tbody>
                    <tr>
                        <th>현재가</th>
                        <td>${asset.currentPrice}</td>
                    </tr>
                    <tr>
                        <th>전일 종가:</th>
                        <td>${asset.prevClose}</td>
                    </tr>
                    <tr>
                        <th>변동률: </th>
                        <td>{asset.priceChangeRate?.toFixed(2)}%</td>
                    </tr>
                    <tr>
                        <th>52주 최저가:</th>
                        <td>${asset.low52}</td>
                    </tr>
                    <tr>
                        <th>52주 최고가: </th>
                        <td>${asset.high52}</td>
                    </tr>
                </tbody> 

             

                {/*} <AssetChart assetCode={asset.assetCode} /> */}   
    </table>
    </section>
  );
}