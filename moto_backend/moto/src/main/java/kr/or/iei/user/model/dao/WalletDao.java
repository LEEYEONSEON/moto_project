package kr.or.iei.user.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.iei.user.model.dto.WalletHistoryDto;
import kr.or.iei.user.model.dto.WalletPageDto;
import kr.or.iei.user.model.dto.WalletStatusDto;

@Mapper
public interface WalletDao {

    WalletStatusDto selectWalletStatus(@Param("userId") String userId);

    List<WalletHistoryDto> selectWalletHistory(@Param("userId") String userId, 
                                               @Param("offset") int offset, 
                                               @Param("limit") int limit);

    int selectWalletHistoryCount(@Param("userId") String userId);
}
