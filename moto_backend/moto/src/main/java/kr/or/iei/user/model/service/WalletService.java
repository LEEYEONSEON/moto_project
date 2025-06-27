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

    public WalletStatusDto getWalletStatus(Long userId) {
        return walletDao.selectWalletStatus(userId);
    }

    public List<WalletHistoryDto> getWalletHistory(Long userId, int page, int size) {
        int offset = (page - 1) * size;
        return walletDao.selectWalletHistory(userId, offset, size);
    }

    public WalletPageDto getWalletPageInfo(Long userId, int size) {
        int totalCount = walletDao.selectWalletHistoryCount(userId);
        int totalPages = (int) Math.ceil((double) totalCount / size);

        WalletPageDto pageDto = new WalletPageDto();
        pageDto.setTotalCount(totalCount);
        pageDto.setPageSize(size);
        pageDto.setTotalPages(totalPages);

        return pageDto;
    }
}