package kr.or.iei.user.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.iei.user.model.dto.WalletHistoryDto;
import kr.or.iei.user.model.dto.WalletStatusDto;

@Mapper
public interface WalletDao {

    WalletStatusDto selectWalletStatus(@Param("userId") Long userId);

    List<WalletHistoryDto> selectWalletHistory(@Param("userId") Long userId,
                                              @Param("offset") int offset,
                                              @Param("size") int size);

    int selectWalletHistoryCount(@Param("userId") Long userId);

}
