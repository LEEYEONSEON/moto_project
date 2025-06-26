package kr.or.iei.common.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUtil {
	
	
	//application.properties에 작성된 파일 경로(C:/Temp/react)
	@Value("${file.uploadPath}")
	private String uploadPath;
	
	public String uploadFile(MultipartFile file, String savePath) throws IOException {
		//중복되지 않도록 서버에 저장될 파일명을 생성 => 파일 업로드
		
		int ranNum = new Random().nextInt(10000)+1; // 1~10000까지의 랜덤 숫자
		
		String str = "_" + String.format("%05d", ranNum); // "_랜덤숫자5자리";
		
		String name = file.getOriginalFilename();	//사용자가 업로드한 실제 파일명 => test.jpg
		String ext = null; //확장자 저장 변수
		
		int dot = name.lastIndexOf("."); //파일명 뒤에서부터 마침표(.)의 위치. 없으면 -1을 리턴
		
		if(dot != -1) {
			ext = name.substring(dot);	// .jpg
		}else {
			ext = "";
		}
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS"); //년도 4자리 월 2자리 일 2자리 시간 2자리 분 2자리 초 2자리 밀리초 3자리
		String serverFileName = sdf.format(new Date(System.currentTimeMillis())) + str + ext;
								//test.jpg => "20250624151520485" + "_00485" + ".jpg";
		
		String serverDirectory = serverFileName.substring(0, 8); // "20250624"
		
		//savePath => /editor/
		savePath = uploadPath + savePath + serverDirectory + File.separator;
		//  "C:/Temp/react"  + "/editor/" + "20250624" + "/"
		
		//파일 업로드 처리
		BufferedOutputStream bos = null;
		
		try {
			File directory = new File(savePath);
			if(!directory.exists()) {
				directory.mkdirs();
			}
			
			byte [] bytes = file.getBytes();
			bos = new BufferedOutputStream(new FileOutputStream(new File(savePath + serverFileName)));
			bos.write(bytes);
		}finally {
			bos.close();
		}
		
		//"20250624151520485_00485.jpg"
		return serverFileName;
	}
}
