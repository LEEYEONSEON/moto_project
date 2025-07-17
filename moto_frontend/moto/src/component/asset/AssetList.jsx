import { useEffect, useState } from 'react';
import { getAsset } from '../../utils/api';
import './asset.css';
import useWsStore from "../../store/useWsStore";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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

  //웹 소켓 사용해서 KIS 한국 투자증권 시세 연결 시작 하기 위한 용도 == 한번만 실행되도록 Zustand 로 wsStarted 상태 관리
    const { wsStarted, setWsStarted } = useWsStore();

        useEffect(function () {
        if (!wsStarted) {
            fetch(serverUrl + "/asset/ws-start")
            .then(function(res) {
                if (res.ok) {
                setWsStarted(true); // 한번만 실행되게!
                }
            })
            .catch(function(err) {
            
            });
        }
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
              low52: priceData.currentPrice < asset.low52 ? priceData.currentPrice : asset.low52,
              high52: priceData.currentPrice > asset.high52 ? priceData.currentPrice : asset.high52
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
        
    //워치리스트/즐겨찾기에 추가
    const [watchlist, setWatchlist] = useState([]); // 즐겨찾기 종목코드 리스트
    //여기서 prevList 는 워치리스트의 최신 상태! == prevList는 React가 보장해주는 최신 상태
    const navigate = useNavigate();
    let member = null;
    
    if(loginMember != null){
        member = loginMember;
    }else if(kakaoMember != null){
        member = kakaoMember;
    }

    //워치리스트 조회
    useEffect(function() {
         
        if (member != null) { // 로그인 되어 있을 때만 요청
            let userNo = member.userNo;
            
            let options = {
                url: serverUrl + "/watchlist/" + userNo, // ← userNo path로 전달
                method: "get"
            }
            


            axiosInstance(options) 
            .then(function(res) {

                const assetList = res.data.resData;
               
                if (res.data.resData != null) {
                    const newWatchlist = (assetList.map(function(item, index) {
                        return item.assetCode;
                    }))
                
                    setWatchlist(newWatchlist); // ← 리스트 저장
                }




            })
            .catch(function(err) {
                console.error("워치리스트 조회 실패", err);
            });
        }
    }, [member]); 
    





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

            if (watchlist.includes(assetCode)) {
                
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
                            return prevList.filter(function(code) { // 기존 종목코드 배열(prevList)에서 code 들과 제거 대상(assetCode)를 비교하여, 제거 대상 assetCode 만 필터링해서 나머지만 반환.
                                return code !== assetCode;
                            });
                        });
                    })    

            } else {

                let options = {
                    url: serverUrl + "/watchlist",
                    method: "post",
                    data: {
                        userNo: userNo,
                        assetCode: assetCode
                    }
                }

                axiosInstance(options) // 즐겨찾기 추가 요청
                .then(function(res) {
                    setWatchlist(function(prevList) {
                        return [...prevList, assetCode]; //기존 배열에 새 종목 코드 추가
                    });
                })
            }
        }


  }



  // 거래 요청 함수 (컴포넌트 내부에 선언)
  function handleTradeSubmit(e) {
    if (selectedAsset == null) return;
    if (notEnoughCash) return;

    alert(tradeType + " 요청 완료 (총 금액: " + totalPrice + ")");
    setSelectedAsset(null);
   
    
      if(tradeType == 'BUY'){
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
            Swal.fire({
              title : "알림",
              text : res.data.clientMsg,
              icon : res.data.alertIcon,
              confirmButtonText : "확인"
            }).then(function(res){
              if(res.isConfirmed){
                // 🎯 지갑 잔액 다시 조회
                const walletOptions = {
                  url: serverUrl + "/wallet/" + userNo,
                  method: "get"
                };
                axiosInstance(walletOptions).then(function (res) {
                  setWalletCash(res.data.resData.walletCashBalance);
                });

                // 모달 닫기
                setSelectedAsset(null);
              }
            })
          })
    }
    }


    console.log(assetList)
  return (

      <section className="section asset-list">
        <div className="page-title asset-title">종목리스트</div>

        {loading ? (
          <p>로딩 중…</p>
        ) : error ? (
          <p>에러: {error}</p>
        ) : (
          <table className="tbl asset-table asset-list">
            <thead>
              <tr>
                <th style={{ width: "5%" , textAlign : "center"  }}></th>
                <th style={{ width: "15%" , textAlign : "center" }}>종목명</th>
                <th style={{ width: "15%", textAlign : "center"  }}>현재가</th>
                <th style={{ width: "30%", textAlign : "center" }}>52주 최저 최고가</th>
                <th style={{ width: "15%", textAlign : "center"  }}>변동률(%)</th>
                <th style={{ width: "15%", textAlign : "center"  }}>매수</th>
              </tr>
            </thead>
            <tbody>

              {assetList.map(function (asset, index) {
                return(
                    <tr key={"asset" + index}>
                        <td>
                            
                           <span
                                className="favorite-star"
                                onClick={function() { //즐겨찾기 '워치리스트' 에 종목 추가
                                    handleToggleWatchlist(asset.assetCode); // <-- 클릭 시 토글
                                }}
                                >
                                {watchlist.includes(String(asset.assetCode)) ? "★" : "☆"}  {/* <-- 즐겨찾기 여부에 따라 별 모양 변경 */}
                            </span>
                     </td>
                    <td style={{ textAlign : "center"  }}>
                      <Link to={"/asset/" + asset.assetCode}>{asset.assetName}</Link>
                    </td>
                    <td style={{  textAlign : "right", paddingRight : "80px"}}>
                      {asset.currentPrice != null
                        ? asset.currentPrice === 0
                          ? "로딩 중"
                          : parseFloat(asset.currentPrice).toFixed(0)
                        : ""}
                    </td>
                    <td >
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
                          <span className="low">
                            {asset.low52}</span>
                          <span className="high">{asset.high52}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign : "center"  }}
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
                    
                   <th style={{ textAlign : "center"  }}>
                      <button className='trade-button buy-button'
                        onClick={function () {
                          setSelectedAsset(asset);
                          setTradeType("BUY");
                          setAmount(1);
                        }}
                      >매수</button>
                      
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* 매수/매도 모달 */}
        {selectedAsset != null &&  selectedAsset.currentPrice != 0 &&(
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
                {tradeType == "BUY" ? "매수" : "매도"} 실행
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
  );
}