import { useEffect, useRef, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import CommentList from "./CommentList";
import "./comment.css"

export default function Comment(props) {
  const postNo = props.postNo;
  const { loginMember, kakaoMember } = useUserStore();
  const member = loginMember || kakaoMember || null;
  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();

  const [commentList, setCommentList] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  //대댓글 상태변수
  const [parentCommentNo, setParentCommentNo] = useState(null);
  

  // 댓글 목록 불러오기
  function getCommentList() {
    
    let options = {};
    options.method = "get";
    options.url = serverUrl + "/comment/list/" + postNo;

    
    axiosInstance(options)
      .then(function (res) {

        console.log(res.data.resData);
        setCommentList(res.data.resData);
      })
      .catch(function (err) {
        console.error("댓글 불러오기 실패", err);
      });
  }

  useEffect(function () {
    getCommentList();
  }, [postNo]);

  // 댓글 등록
  function handleSubmit() {
    if (commentContent.trim() === "") {
      Swal.fire("오류", "댓글 내용을 입력하세요.", "error");
      return;
    }
    
    
    let options = {};
    options.data = {
      postNo: postNo,
      userNo: member.userNo,
      commentContent: commentContent,
      parentCommentNo: parentCommentNo
    };

    options.method = "post";
    options.url = serverUrl + "/comment/insert";
    
    axiosInstance(options)
      .then(function () {
        setCommentContent("");
        setParentCommentNo(null); //대댓글 모드 초기화
        getCommentList();
      })
      .catch(function (err) {
        console.error("댓글 등록 실패", err);
      });
  }

  //대댓글 작성버튼 누를 시, textarea 로 포커스
  const textareaRef = useRef(null);


  function handleReplyClick(parentNo) {
    setParentCommentNo(parentNo);
    //위의 상태가 바뀐 직후엔 바로 textareaRef.current가 적용되지 않을 수 있기 때문에 타임아웃 함수 사용.
    setTimeout(function () {
      if (textareaRef.current) { //대댓글 적을 textarea 로 스크롤
      textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      textareaRef.current.focus();
    }
  }, 0);
  }

  return (
 
    <div className="comment-wrap">

      <CommentList postNo = {postNo} commentList={commentList} setCommentList={setCommentList} onReply={handleReplyClick} />
      
      
      {member ? (
        <div style={{ marginTop: "10px", marginBottom: "0px" }}>
          <div className="comment-input">
          <textarea
            ref={textareaRef}
            placeholder={parentCommentNo !== null ? "대댓글 작성 중..." : "댓글을 입력하세요"}
            value={commentContent}
            onChange={function (e) {
              setCommentContent(e.target.value);
            }}
            style={{ width: "100%", height: "30px" }}
          ></textarea>
          <button onClick={handleSubmit}>
            등록
          </button>
          </div>

          <div className="cancel-re-reply">
          
          {parentCommentNo !== null && (
              <span className="child-comment-cancel" onClick={ function () {setParentCommentNo(null)}} style={{ marginLeft: "8px", fontSize: "12px" }}>
                <a className="edit-link">대댓글 취소</a>
              </span>
          )}
          </div>

        
        </div>


      ) : (
        <p>로그인 후 댓글 작성이 가능합니다.</p>
      )}
    </div>

  );
}
