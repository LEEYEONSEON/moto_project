package kr.or.iei.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.member.model.service.MemberService;

@RestController
@CrossOrigin("*")
@RequestMapping("/member")
public class MemberController {
	
	
	@Autowired
	private MemberService service;
	
	public void test() {
		System.out.println("안녕 난 모투야");
		System.out.println("안녕 난 모투야");
		System.out.println("안녕 난 모투야");
		System.out.println("안녕 난 모투야");
		System.out.println("안녕 난 모투야");
		System.out.println("안녕 난 모투야");
		System.out.println("안녕 난 모투야");
		System.out.println("안녕 난 모투야");
	}
	
	
}
