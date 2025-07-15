import { useEffect, useRef, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from "../common/PageNavi";
import Swal from "sweetalert2";
import CommentItem from "./CommentItem"
import './postview.css';

export default function PostView() {
  const [reqPage, setReqPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({});
  const [postList, setPostList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const [modalState, setModalState] = useState({ open: false, post: null });

  const { loginMember, kakaoMember } = useUserStore();
  const member = loginMember || kakaoMember || null;

  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();

  useEffect(function () {
    const options = { url: serverUrl + "/post/getList/" + reqPage, method: "get" };
    axiosInstance(options)
      .then(function (res) {
        const newPostList = res.data.resData.postInfo.postList || [];
        const newFileList = res.data.resData.postInfo.fileList || [];
        setPostList(newPostList);
        setFileList(newFileList);
        setPageInfo(res.data.resData.pageInfo);
        let initIndexes = {};
        newPostList.forEach(function (post) { initIndexes[post.postNo] = 0; });
        setImageIndexes(initIndexes);
      })
      .catch(function (err) {
        console.error("게시글 목록 불러오기 실패", err);
      });
  }, [reqPage]);

  function nextImage(postNo) {
    setImageIndexes(function (prev) {
      const postFiles = fileList.filter(function (file) { return file.postNo == postNo; });
      const currentIndex = prev[postNo] || 0;
      if (currentIndex < postFiles.length - 1) {
        const newIndexes = { ...prev };
        newIndexes[postNo] = currentIndex + 1;
        return newIndexes;
      }
      return prev;
    });
  }

  function prevImage(postNo) {
    setImageIndexes(function (prev) {
      const currentIndex = prev[postNo] || 0;
      if (currentIndex > 0) {
        const newIndexes = { ...prev };
        newIndexes[postNo] = currentIndex - 1;
        return newIndexes;
      }
      return prev;
    });
  }

  function closeModal() {
    setModalState({ open: false, post: null });
  }

  function openModal(post) {

    setModalState({ open: true, post: post });
  }

  return (
    
    <div className="post-view-container">
      <div className="post-list-wrap">
        {postList.length == 0 ? (
          <p>게시글이 없습니다.</p>
        ) : (
          postList.map(function (post) {
            const postFiles = fileList.filter(function (file) { return file.postNo == post.postNo; });
            const currentImageIndex = imageIndexes[post.postNo] || 0;

            return (
              <div key={post.postNo} className="post-item">
                <div className="post-header">
                  <span className="post-title">{post.userNickname}</span>
                  {member != null && member.userNo == post.userNo ? (
                    <button className="post-edit-button" onClick={function () { openModal(post); }}>
                      <span className="material-icons" style={{color:"white"}}>edit</span>
                    </button>
                  ) : null}
                </div>

                <div className="post-body">
                  <span className="post-content">{post.postContent != "undefined" ? post.postContent : ""}</span>
                </div>

                {postFiles.length > 0 && (
                  <div className="image-slider">
                    <img
                      src={
                        serverUrl +
                        "/board/" +
                        postFiles[currentImageIndex].postImgPath.substring(0, 8) +
                        "/" +
                        postFiles[currentImageIndex].postImgPath
                      }
                      alt="post attachment"
                      className="post-image"
                    />
                    <div className="slider-buttons">
                      <button onClick={function () { prevImage(post.postNo); }} disabled={currentImageIndex == 0}>이전</button>
                      <span className="slider-index">{currentImageIndex + 1} / {postFiles.length}</span>
                      <button onClick={function () { nextImage(post.postNo); }} disabled={currentImageIndex == postFiles.length - 1}>다음</button>
                    </div>
                  </div>
                )}
                <CommentItem postNo={post.postNo} />
              </div>
            );
          })
        )}
      </div>

      <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />



      {modalState.open == true && modalState.post != null && (
        <PostUpdateModal
          key={modalState.post.postNo}
          post={modalState.post}
          fileList={fileList.filter(function (f) { return f.postNo == modalState.post.postNo })}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// PostUpdateModal 컴포넌트 - 모달 스타일 인라인 유지
function PostUpdateModal(props) {
  const post = props.post;
  const fileList = props.fileList || [];
  const onClose = props.onClose;

  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();

  const [content, setContent] = useState(post.postContent);
  const [existingFiles, setExistingFiles] = useState(fileList);
  const [newFiles, setNewFiles] = useState([]);

  const uploadFileEl = useRef(null);

  useEffect(function () {
    setContent(post.postContent);
    setExistingFiles(fileList);
    setNewFiles([]);

  }, [post, fileList]);

  function chgContent(e) {
    setContent(e.target.value);
  }

  function handleFileClick() {
    if (uploadFileEl.current != null) {
      uploadFileEl.current.click();
    }
  }

  function chgPostFile(e) {
    const selectedFiles = Array.from(e.target.files);
    setNewFiles(function (prev) {
      return prev.concat(selectedFiles);
    });
    e.target.value = null;
  }

  useEffect(function () {

  }, [newFiles]);

  function deleteExistingFile(fileToDelete) {
    setExistingFiles(function (prev) {
      return prev.filter(function (file) {
        return file != fileToDelete;
      });
    });
  }

  function deleteNewFile(fileToDelete) {
    setNewFiles(function (prev) {
      return prev.filter(function (file) {
        return file != fileToDelete;
      });
    });
  }

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

  function updatePost() {
    if (content.trim() == "") {
      Swal.fire("오류", "내용을 입력하세요.", "error");
      return;
    }

    const form = new FormData();
    form.append("postNo", post.postNo);
    form.append("postContent", content);

    for (let i = 0; i < newFiles.length; i++) {
      form.append("newFiles", newFiles[i]);
    }

    const deletedFiles = fileList
      .filter(function (originalFile) {
        return existingFiles.indexOf(originalFile) == -1;
      })
      .map(function (file) {
        return file.postImgNo;
      });

    for (let i = 0; i < deletedFiles.length; i++) {
      form.append("delFiles", deletedFiles[i]);
    }

    const options = {
      url: serverUrl + "/post/update",
      method: "patch",
      data: form,
      headers: { "Content-Type": "multipart/form-data" },
    };

    axiosInstance(options)
      .then(function (res) {

      })
      .catch(function (err) {});
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>게시글 수정</h4>
        <textarea value={content} onChange={chgContent} className="modal-textarea"></textarea>

        <div className="modal-file-section">
          <strong style={{color:"white"}}>기존 첨부파일</strong>
          <ul style={{paddingTop:"10px"}}>
            {existingFiles.length == 0 ? (
              <li>첨부파일 없음</li>
            ) : (
              existingFiles.map(function (file) {
                return (
                  <li key={file.postImgNo} className="modal-file-item">
                    <span style={{color:"white"}}>{file.postImgPath}</span>
                    
                    <span className="material-icons del-file-icon" onClick={function () { deleteExistingFile(file); }}>
                      delete
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div className="modal-file-section">
          <strong style={{color:"white"}}>새로 추가한 파일</strong>
          <ul>
            {newFiles.length == 0 ? (
              <li style={{color:"white"}}>첨부파일 없음</li>
            ) : (
              newFiles.map(function (file, idx) {
                return (
                  <li key={idx} className="modal-file-item">
                    <span style={{color:"white"}}>{file.name}</span>
                    <span className="material-icons del-file-icon" onClick={function () { deleteNewFile(file); }}>
                      delete
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div className="modal-upload">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3" onClick={handleFileClick} className="upload-icon">
            <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
          </svg> 파일선택
          <input type="file" multiple ref={uploadFileEl} onChange={chgPostFile} style={{ display: "none" }} />
        </div>

        <div className="modal-buttons">
          <button onClick={deletePost} className="delete-btn">삭제</button>
          <button onClick={updatePost} className="submit-btn">수정</button>
          <button onClick={onClose} className="cancel-btn">취소</button>
        </div>
      </div>
    </div>
  );
}
