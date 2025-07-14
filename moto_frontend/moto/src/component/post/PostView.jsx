import { useEffect, useState, useRef } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from "../common/PageNavi";
import Swal from "sweetalert2";
import CommentItem from "./CommentItem"

// PostView 컴포넌트
export default function PostView() {
  // 현재 요청할 페이지 번호 상태 (초기값 1)
  const [reqPage, setReqPage] = useState(1);
  // 페이지네이션 정보 상태
  const [pageInfo, setPageInfo] = useState({});
  // 게시글 리스트 상태
  const [postList, setPostList] = useState([]);
  // 첨부파일 리스트 상태
  const [fileList, setFileList] = useState([]);
  // 게시글별 이미지 인덱스 상태 (postNo 별 인덱스 저장)
  const [imageIndexes, setImageIndexes] = useState({});
  // 모달 상태 및 선택 게시글 상태 관리
  const [modalState, setModalState] = useState({ open: false, post: null });

  // 로그인한 사용자 정보 가져오기
  const { loginMember, kakaoMember } = useUserStore();
  const member = loginMember || kakaoMember || null;

  // 서버 주소 환경변수
  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  // axios 인스턴스 생성
  const axiosInstance = createInstance();

  // reqPage 값이 바뀔 때마다 게시글 리스트와 파일 리스트 불러오기
  useEffect(function () {
    // API 요청 옵션 세팅
    const options = {
      url: serverUrl + "/post/getList/" + reqPage,
      method: "get",
    };
    // axios 요청
    axiosInstance(options)
      .then(function (res) {
        // 응답 데이터에서 게시글 리스트, 파일 리스트, 페이지 정보 추출
        const newPostList = res.data.resData.postInfo.postList || [];
        const newFileList = res.data.resData.postInfo.fileList || [];
        setPostList(newPostList);
        setFileList(newFileList);
        setPageInfo(res.data.resData.pageInfo);

        // 각 게시글별 이미지 인덱스 초기화 (기본값 0)
        let initIndexes = {};
        newPostList.forEach(function (post) {
          initIndexes[post.postNo] = 0;
        });
        setImageIndexes(initIndexes);
      })
      .catch(function (err) {
        console.error("게시글 목록 불러오기 실패", err);
      });
  }, [reqPage]);

  // 이미지 인덱스를 다음으로 증가시키는 함수
  function nextImage(postNo) {
    setImageIndexes(function (prev) {
      // 해당 게시글의 첨부파일 목록 필터링
      const postFiles = fileList.filter(function (file) {
        return file.postNo == postNo;
      });
      // 현재 인덱스 가져오기 (기본 0)
      const currentIndex = prev[postNo] || 0;
      // 만약 현재 인덱스가 마지막 인덱스보다 작으면 1 증가
      if (currentIndex < postFiles.length - 1) {
        const newIndexes = { ...prev };
        newIndexes[postNo] = currentIndex + 1;
        return newIndexes;
      }
      // 그 외는 이전 상태 유지
      return prev;
    });
  }

  // 이미지 인덱스를 이전으로 감소시키는 함수
  function prevImage(postNo) {
    setImageIndexes(function (prev) {
      const currentIndex = prev[postNo] || 0;
      // 현재 인덱스가 0보다 크면 1 감소
      if (currentIndex > 0) {
        const newIndexes = { ...prev };
        newIndexes[postNo] = currentIndex - 1;
        return newIndexes;
      }
      return prev;
    });
  }

  // 모달 닫기 함수 - 상태 초기화
  function closeModal() {
    setModalState({ open: false, post: null });
  }

  // 수정 버튼 클릭 시 모달 열기 함수 - 선택 게시글 설정
  function openModal(post) {
    console.log("수정 버튼 클릭됨, postNo:", post.postNo);
    setModalState({ open: true, post: post });
  }

  return (
    <div className="post-list-wrap">
      <div className="post-item-wrap">
        {postList.length == 0 ? (
          <p>게시글이 없습니다.</p>
        ) : (
          postList.map(function (post) {
            // 해당 게시글의 첨부파일 필터링
            const postFiles = fileList.filter(function (file) {
              return file.postNo == post.postNo;
            });
            // 현재 보여줄 이미지 인덱스
            const currentImageIndex = imageIndexes[post.postNo] || 0;

            return (
              <div
                key={post.postNo}
                style={{ marginBottom: "30px", borderBottom: "1px solid #ddd", paddingBottom: "15px" }}
              >
                {/* 작성자 닉네임 표시 */}
                <span style={{ fontWeight: "bold" }}>{post.userNickname}</span>

                {/* 본인 게시글일 경우 수정 버튼 노출 */}
                {member != null && member.userNo == post.userNo ? (
                  <button style={{ marginLeft: "10px" }} onClick={function () { openModal(post); }}>
                    <span className="material-symbols-outlined">dehaze</span>
                  </button>
                ) : null}

                <br />

                {/* 게시글 내용 */}
                <span>{post.postContent}</span>

                {/* 첨부 이미지 슬라이더 표시 */}
                {postFiles.length > 0 ? (
                  <div className="image-slider" style={{ marginTop: "10px" }}>
                    <img
                      src={
                        serverUrl +
                        "/board/" +
                        postFiles[currentImageIndex].postImgPath.substring(0, 8) +
                        "/" +
                        postFiles[currentImageIndex].postImgPath
                      }
                      alt="post attachment"
                      style={{ width: "200px", height: "200px", objectFit: "contain" }}
                    />
                    <div className="slider-buttons" style={{ marginTop: "5px" }}>
                      <button
                        onClick={function () { prevImage(post.postNo); }}
                        disabled={currentImageIndex == 0}
                      >
                        이전
                      </button>
                      <span style={{ margin: "0 10px" }}>
                        {currentImageIndex + 1} / {postFiles.length}
                      </span>
                      <button
                        onClick={function () { nextImage(post.postNo); }}
                        disabled={currentImageIndex == postFiles.length - 1}
                      >
                        다음
                      </button>
                    </div>
                  </div>
                ) : null}


                <CommentItem postNo={post.postNo} />

              </div>
            );
          })
        )}
        {/* 페이지 네비게이션 컴포넌트 */}
        <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
      </div>

      {/* 모달 조건부 렌더링: key 속성 추가로 상태 초기화 문제 완화 */}
      {modalState.open == true && modalState.post != null ? (
        <PostUpdateModal
          key={modalState.post.postNo}
          post={modalState.post}
          fileList={fileList.filter(function (f) {
            return f.postNo == modalState.post.postNo;
          })}
          onClose={closeModal}
        />
      ) : null}
    </div>
  );
}

