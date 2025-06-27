package kr.or.iei.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * WalletPageDTO
 * - 지갑 거래내역 페이징 처리를 위한 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletPageDto {
    private int currentPage;               // 현재 페이지 번호
    private int totalPages;                // 전체 페이지 수
    private int pageSize;                  // 한 페이지 당 항목 수
    private int totalRecords;              // 전체 거래 내역 수

    public void setTotalCount(int totalCount) {
        this.totalRecords = totalCount;
    }
}