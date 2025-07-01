package kr.or.iei.user.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.user.model.dao.WalletDao;
import kr.or.iei.user.model.dto.WalletHistoryDto;
import kr.or.iei.user.model.dto.WalletPageDto;
import kr.or.iei.user.model.dto.WalletStatusDto;

@Service
public class WalletService {

    @Autowired
    private WalletDao walletDao;

    public WalletStatusDto getWalletStatus(String userId) {
        return walletDao.selectWalletStatus(userId);
    }

    public List<WalletHistoryDto> getWalletHistory(String userId, int page, int size) {
        int offset = (page - 1) * size;
        return walletDao.selectWalletHistory(userId, offset, size);
    }

    public WalletPageDto getWalletPageInfo(String userId, int size) {
        // 예: 전체 내역 수, 현재 페이지, 페이지당 데이터 수 등 포함 가능
        int totalCount = walletDao.selectWalletHistoryCount(userId);
        int totalPage = (int) Math.ceil((double) totalCount / size);
        
        WalletPageDto pageDto = new WalletPageDto();
        pageDto.setTotalCount(totalCount);
        pageDto.setTotalPage(totalPage);
        pageDto.setPageSize(size);
        return pageDto;
    }
}
