import { useEffect, useState } from 'react';
import { getAsset } from '../../utils/api';
import './asset.css';
import { Link } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import createInstance from '../../axios/Interceptor';

export default function AssetList() {
  const [assetList, setAssetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [tradeType, setTradeType] = useState("BUY");
  const [amount, setAmount] = useState(1);
  const [walletCash, setWalletCash] = useState(0);

  // 총 거래 금액 계산
  const totalPrice = selectedAsset != null ? selectedAsset.currentPrice * amount : 0;

  // 매수 시 보유 현금 부족 여부
  const notEnoughCash = tradeType === "BUY" && totalPrice > walletCash;

  const { loginMember, kakaoMember } = useUserStore();
  let userNo;
  if(loginMember){
    userNo = loginMember.userNo
  }else if(kakaoMember){
    userNo = kakaoMember.userNo
  }else{
    userNo = null;
  }

  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();

  // 컴포넌트 첫 렌더링 시 WebSocket 연결 요청
  useEffect(function () {
    fetch("http://localhost:9999/asset/ws-start")
      .then(function (res) {
        if (!res.ok) console.error("WS Start 실패", res.status);
      })
      .catch(function (err) {
        console.error("WS 연결 오류", err);
      });
  }, []);

  // 자산 목록 초기 조회
  useEffect(function () {
    getAsset()
      .then(function (res) {
        const updatedAssetList = res.map(function (asset) {
          return {
            ...asset,
            currentPrice: 0,
            priceChange: 0,
            priceChangeRate: 0,
            low52: asset.low52,
            high52: asset.high52,
          };
        });
        setAssetList(updatedAssetList);
        setLoading(false);
      })
      .catch(function (err) {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // SSE 실시간 가격 업데이트
  useEffect(function () {
    const eventSource = new EventSource(serverUrl + "/asset/price-stream");

    eventSource.addEventListener("asset", function (event) {
      if (!event || !event.data) return;

      const priceData = JSON.parse(event.data);
      if (!priceData.assetCode || priceData.currentPrice == null) return;

      setAssetList(function (prevList) {
        return prevList.map(function (asset) {
          if (asset.assetCode === priceData.assetCode) {
            return {
              ...asset,
              currentPrice: priceData.currentPrice,
              priceChange: priceData.priceChange,
              priceChangeRate: priceData.changeRate,
            };
          }
          return asset;
        });
      });
    });

    return function () {
      eventSource.close();
    };
  }, []);

  // 로그인 회원 지갑 정보 조회
  useEffect(function () {
    if (!userNo) return; // userNo 없으면 요청 안 함

    const options = {
      url: serverUrl + "/wallet/" + userNo,
      method: "get",
    };

    axiosInstance(options)
      .then(function (res) {
        setWalletCash(res.data.resData.walletCashBalance);
      })
      .catch(function (err) {
        console.error("지갑 조회 오류:", err);
      });
  }, [userNo]);

  // 주식 시장 마감 여부 판단
  function isMarketClosed() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    return hour < 9 || (hour === 15 && minute > 30) || hour > 15;
  }

  // 거래 요청 함수 (컴포넌트 내부에 선언)
  function handleTradeSubmit(e) {
    if (selectedAsset == null) return;
    if (notEnoughCash) return;

    alert(tradeType + " 요청 완료 (총 금액: " + totalPrice + ")");
    setSelectedAsset(null);
    console.log(selectedAsset.assetNo);

    
        const options = {
          url: serverUrl + "/asset/insert", 
          method: "post",
          data: {
            userNo: userNo,
            tradeType: tradeType,
            amount: amount,
            currentPrice: selectedAsset.currentPrice,
            assetNo : selectedAsset.assetNo
          },
        };
    
        axiosInstance(options)
          .then(function (res) {
            
          })
    
    }
    

  return (
    <>
      <section className="section asset-list">
        <div className="page-title">종목리스트</div>

        {loading ? (
          <p>로딩 중…</p>
        ) : error ? (
          <p>에러: {error}</p>
        ) : (
          <table className="tbl asset-table asset-list">
            <thead>
              <tr>
                <th></th>
                <th style={{ width: "25%" }}>종목명</th>
                <th style={{ width: "15%" }}>현재가</th>
                <th style={{ width: "30%" }}>52주 최저 최고가</th>
                <th style={{ width: "15%" }}>변동률(%)</th>
                <th style={{ width: "15%" }}>매수/매도</th>
              </tr>
            </thead>
            <tbody>
              {assetList.map(function (asset, index) {
                return (
                  <tr key={"asset" + index}>
                    <td></td>
                    <td>
                      <Link to={"/asset/" + asset.assetCode}>{asset.assetName}</Link>
                    </td>
                    <td>
                      {asset.currentPrice != null
                        ? asset.currentPrice === 0
                          ? "로딩 중"
                          : parseFloat(asset.currentPrice).toFixed(0)
                        : ""}
                    </td>
                    <td>
                      <div className="range-cell">
                        <div className="range-bar">
                          <div
                            className="range-fill"
                            style={{
                              width:
                                ((asset.currentPrice - asset.low52) /
                                  (asset.high52 - asset.low52)) *
                                  100 +
                                "%",
                            }}
                          ></div>
                          <div
                            className="range-indicator"
                            style={{
                              left:
                                ((asset.currentPrice - asset.low52) /
                                  (asset.high52 - asset.low52)) *
                                  100 +
                                "%",
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
                    <td
                      className={
                        asset.priceChangeRate != null && parseFloat(asset.priceChangeRate) > 0
                          ? "positive"
                          : asset.priceChangeRate != null && parseFloat(asset.priceChangeRate) === 0
                          ? isMarketClosed()
                            ? "closed"
                            : "zero"
                          : "negative"
                      }
                    >
                      {asset.priceChangeRate != null && parseFloat(asset.priceChangeRate) === 0
                        ? isMarketClosed()
                          ? "장마감"
                          : "0.00%"
                        : asset.priceChangeRate != null
                        ? parseFloat(asset.priceChangeRate).toFixed(2) + "%"
                        : ""}
                    </td>
                    <td>
                      <button
                        onClick={function () {
                          setSelectedAsset(asset);
                          setTradeType("BUY");
                          setAmount(1);
                        }}
                      >
                        매수
                      </button>
                      <button
                        onClick={function () {
                          setSelectedAsset(asset);
                          setTradeType("SELL");
                          setAmount(1);
                        }}
                      >
                        매도
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* 매수/매도 모달 */}
        {selectedAsset != null && (
          <div className="modal">
            <div className="modal-content">
              <h3>{tradeType === "BUY" ? "매수" : "매도"} 확인</h3>
              <p>종목명: {selectedAsset.assetName}</p>
              <p>현재가: {selectedAsset.currentPrice.toLocaleString()} 원</p>
              <p>현재 회원 자산: {walletCash.toLocaleString()} 원</p>

              <label>
                수량:
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={function (e) {
                    setAmount(parseInt(e.target.value));
                  }}
                />
              </label>

              <p>총 금액: {totalPrice.toLocaleString()} 원</p>

              {notEnoughCash && <p style={{ color: "red" }}>보유 현금이 부족합니다.</p>}

              <button onClick={handleTradeSubmit} disabled={notEnoughCash}>
                {tradeType === "BUY" ? "매수" : "매도"} 실행
              </button>
              <button
                onClick={function () {
                  setSelectedAsset(null);
                }}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

