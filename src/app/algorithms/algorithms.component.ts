import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import {AlgorithmLoaderService} from '../algorithm-loader.service'
import { AlgorithmExternal } from '../algorithm-external';
import { Observable, fromEvent, of, throwError } from 'rxjs';
import { debounce, map, debounceTime, catchError, filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AlgorithmComment } from '../algorithm-comment';
import { TinymceEditorComponent } from '../tinymce-editor/tinymce-editor.component';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-algorithms',
  templateUrl: './algorithms.component.html',
  styleUrls: ['./algorithms.component.css']
})
export class AlgorithmsComponent implements OnInit, AfterViewInit {
  
  @ViewChildren(TinymceEditorComponent) editorsSection : QueryList<TinymceEditorComponent>;
  private commentEditorId : string = "";
  private  userComment : AlgorithmComment = new AlgorithmComment(0, -1, "", null, null, null);
  public replyTo : string = null; // can be removed later

  //element of out root comment block
  @ViewChild(CommentComponent, {static: false}) commentMainComponent: CommentComponent;

  private algorithmsTitles : AlgorithmExternal[] = [];
  public foundAlgos: AlgorithmExternal[] = [];
  // public algorithmChosen : AlgorithmExternal;

  public commentsOfChosenAlgo : AlgorithmComment[] = [];

  private breakPointMenuCollapseMediaQuery : string = "(max-width: 720px)";
  public algoMenuIsOpen : boolean = false;
  public navMenuIsOpen : boolean = false;
  public prevModeIsSmall : boolean = false;

  public currentAlgorithm : AlgorithmExternal = null;
  public currentAlgorithmHandledHTML : string = "";

  constructor(private algoLoader : AlgorithmLoaderService) {
    this.refreshAllAlgorithmsTitles();
  }

  ngOnInit() {}

  ngAfterViewInit(){
    this.searchAlgorithm();
    //menu is open by default in css if screen mode >720px and closed else
    this.algoMenuIsOpen = !this.isSmallScreen();
    this.prevModeIsSmall = this.isSmallScreen();
    this.startTogglerHandler();
  }

  refreshAllAlgorithmsTitles() : void{
    this.algoLoader.getAlgoTitles().subscribe(algos => {
      this.algorithmsTitles = algos;
      this.foundAlgos = algos;

      //load current algorithm
      this.algoLoader.getAlgorithmById(algos[0].id).subscribe(
        (alg) => {
          this.handleAndSetCurrentAlgo(alg);
        }
      );
    });
  }

  setCommentsForAlgo(algoId : number) : void {
    this.commentsOfChosenAlgo = [];
    
    this.algoLoader.getCommentsAllByAlgoId(algoId).subscribe(
      commentsAll => {
        this.commentsOfChosenAlgo = commentsAll;
      }
    );
  }

  handleAndSetCurrentAlgo(alg : AlgorithmExternal) : void{
    for (let s of alg.sections){
      s.text = this.handleAlgorithmHTML(s.text);
    }
    this.currentAlgorithm = alg;

    //write logic for comments loading
    this.setCommentsForAlgo(this.currentAlgorithm.id);
  }

  replaceWhitespaces(s : string){
    return s.replace(/\s+/g, " ").trim();
  }

  constructRegexForSearch(input : string) : RegExp{
    input = this.replaceWhitespaces(input);
    
    let regex : string;
    regex = input + "|(";
    for (let ch of input){
      regex += ch + "+?[\\S\\s]*?"; //lazy
    }
    regex += ")";

    return new RegExp(regex, "i");
  }

  searchAlgorithm() {
    let obj : HTMLInputElement = document.querySelector("#cust-serch-bar");
    const o : Observable<Event> = fromEvent(obj, 'input');
    o.pipe(debounceTime(500)).subscribe(() => {
      this.updateFoundAlgos(obj.value);
    });
  }

  updateFoundAlgos(pattern : string) : void{
    if (pattern == ""){
      this.foundAlgos = this.algorithmsTitles;
    }
    
    this.foundAlgos = [];
    let fullMatch : AlgorithmExternal[] = [];
    let toBeSorted : AlgorithmExternal[] = [];

    let regex : RegExp = this.constructRegexForSearch(pattern);  
    let regexFullMatch : RegExp =  new RegExp(this.replaceWhitespaces(pattern), "i");

    for (let alg of this.algorithmsTitles){
      if (regex.test(alg.title)){
        if (regexFullMatch.test(alg.title)){
          fullMatch.push(alg);
        } else {
          toBeSorted.push(alg);
        }
      }
    }

    this.foundAlgos = fullMatch.concat(
      toBeSorted.sort((a, b) => {
        return a.title.localeCompare(b.title)
      })
    );
  }
  
  onAlgorithmChosenClicked(algoId : number) : void {
    this.algoLoader.getAlgorithmById(algoId)
    .pipe(catchError(this.handleErrorGet))
    .subscribe(
      {
        next: (alg) => {
          this.handleAndSetCurrentAlgo(alg as AlgorithmExternal);
        },
        error: e => console.log(e)
      }
    );
  }

  handleErrorGet(error : HttpErrorResponse) : Observable<HttpErrorResponse>{
      return throwError(error);
  }

