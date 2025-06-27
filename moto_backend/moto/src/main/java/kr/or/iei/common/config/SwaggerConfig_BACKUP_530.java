package kr.or.iei.common.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
public class SwaggerConfig {
<<<<<<< HEAD
	
	private ApiInfo swaggerInfo() {
		//title : API 문서 제목
		//description : API 문서 설명
		return new ApiInfoBuilder().title("MEMBER API").description("회원관리 기능 CRUD 문서").build();
=======
	private ApiInfo swaggerInfo() {
		//title : API 문서 제목
		//description : API 문서 설명
		
		return new ApiInfoBuilder().title("MEMBER API").description("회원관리 기능 CRUD 문서").build();
		
>>>>>>> master
	}
	
	//테스트 시, 요청 형식 지정
	private Set<String> getConsumeContentType(){
<<<<<<< HEAD
		Set<String> consumes = new HashSet<String>();
		
		//문서에서 테스트 요청 시, JSON 타입 또는 Form 태그 형식의 요청을 허용하기 위한 코드
		consumes.add("application/json; charset=utf-8"); 
=======
		
		Set<String> consumes = new HashSet<String>();
		//문서에서 테스트 요청 시, JSON 타입 또는 Form 태그 형식의 요청을 허용하기 위한 코드.
		consumes.add("application/json; charset=utf-8");
>>>>>>> master
		consumes.add("application/x-www-form-urlencoded");
		
		return consumes;
	}
	
	//테스트 시, 응답 형식 지정
<<<<<<< HEAD
	private Set<String> getProduceContentType(){
=======
	private Set<String> getProduceContentType() {
>>>>>>> master
		Set<String> produces = new HashSet<String>();
		
		produces.add("application/json; charset=utf-8");
		produces.add("plain/text; charset=utf-8");
		
		return produces;
	}
	
<<<<<<< HEAD
	//Swagger API 문서 객체 생성
	@Bean
	public Docket swaggerApi() {
		return new Docket(DocumentationType.SWAGGER_2)
					.consumes(getConsumeContentType()) 				//요청 형식
					.produces(getProduceContentType())   			//응답 형식
					.apiInfo(swaggerInfo()).select() 				//API 정보
					.apis(RequestHandlerSelectors.basePackage("kr.or.iei")) //문서로 만들 API들이 존재하는 베이스 패키지
					.paths(PathSelectors.any())						//모든 URL 패턴을 문서에 포함시킴
					.build()										//최종적으로 Docket(문서 객체) 생성
					.useDefaultResponseMessages(false);				//Swagger 기본적으로 제공하는 응답메시지 설정 비활성화.
=======
	//Swagger
	@Bean
	public Docket swaggerApi() {
		return new Docket(DocumentationType.SWAGGER_2)
				.consumes(getConsumeContentType())			//요청 형식
				.produces(getProduceContentType())			//응답 형식
				.apiInfo(swaggerInfo()).select()			//API 정보
				.apis(RequestHandlerSelectors.basePackage("kr.or.iei")) //문서로 만들 API 들이 존재하는 베이스 패키지 
				.paths(PathSelectors.any())					//모든 URL 패턴을 문서에 포함시킴
				.build()									//최종적으로 Docket(문서 객체) 생성
				.useDefaultResponseMessages(false);			//swagger 기본적으로 제공하는 응답메시지 설정 비활성화.
>>>>>>> master
	}
}
