import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from "../common/PageNavi";

export default function PostView() {
  const [reqPage, setReqPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({});
  const [postList, setPostList] = useState([]); // 게시글 목록
  const { loginMember } = useUserStore();
  const [fileList, setFileList] = useState([]); // 게시글에 첨부된 파일 목록 상태

  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();

  useEffect(function() {
    let options = {};
    options.url = serverUrl + "/post/getList/" + reqPage;
    options.method = "get";

    axiosInstance(options)
      .then(function(res) {
        let newPostList = res.data.resData.postInfo.postList || []; // 게시글 목록
        let newFileList = res.data.resData.postInfo.fileList || []; // 파일 목록

        // 게시글 목록 저장
        setPostList(function(prevPostList) {
          let newPostLists = [...prevPostList]; // 이전의 게시글 목록을 복사
          newPostLists[reqPage - 1] = newPostList; // 새로운 페이지의 게시글을 추가
          return newPostLists;
        });

        // 파일 목록 저장
        setFileList(function(prevFileList) {
          return [...prevFileList, ...newFileList]; // 새로운 파일 목록을 추가
        });

        setPageInfo(res.data.resData.pageInfo);
      });
  }, [reqPage]);

  console.log(postList);
  console.log(fileList);

  // 각 게시글마다 슬라이드 이미지를 위한 상태 관리
  const [imageIndexes, setImageIndexes] = useState([]);

  //---------------------------------- 구글링 항목 -----------------------------------------------------------//
  function NextImage(postIndex) {
    setImageIndexes(function(prevIndexes) {
      let newIndexes = [...prevIndexes]; // 기존 인덱스를 복사

      // 해당 게시글의 파일들만 필터링
      let postFiles = fileList.filter(function(file) {
        return file.postNo === postList[reqPage - 1][postIndex].postNo;
      });

      // 다음 이미지로 이동 (반복)
      let nextIndex = newIndexes[postIndex] + 1;

      // 만약 nextIndex가 범위를 벗어나면, 현재 인덱스를 유지
      if (nextIndex >= postFiles.length) {
        newIndexes[postIndex] = newIndexes[postIndex]; // 인덱스를 변경하지 않고 유지
      } else {
        newIndexes[postIndex] = nextIndex; // 유효한 인덱스면 변경
      }

      return newIndexes;
    });
  }

  // 슬라이드에서 이전 이미지를 보여주는 함수
  function PrevImage(postIndex) {
    setImageIndexes(function(prevIndexes) {
      let newIndexes = [...prevIndexes]; // 기존 인덱스를 복사

      // 해당 게시글의 파일들만 필터링
      let postFiles = fileList.filter(function(file) {
        return file.postNo === postList[reqPage - 1][postIndex].postNo;
      });

      // 이전 이미지로 이동 (반복)
      let prevIndex = newIndexes[postIndex] - 1;

      // 만약 prevIndex가 범위를 벗어나면, 현재 인덱스를 유지
      if (prevIndex < 0) {
        newIndexes[postIndex] = newIndexes[postIndex]; // 인덱스를 변경하지 않고 유지
      } else {
        newIndexes[postIndex] = prevIndex; // 유효한 인덱스면 변경
      }

      return newIndexes;
    });
  }

  //---------------------------------- 구글링 항목 -----------------------------------------------------------//

  return (
    <div className="post-list-wrap">
      <div className="post-item-wrap">
        <div className="post-item">
          {postList[reqPage - 1] &&
            postList[reqPage - 1].map(function(post, index) {
              // 해당 게시글에 첨부된 파일 필터링
              let postFiles = fileList.filter(function(file) {
                return file.postNo == post.postNo; // 해당 게시글의 파일 필터링
              });

              // 이미지 인덱스가 없으면 0으로 초기화
              if (imageIndexes[index] == undefined || imageIndexes[index] >= postFiles.length) {
                imageIndexes[index] = 0; // 초기 이미지 인덱스를 0으로 설정
              }

              return (
                <div key={"post" + index}>
                  
                    <span>{post.userNickname}</span> {/* 사용자 닉네임 */} 
                    {
                      loginMember.userNo == post.userNo  
                      ?<span class="material-symbols-outlined" onClick={function(e){
                          
                      }}>dehaze</span>
                      :""
                    }
                    <br />
                    <span>{post.postContent}</span> {/* 게시글 내용 */}
                  

                  {/* 이미지가 있는 경우만 슬라이더 표시 */}
                  {postFiles.length > 0 && postFiles[imageIndexes[index]] ? (
                    <div className="image-slider">
                      <img
                        src={
                          serverUrl +
                          "/board/" +
                          postFiles[imageIndexes[index]].postImgPath.substring(0, 8) + "/" +
                          postFiles[imageIndexes[index]].postImgPath // 이미지 경로
                        }
                        style={{ width: "200px", height: "200px", objectFit: "contain" }}
                      />
                      {/* 슬라이드 버튼: 이전/다음 버튼 */}
                      <div className="slider-buttons">
                        <button onClick={function() { PrevImage(index); }}>이전</button> {/* 이전 이미지 버튼 */}
                        <button onClick={function() { NextImage(index); }}>다음</button> {/* 다음 이미지 버튼 */}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
        </div>
        <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage}  />
      </div>
    </div>
  );
}