  toggleAlgoMenu(){
    document.querySelector('#sidebar').classList.toggle('active');
    document.querySelector('#content').classList.toggle('active');
  }

  onToggleButtonClicked(){
    this.algoMenuIsOpen = !this.algoMenuIsOpen;
    this.toggleAlgoMenu();
  }

  startTogglerHandler() : void{
    fromEvent(window, 'scroll').subscribe(e =>{
        this.resizeMenu();
      }
    );  

    fromEvent(window, 'resize').subscribe(
      (e) => {
        this.resizeMenu();
      }
    );

    fromEvent(document.querySelector('.navbar-toggler'), 'click').subscribe(
      () => {
        this.navMenuIsOpen = !this.navMenuIsOpen;
        this.resizeMenu();
      }
    );

    let contentDiv = document.querySelector("#content");
    fromEvent(contentDiv, 'click')
    .pipe(filter(e => (this.isSmallScreen() && this.algoMenuIsOpen)))
    .subscribe((e) => {
      this.onToggleButtonClicked();
    });
  }

  resizeMenu() : void{
    //if mode was changed while resizing
    if (this.prevModeIsSmall != this.isSmallScreen()){  
      if (this.isSmallScreen()){ //lg -> sm
        this.algoMenuIsOpen = false;
      } else { //sm -> lg
        document.querySelector('#sidebar').classList.remove('active')
        document.querySelector('#content').classList.remove('active');
        this.algoMenuIsOpen = true;
      }
    }

    let sidebar : HTMLElement = document.getElementById('sidebar');
    let hideOffset : number = this.isSmallScreen() ? 142 : 102;

    if (pageYOffset > hideOffset){
      sidebar.style.top = 0 + "px";
      sidebar.style.height = "100%";
    } else if (pageYOffset == 0){
      sidebar.style.top = hideOffset + "px";
      sidebar.style.height = "calc(100% - " +  hideOffset + "px)";    
    } else {
      sidebar.style.top = (hideOffset - pageYOffset) + "px";
      sidebar.style.height = "calc(100% - " +  pageYOffset + "px)";    
    }

    this.prevModeIsSmall = this.isSmallScreen();
  }

  /*
   * Anchor tag click handler to prevent default action of going to href attribute value.
   * Used as a stub
  */
  onAlgorithmTitleClicked($event : Event) : void{
    $event.preventDefault();
  }

  /*
   * Checks if not screen in mode <= px width 720
  */
  isSmallScreen() : boolean{
      return window.matchMedia(this.breakPointMenuCollapseMediaQuery).matches;
  }

  /**
   * Handle html code of algorithm to be displayed
  */
  handleAlgorithmHTML(content : string) : string{        
      //find all img tags
      //array of matched strings is returded; if no mathes found, null is returned
      let inputImgTags = content.match(/<\s*img[\t\s]+[^>]*>/g); 
      if (inputImgTags === null) {
        return content; 
      }
  
      //array of corrected img tags
      let outputImgTags = [];
      for (let tagStr of inputImgTags){
        let s = tagStr.slice(0, tagStr.length-2);
        //if class value set, the only first class declaration is read
        s = s.replace(/class\=\s*"[^"]*"/gi, 'class="img-fluid m-2"');
        //if there was no class attribute, add it
        s += ' class="img-fluid m-2" />';
        outputImgTags.push(s);
      }
  
      //replace all old img tags for custom label and then replace label with 
      //corresponding chandeg img tag
      //replacing with label can be omited, function will be simplified
      const tmpTag = "<CAST_LABEL_IMG_TAG/>";
      let tmpContent = content.replace(/<\s*img[\t\s]+[^>]*>/g, tmpTag);
      for (let i = 0; i < outputImgTags.length; i++){
        
        console.log(outputImgTags[i]);
        
        tmpContent = tmpContent.replace(/<CAST_LABEL_IMG_TAG\/>/, outputImgTags[i]);
      }
      
      return tmpContent;
  }

  onReplyButtonClicked(comment: AlgorithmComment) : void {
    this.userComment.parentId = comment.id;

    this.editorsSection.forEach(editor => {
      editor.setFocus();
    });

    //replace with user name
    this.replyTo = "userName with id : " + comment.id;
  }

  onSendCommentButtonClicked() : void {
    let text = "";
    this.editorsSection.forEach(tinymceEditor => text = tinymceEditor.getEditorContent());

    this.userComment.algo = this.currentAlgorithm;
    this.userComment.text = text;

    this.algoLoader.postComment(this.currentAlgorithm.id, this.userComment).subscribe(
      (commentInserted) => {
        console.log("post comment sent");
        this.commentsOfChosenAlgo.push(commentInserted);
        this.editorsSection.forEach(tinymceEditor => tinymceEditor.setEditorContent(""));
        this.userComment = new AlgorithmComment(0, -1, "", null, null, null);
        this.replyTo = "";
        this.commentMainComponent.ngOnInit();
      }
    );

    // this.userComment = null;
    this.userComment = new AlgorithmComment(0, -1, "", null, null, null);
  }

  saveEditorIdString(commentEditorId : string) : void{
    this.commentEditorId = commentEditorId;
  } 

  onCloseButtonClicked() : void {
    this.userComment.parentId = -1;
    this.replyTo = "";
  }

}