package kr.or.iei.portfolio.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.portfolio.model.dto.Portfolio;

@Mapper
public interface PortfolioDao {

	List<Portfolio> getPortfolioByUserNo(String userNo);

}
