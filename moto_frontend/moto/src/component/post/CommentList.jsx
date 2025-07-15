import React, { useRef } from "react";
import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import "./comment.css"
import createInstance from "../../axios/Interceptor";
import Swal from "sweetalert2";

export default function CommentList(props) {

  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();

  const commentList = props.commentList.filter(function(e) {
    return e.postNo === props.postNo;
  });

  const parentComments = commentList.filter(function (e) {
    return e.parentCommentNo == null;
  });

  // 로그인한 사용자 정보 가져오기
  const { loginMember, kakaoMember } = useUserStore();
  const member = loginMember || kakaoMember || null;

  // 대댓글 보기/숨기기 상태 저장 객체 (예: { 1: true, 2: false })
  const [visibleReplies, setVisibleReplies] = useState({});

  // 특정 댓글(parentNo)의 대댓글 보이기 상태를 토글하는 함수
  function toggleReplies(parentNo) {
    setVisibleReplies(function (prev) {
      return {
        ...prev, // 기존 상태 복사
        [parentNo]: !prev[parentNo], // 해당 댓글 번호 상태만 반전
      };
    });
  }

  //댓글 수정/삭제 숨김처리된 드롭 다운 보여주기
  var [menuVisible, setMenuVisible] = useState(null);

  function toggleMenu(commentNo) {
    setMenuVisible(function(current) {
        return current === commentNo ? null : commentNo;
    });
  }

  //다른곳 눌렸을때 다시 숨김 처리
  useEffect(function() {
    function handleClickOutside(e) {
      // 메뉴 아닌 곳 누르면 닫기
      if (!e.target.closest(".more-options")) {
        setMenuVisible(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return function() {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  //댓글 삭제 처리
  function deleteComment(commentNo) {
    Swal.fire({
        title : "알림",
        text:"정말 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소"
    })
    .then(function(result) {
      if(result.isConfirmed) {
        let options = {};
        options.method = "delete";
        options.url =  serverUrl + "/comment/delete/" + commentNo;

        axiosInstance(options)
        .then(function() {


          props.setCommentList(function(prev) {
          return prev.filter(function(comment) {
            return comment.commentNo !== commentNo; //삭제할 번호 제외 후 리랜더링.
          });
          

        });
        
      
        })
        .catch(function (err) {
          console.error("댓글 삭제 실패", err);
        });
      }
    })
  }
  


  //댓글 수정을 위한 상태변수 선언.
  const [editingCommentNo, setEditingCommentNo] = useState(null); // 수정 중인 댓글 번호
  const [editedContent, setEditedContent] = useState(""); // 입력 중인 댓글 내용

  //수정하기 버튼 누를 시, 실행될 함수 
  function editComment(comment) {
    setEditingCommentNo(comment.commentNo); //클릭한 댓글을 수정 대상으로 지정
    setEditedContent(comment.commentContent); // 해당 댓글의 기존 내용을 수정 input에 넣기
  }

  //수정한 데이터 서버로 보내기
  function saveEditedComment(commentNo) {
    let options = {};
    options.method = "patch"; //일부분만 수정 == 댓글 내용
    options.url = serverUrl + "/comment/update"
    options.data = {
      commentNo : commentNo,
      commentContent : editedContent
    }
    
    axiosInstance(options)
      .then(function(res) {
        // 성공 시 commentList 갱신
        props.setCommentList(function(prev) {
          return prev.map(function(c) {
            if (c.commentNo === commentNo) {
              return { ...c, commentContent: editedContent };
            }
            return c;
          });
        });

      setEditingCommentNo(null); // 수정 모드 종료
      setEditedContent("");      // 입력값 초기화
    });
  }


                        
  //좋아요 기능을 위한 상태변수 == 댓글 번호를 key로 해서 상태 저장
  const [likedMap, setLikedMap] = useState({});      // {17: true, 18: false, ...} 댓글 No 에 대한 로그인유저의 좋아요 상태
  const [likeCountMap, setLikeCountMap] = useState({}); // {17: 4, 18: 1, ...} 각 댓글에 좋아요 갯수

  useEffect(function() {
  const initialLiked = {};
  const initialCount = {};

    for (let i = 0; i < props.commentList.length; i++) {
      const comment = props.commentList[i];
      initialLiked[comment.commentNo] = comment.commentLikeYn;
      initialCount[comment.commentNo] = comment.commentLikeCnt;
    }

    setLikedMap(initialLiked);
    setLikeCountMap(initialCount);
  }, [props.commentList]);


  function toggleLike(commentNo) {
    const liked = likedMap[commentNo]; // 현재 상태
    const newLiked = !liked; //토글 누를 시, 현재상태 반전.

    //비로그인 유저 막기
    if (!member || !member.userNo) {
      Swal.fire("로그인 필요", "로그인 후 이용해주세요", "warning");
      return;
    }

    // 백엔드로 토글 요청 보내기

    let options = {};
    options.method = "post";
    options.url = serverUrl + "/like/toggle";
    options.data = {
      userNo: member.userNo,
      likeTargetType : "COMMENT",
      likeTargetId : commentNo
    }

    axiosInstance(options)
    .then(function(res) {
      // 프론트 상태 변경
      setLikedMap(function(prev) {
        return { ...prev, [commentNo]: newLiked };
      });

      setLikeCountMap(function(prev) {
        return {
          ...prev,
          [commentNo]: newLiked ? prev[commentNo] + 1 : prev[commentNo] - 1
        };
      });

    })
    .catch(function(err) {
      Swal.fire("오류", "좋아요 실패", "error");
      return;
    })

  }





  return (
    
     <div className="comment-wrap">
      <div className="comment-innerWrap">
      <table className="tbl comment-list comment-table">
        <tbody>
          {parentComments.map(function (parent) {         
            //대댓글 갯수.
            const replyCount = commentList.filter(function (e) {
              return e.parentCommentNo === parent.commentNo;
            }).length;
             
            return (
              
              <React.Fragment key={parent.commentNo}>
                <tr className="parent-comment">
                  <td className="parent-comment-content" style={{ width: "5%"}}>
                  
                      <span className="nickname">{parent.userNickname}</span>
                      
                  
                  </td>
                  <td className="parent-comment-content" style={{ width: "90%"}}>
                    {editingCommentNo === parent.commentNo ? (
                      // 수정 중인 댓글이면 input 박스 표시
                      <>
                        <textarea className="reply-form"
                          value={editedContent}
                          onChange={function(e) { setEditedContent(e.target.value); }}
                        />
                        <a className="edit-link" onClick={function() { saveEditedComment(parent.commentNo); }}>저장</a>
                      </>
                    ) : (
                      // 수정 중이 아니면 원래 댓글 내용 표시
                      <span className="comment" >{parent.commentContent}</span>
                    )}
                  </td>
                  
                </tr>

                <tr className="reply-settings-child">
                    <td colSpan={2}>
                      
                      
                      <span className="edit-link" onClick={function() { toggleLike(parent.commentNo); }}>
                        {likedMap[parent.commentNo] ? "♥" : "♡"} {likeCountMap[parent.commentNo]} likes
                      </span>

                      {replyCount > 0 && (
                        <span className="toggle-replies" onClick={function () {
                        toggleReplies(parent.commentNo);
                      }}>
                      <a className="edit-link">{visibleReplies[parent.commentNo] ? "💬 댓글 숨기기" : `💬 댓글 보기 (${replyCount})`}</a>
                      </span> 
                      )}
                      <span                      
                          onClick={function () {
                            props.onReply(parent.commentNo);
                          }}>
                          <a className="edit-link">댓글</a>
                      </span> 

                      {member !== null && member.userNo === parent.userNo ? (

                      <span className="more-options">
                        
                        <a
                          onClick={function() {
                            toggleMenu(parent.commentNo);
                          }}
                          className="more-button"
                        >⋯</a>
                        {menuVisible === parent.commentNo ? (
                          <div className="dropdown-menu">
                            <a className="edit-link" onClick={function() {
                              editComment (parent);
                            }}>수정</a>
                            <a className="edit-link" onClick={ function() {
                              deleteComment (parent.commentNo);}}>삭제</a>
                          </div>
                        ) : null}
                        </span>
                        ) : null}
                    </td>
                </tr>
              
                {visibleReplies[parent.commentNo] && commentList
                  .filter(function (e) {
                    return e.parentCommentNo === parent.commentNo;
                  })
                  .map(function (child) {
                    return (
                      <React.Fragment key={child.commentNo}> 
                      <tr className="child-comment">
                        <td className="child-comment-first-col" style={{ width: "20%" }}>
                          <span className="nickname" title={child.userNickname}>{child.userNickname}</span>
                          </td>
                          <td className="child-comment-second-col">
                            {editingCommentNo === child.commentNo ? (
                            // 수정 중인 댓글이면 input 박스 표시
                            <>
                              <textarea className="reply-form"
                                value={editedContent}
                                onChange={function(e) { setEditedContent(e.target.value); }}
                              />
                               <a className="edit-link" onClick={function() { saveEditedComment(child.commentNo); }}>저장</a> 
                            </>
                            

                          ) : (
                            // 수정 중이 아니면 원래 댓글 내용 표시
                            <span className="comment" >{child.commentContent}</span>
                          )}

                          <span className="edit-link" onClick={function() { toggleLike(child.commentNo); }}>
                            {likedMap[child.commentNo] ? "♥" : "♡"} {likeCountMap[child.commentNo]} likes
                          </span>
                          
                          {member !== null && member.userNo === child.userNo ? (
                          
                          
                          <span className="more-options">
                            
                            <a
                              onClick={function() {
                                toggleMenu(child.commentNo);
                              }}
                              className="more-button"
                            >⋯</a>
                            {menuVisible === child.commentNo ? (
                              <div className="dropdown-menu">
                                <a className="edit-link" onClick={function() {
                                  editComment(child);
                                }}>수정</a>
                                <a className="edit-link" onClick={ function() {
                              deleteComment (child.commentNo);}}>삭제</a>
                              </div>
                            ) : null}
                            </span>
                            ) : null}
                          </td>
                        
                      </tr>
                      </React.Fragment>
                    );
                  })}
                   </React.Fragment>
              
            );
          })}
        </tbody>
      </table>
      </div>
    </div>

  );
}
