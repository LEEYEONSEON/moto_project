import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import React, { useState, useMemo, useRef } from 'react';
import createInstance from '../../axios/Interceptor';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';

// ag-Grid 모듈 등록 (반드시 등록해야 ag-Grid 기능 사용 가능)
ModuleRegistry.registerModules([AllCommunityModule]);

// 회원 리스트를 표시하는 컴포넌트
export default function UserList(props) {
  // 부모로부터 전달받은 회원 리스트 데이터
  const userList = props.userList;
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_BACK_SERVER; // 백엔드 서버 주소 (환경변수)

  const axiosInstance = createInstance(); // axios 인스턴스 (인터셉터 포함)
  const gridRef = useRef(null); // ag-Grid 참조 (API 사용용)

  // 수정된 회원 목록을 저장하는 상태 (변경 사항 전송용)
  const [updatedRows, setUpdatedRows] = useState([]);

  // 현재 로그인한 사용자 정보 가져오기
  const { loginMember, kakaoMember } = useUserStore();
  let member;
  if (loginMember) {
    member = loginMember;
  } else if (kakaoMember) {
    member = kakaoMember;
  }

  // ag-Grid 컬럼 정의
  const [colDefs] = useState([
    {
      headerName: '',
      checkboxSelection: function(params) {
        // userRole이 '1'인 경우(관리자)는 체크박스 선택 금지
        return params.data && params.data.userRole != '1';
      },
      headerCheckboxSelection: true, // 헤더에서 전체 선택 가능
      headerCheckboxSelectionFilteredOnly: true,
      pinned: 'left', // 왼쪽 고정
      width: 50,
      filter: false,
      sortable: false,
      editable: false // 체크박스 컬럼은 편집 불가
    },
    { headerName: "회원번호", field: "userNo", editable: false },
    { headerName: "아이디", field: "userId", editable: false },
    { headerName: "닉네임", field: "userNickname", editable: false },
    { headerName: "이메일", field: "userEmail", editable: false },
    { headerName: "가입일", field: "userJoinDate", editable: false },
    { headerName: "로그인분류", field: "userSocialType", editable: false },
    {
      headerName: "회원등급",
      field: "userRole",
      editable: function(params) {
        // userRole이 '1'인 경우(관리자)는 등급 수정 금지
        return params.data && params.data.userRole != '1';
      },
      cellEditor: 'agSelectCellEditor', // 선택박스 에디터 사용
      cellEditorParams: {
        values: ['1', '2', '3'] // 선택 가능한 값 목록
      },
      valueFormatter: function(params) {
        // 값에 따라 등급명 표시
        if (params.value == '1') return '관리자';
        if (params.value == '2') return '회원';
        if (params.value == '3') return '정지';
        return params.value;
      }
    }
  ]);

  // 기본 컬럼 설정 (공통 필터와 편집 가능)
  const defaultColDef = useMemo(function() {
    return {
      filter: true,
      editable: true
    };
  }, []);

  // 셀 값 변경 이벤트 처리 (userRole 변경 시에만 처리)
  function onCellValueChanged(e) {
    if (e.colDef.field == 'userRole') {
      const changedUser = e.data; // 변경된 행 데이터

      // 기존에 수정된 목록에 있는지 확인하고 갱신
      setUpdatedRows(function(prev) {
        const exists = prev.find(function(item) {
          return item.userNo == changedUser.userNo;
        });
        if (exists) {
          // 이미 있으면 해당 데이터만 교체
          return prev.map(function(item) {
            if (item.userNo == changedUser.userNo) {
              return changedUser;
            } else {
              return item;
            }
          });
        } else {
          // 없으면 새로 추가
          return prev.concat(changedUser);
        }
      });
    }
  }

  // 변경하기 버튼 클릭 시 호출
  function Update() {
    if (updatedRows.length == 0) {
      // 변경된 내용 없을 경우 알림창
      Swal.fire({
        title: "알림",
        text: "변경할 항목이 존재하지 않습니다.",
        icon: "warning",
        confirmButtonText: "확인"
      });
      return;
    }

    // 변경된 회원 목록 각각 PATCH 요청 전송
    updatedRows.forEach(function(user) {
      axiosInstance.patch(serverUrl + '/admin/user', user)
        .then(function(res) {
          // 성공 시 별도 처리 없음
        })
        .catch(function(err) {
          // 실패 시 별도 처리 없음
        });
    });

    // 변경 후 목록 초기화
    setUpdatedRows([]);
  }

  // 삭제하기 버튼 클릭 시 호출
  function Delete() {
    const selectedRows = gridRef.current.api.getSelectedRows(); // 선택된 행 가져오기

    if (selectedRows.length == 0) {
      // 선택한 회원 없을 경우 알림창
      Swal.fire({
        title: "알림",
        text: "삭제할 회원을 선택하세요.",
        icon: "warning",
        confirmButtonText: "확인"
      });
      return;
    }

    // 선택된 회원 중에 관리자 있는지 확인
    const hasAdmin = selectedRows.some(function(user) {
      return user.userRole == '1';
    });

    if (hasAdmin) {
      // 관리자 포함 시 삭제 불가 알림창
      Swal.fire({
        title: "알림",
        text: "관리자 계정은 삭제할 수 없습니다.",
        icon: "warning",
        confirmButtonText: "확인"
      });
      return;
    }

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    // 선택된 회원 각각 삭제 요청
    selectedRows.forEach(function(user) {
      axiosInstance.delete(serverUrl + '/admin/user/' + user.userNo)
        .then(function() {
          // 삭제 성공 시 그리드에서도 삭제
          gridRef.current.api.applyTransaction({ remove: [user] });
        })
        .catch(function(error) {
          // 삭제 실패 시 별도 처리 없음
        });
    });
  }

  // 컴포넌트 렌더링 부분
  return (
    <div>

      {/* ag-Grid 테이블 영역 */}
      <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
        <AgGridReact
          ref={gridRef} // 참조 연결
          rowData={userList} // 데이터
          columnDefs={colDefs} // 컬럼 설정
          defaultColDef={defaultColDef} // 기본 설정
          rowSelection="multiple" // 다중 선택 가능
          pagination={true} // 페이징 활성화
          paginationPageSize={10} // 한 페이지에 10개씩
          onCellValueChanged={onCellValueChanged} // 셀 변경 이벤트 등록
          animateRows={false} // 행 애니메이션 비활성화
        />
      </div>

      {/* 버튼 영역 */}
      <div style={{ marginTop: '10px', textAlign: 'right' }}>
        {/* 변경 버튼 */}
        <button
          onClick={Update}
          style={{ width: "100px", fontSize: "15px" }}>
          변경
        </button>

        {/* 삭제 버튼 */}
        <button
          onClick={Delete}
          style={{ width: "100px", fontSize: "15px" }}>
          삭제
        </button>
      </div>
    </div>
  );
}
