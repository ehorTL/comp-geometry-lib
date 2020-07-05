import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlgorithmComment } from '../algorithm-comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Output() replyEvent = new EventEmitter<AlgorithmComment>();

  constructor() { }
  ngOnInit() {
  }

  @Input() dataList: AlgorithmComment[];
  @Input() parentId: number;

  removeCurrentLevelItems=(datalist : AlgorithmComment[], parentId : number)=>{
    return datalist.filter(item => item.parentId != this.parentId);
  }

  onReplyButtonClicked(comment : AlgorithmComment){
    this.replyEvent.emit(comment);
  }

  /**
   * Handle html code comment to be displayed with responsive images
  */
handleCommentHTMLReplaceImg(content : string) : string{    
  let inputImgTags = content.match(/<\s*img[\t\s]+[^>]*>/g); 
  if (inputImgTags === null) {
    return content; 
  }

  let outputImgTags = [];
  for (let tagStr of inputImgTags){
    let s = tagStr.slice(0, tagStr.length-2);
    s += ' class="img-fluid" />';
    outputImgTags.push(s);
  }

  const tmpTag = "<CAST_LABEL_IMG_TAG/>";
  let tmpContent = content.replace(/<\s*img[\t\s]+[^>]*>/g, tmpTag);
  for (let i = 0; i < outputImgTags.length; i++){
    tmpContent = tmpContent.replace(/<CAST_LABEL_IMG_TAG\/>/, outputImgTags[i]);
  }
  
  return tmpContent;
}

}
