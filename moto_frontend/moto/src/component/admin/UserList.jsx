import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import React, { useState, useMemo, useRef } from 'react';
import createInstance from '../../axios/Interceptor';
import Swal from 'sweetalert2';

// ag-Grid 모듈 등록 (필수)
ModuleRegistry.registerModules([AllCommunityModule]);

// 유저 리스트 보여주는 컴포넌트 (function + export default)
export default function UserList(props) {
  // 부모 컴포넌트에서 전달된 유저 목록 데이터
  const userList = props.userList;

  // 백엔드 서버 주소 (환경변수에서 읽음)
  const serverUrl = import.meta.env.VITE_BACK_SERVER;

  // axios 인터셉터 인스턴스 생성 (API 요청용)
  const axiosInstance = createInstance();

  // ag-Grid API 접근을 위한 ref 생성
  const gridRef = useRef(null);

  // 변경된 행(회원)만 따로 저장하는 상태 (처음엔 빈 배열)
  const [updatedRows, setUpdatedRows] = useState([]);

  // 컬럼 정의: 체크박스, 회원번호 등 기본 정보, 회원등급 편집 가능
  const [colDefs] = useState([
  {
    headerName: '',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    pinned: 'left',
    width: 50,
    filter: false,
    sortable: false,
    editable: false // 체크박스는 편집 불가 (기본값이므로 명시적 추가)
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
    editable: true, // ✅ 여기만 true
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: ['1', '2', '3']
    },
    valueFormatter: function(params) {
      if(params.value == '1') return '관리자';
      if(params.value == '2') return '회원';
      if(params.value == '3') return '정지';
      return params.value;
    }
  }
]);

  // 기본 컬럼 설정: 모든 컬럼 필터 가능, 편집 가능
  const defaultColDef = useMemo(function() {
    return {
      filter: true,
      editable: true
    };
  }, []);

  // 셀 값 변경 이벤트 핸들러
  function onCellValueChanged(e) {
    
    // 변경된 컬럼이 userRole(회원등급)인지 확인
    if(e.colDef.field == 'userRole') {
      const changedUser = e.data; // 변경된 행 데이터

      // 변경된 행을 updatedRows 상태에 저장 (중복 없이 관리)
      setUpdatedRows(function(prev) {
        // 이미 저장된 userNo인지 확인
        const exists = prev.find(function(item) {
          return item.userNo == changedUser.userNo;
        });
        if(exists) {
          // 중복되면 새 데이터로 교체
          return prev.map(function(item) {
            if(item.userNo == changedUser.userNo) {
              return changedUser;
            } else {
              return item;
            }
          });
        } else {
          // 중복 아니면 새로 추가
          return prev.concat(changedUser);
        }
      });
    }
  }

  // 변경하기 버튼 클릭 시 실행
  function Update() {
    // 변경된 행이 없으면 경고창 띄우고 종료
    if(updatedRows.length == 0) {
      Swal.fire({
        title: "알림",
        text: "변경된 회원이 없습니다.",
        icon: "info",
        confirmButtonText: "확인"
      });
      return; 
    }

    // 변경된 각 회원에 대해 PATCH 요청 보내기
    updatedRows.forEach(function(user) {
      axiosInstance.patch(serverUrl + '/admin/user', user)
        .then(function() {
          
          
        })
        
    });

    // 변경 처리 완료 후 변경 목록 초기화
    setUpdatedRows([]);
  }

  // 삭제하기 버튼 클릭 시 실행
  function Delete() {

    // 체크박스로 선택된 행들 가져오기
    const selectedRows = gridRef.current.api.getSelectedRows();

    // 선택한 행 없으면 경고 후 종료
    if(selectedRows.length == 0) {
      Swal.fire({
        title: "알림",
        text: "삭제할 회원을 선택하세요.",
        icon: "warning",
        confirmButtonText: "확인"
      });
      return;
    }


    if(!window.confirm("정말 삭제하시겠습니까?")) return;

    // 선택된 회원 하나씩 삭제 요청
    selectedRows.forEach(function(user) {
      axiosInstance.delete(serverUrl + '/admin/user/' + user.userNo)
        .then(function() {
          
          // 삭제 성공 시 그리드에서 해당 행 제거
          gridRef.current.api.applyTransaction({ remove: [user] });
        })
        .catch(function(error) {
          
          
        });
    });
  }

  
  return (
    <div>
  
      <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
        <AgGridReact
          ref={gridRef} // API 접근을 위한 ref 연결
          rowData={userList} // 실제 데이터 바인딩
          columnDefs={colDefs} // 컬럼 설정
          defaultColDef={defaultColDef} // 기본 컬럼 옵션
          rowSelection="multiple" // 다중 행 선택 가능
          pagination={true} // 페이지네이션 활성화
          paginationPageSize={10} // 페이지 당 10개씩 표시
          onCellValueChanged={onCellValueChanged} // 셀 편집 후 변경 이벤트 등록
          animateRows={false}
        />
      </div>

      {/* 버튼 컨테이너 */}
      <div style={{ marginTop: '10px', textAlign: 'right' }}>
        {/* 변경하기 버튼 */}
        <button
          onClick={Update}
          style={{ width: "100px", fontSize: "15px"}}>
          변경
        </button>

        {/* 삭제하기 버튼 */}
        <button
          onClick={Delete}
          style={{ width: "100px", fontSize: "15px" }}>
          삭제
        </button>
      </div>
    </div>
  );
}
