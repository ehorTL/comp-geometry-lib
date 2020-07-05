import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import {IdProviderService} from '../id-provider.service'
declare var tinymce: any;

@Component({
  selector: 'app-tinymce-editor',
  templateUrl: './tinymce-editor.component.html',
  styleUrls: ['./tinymce-editor.component.css']
})
export class TinymceEditorComponent implements OnInit, AfterViewInit {

  @Input() editorHeight : number;
  @Output() onCreateSignal = new EventEmitter<any>();
  editorIdString: string = ""; 
  readonly idPrefix : string = "custEditorId";

  constructor(public idProvider : IdProviderService) { 
    this.editorIdString = this.idPrefix + new Number(idProvider.getId()).toString();
  }

  ngOnInit() {}

  ngAfterViewInit(){
    console.log("AFTER VIEW INIT IN EDITOD: " + document.querySelector("#"+this.editorIdString));
    this.editorInit("#" + this.editorIdString, this);
  }

  setEditorContent(content: string){    
    tinymce.get(this.editorIdString).setContent(content);
  }

  getEditorContent() : string{    
    return tinymce.get(this.editorIdString).getContent();
  }

  editorInit(myselector: string, context : any) : void{
    tinymce.init({
    selector: myselector,
    plugins: 'a11ychecker advcode casechange formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker',
    toolbar: 'a11ycheck addcomment showcomments casechange checklist code formatpainter pageembed permanentpen table',
    toolbar_mode: 'floating',
    width: '100%',
    height: this.editorHeight,
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    init_instance_callback: function(editor){
      console.log("init_instance_callback!");
      context.onCreateSignal.emit(context.editorIdString);
    },
    //setup: function (editor) {editor.on('init', function () {});}
  });
}

  setFocus(): void {
    tinymce.get(this.editorIdString).focus();
  }
}