// PostUpdateModal 컴포넌트 - 게시글 수정 모달
function PostUpdateModal(props) {
  // props 분해 할당
  const post = props.post;
  const fileList = props.fileList || [];
  const onClose = props.onClose;

  // 서버 주소 및 axios 인스턴스
  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();

  // 게시글 내용 상태 (초기값 post 내용)
  const [content, setContent] = useState(post.postContent);
  // 기존 첨부파일 상태 (초기값 props 파일 리스트)
  const [existingFiles, setExistingFiles] = useState(fileList);
  // 새로 추가한 파일 상태 (빈 배열 초기화)
  const [newFiles, setNewFiles] = useState([]);

  // 파일 선택 input 참조
  const uploadFileEl = useRef(null);

  // 모달 열릴 때마다 상태 초기화
  useEffect(function () {
    setContent(post.postContent);
    setExistingFiles(fileList);
    setNewFiles([]);
    console.log("모달 열림 - 상태 초기화", post.postNo);
  }, [post, fileList]);

  // 게시글 내용 변경 핸들러
  function chgContent(e) {
    setContent(e.target.value);
  }

  // 파일 선택창 열기 함수
  function handleFileClick() {
    console.log("파일 선택창 열기 시도");
    if (uploadFileEl.current != null) {
      uploadFileEl.current.click();
    }
  }

  // 파일 선택 시 이벤트 처리 함수
  function chgPostFile(e) {
    console.log("파일 선택 이벤트 발생", e.target.files);
    const selectedFiles = Array.from(e.target.files);
    console.log("선택된 파일들:", selectedFiles);

    // 기존 새 파일 상태에 선택된 파일들 추가
    setNewFiles(function (prev) {
      return prev.concat(selectedFiles);
    });

    // 동일 파일 재선택 가능하도록 input 값 초기화
    e.target.value = null;
  }

  // newFiles 상태 변경 디버깅용 useEffect
  useEffect(function () {
    console.log("newFiles 상태 변화:", newFiles);
  }, [newFiles]);

  // 기존 첨부파일 삭제 함수
  function deleteExistingFile(fileToDelete) {
    setExistingFiles(function (prev) {
      return prev.filter(function (file) {
        return file != fileToDelete;
      });
    });
  }

  // 새로 추가한 파일 삭제 함수
  function deleteNewFile(fileToDelete) {
    setNewFiles(function (prev) {
      return prev.filter(function (file) {
        return file != fileToDelete;
      });
    });
  }

  // 게시글 삭제 함수 - 확인 모달 후 삭제 요청
  function deletePost() {
    Swal.fire({
      title: "알림",
      text: "게시글을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then(function (result) {
      if (result.isConfirmed == true) {
        const options = {
          url: serverUrl + "/post/delete/" + post.postNo,
          method: "delete",
        };
        axiosInstance(options)
        .then(function (res) {
          window.location.reload();
        });
      }
    });
  }

  // 게시글 수정 함수 - 내용과 파일들 서버에 전송
  function updatePost() {
    console.log("서버로 보낼 newFiles:", newFiles);

    // 내용이 비어있으면 경고 표시 후 종료
    if (content.trim() == "") {
      Swal.fire("오류", "내용을 입력하세요.", "error");
      return;
    }

    // FormData 객체 생성
    const form = new FormData();
    form.append("postNo", post.postNo);
    form.append("postContent", content);

    // 새로 추가한 파일들 모두 FormData에 추가
    for (let i = 0; i < newFiles.length; i++) {
      form.append("newFiles", newFiles[i]);
    }

    // 삭제된 기존 파일 번호 추출
    const deletedFiles = fileList
      .filter(function (originalFile) {
        return existingFiles.indexOf(originalFile) == -1;
      })
      .map(function (file) {
        return file.postImgNo;
      });

    // 삭제된 파일 번호 FormData에 추가
    for (let i = 0; i < deletedFiles.length; i++) {
      form.append("delFiles", deletedFiles[i]);
    }

    
    const options = {
      url: serverUrl + "/post/update",
      method: "patch",
      data: form,
      headers: { "Content-Type": "multipart/form-data" },
    };

    // axios 호출
    axiosInstance(options)
      .then(function (res) {
        console.log(res);
        
      })
      .catch(function (err) {
        
      });
  }

  return (
    <div
      id="modal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h4 style={{ textAlign: "left" }}>게시글 수정</h4>

        {/* 게시글 내용 입력 */}
        <textarea
          value={content}
          onChange={chgContent}
          style={{ width: "100%", height: "150px", resize: "none", marginTop: "10px" }}
        ></textarea>

        {/* 기존 첨부파일 목록 */}
        <div style={{ marginTop: "15px" }}>
          <strong>기존 첨부파일</strong>
          <ul>
            {existingFiles.length == 0 ? (
              <li>첨부파일 없음</li>
            ) : (
              existingFiles.map(function (file) {
                return (
                  <li
                    key={file.postImgNo}
                    style={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <span>{file.postImgPath}</span>
                    <button
                      onClick={function () {
                        deleteExistingFile(file);
                      }}
                      style={{ color: "red" }}
                    >
                      삭제
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* 새로 추가한 파일 목록 */}
        <div style={{ marginTop: "15px" }}>
          <strong>새로 추가한 파일</strong>
          <ul>
            {newFiles.length == 0 ? (
              <li>첨부파일 없음</li>
            ) : (
              newFiles.map(function (file, idx) {
                return (
                  <li
                    key={idx}
                    style={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <span>{file.name}</span>
                    <button
                      onClick={function () {
                        deleteNewFile(file);
                      }}
                      style={{ color: "red" }}
                    >
                      삭제
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* 파일 선택 버튼 및 input */}
        <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
          {/* svg 아이콘 클릭 시 파일 선택창 열기 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
            style={{ cursor: "pointer" }}
            onClick={handleFileClick}
          >
            <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
          </svg> upload

          {/* 실제 파일 input - 숨김 처리, 다중 선택 가능, ref 연결, onChange 이벤트 등록 */}
          <input
            type="file"
            id="inputFile"
            style={{ display: "none" }}
            multiple
            ref={uploadFileEl}
            onChange={chgPostFile}
          />
        </div>

        {/* 버튼들: 삭제, 수정, 취소 */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button onClick={deletePost}>삭제</button>
          <button onClick={updatePost}>수정</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
