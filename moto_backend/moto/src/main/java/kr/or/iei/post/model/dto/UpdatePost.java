package kr.or.iei.post.model.dto;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePost {
    private int postNo;                  // 게시글 번호
    private String postContent;          // 게시글 내용
    
    // 새로 업로드할 파일들
    private List<MultipartFile> newFiles;
    
    // 삭제할 파일 번호 목록
    private List<Integer> delFiles;
}