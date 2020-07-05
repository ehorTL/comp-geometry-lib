import { Component, OnInit, ViewChildren, QueryList, DoCheck, AfterViewInit, AfterContentChecked} from '@angular/core';
import { SectionExternal } from '../section-external';
import { TinymceEditorComponent } from '../tinymce-editor/tinymce-editor.component';
import {AlgorithmLoaderService} from '../algorithm-loader.service'
import { AlgorithmExternal } from '../algorithm-external';
import { SectionTitle } from '../section-title';
import { Observable, of } from 'rxjs';

declare var tinymce: any;
//a solution of "Cannot find name Swal" issue
declare let Swal: any;

@Component({
  selector: 'app-manager-algo-page-content',
  templateUrl: './manager-algo-page-content.component.html',
  styleUrls: ['./manager-algo-page-content.component.css']
})
export class ManagerAlgoPageContentComponent implements OnInit, AfterViewInit {

  warningAlgoNameEmpty = "Назва алгоритму не може бути пустою. Введіть назву!"

  @ViewChildren(TinymceEditorComponent) editorsSection : QueryList<TinymceEditorComponent>;
  sectionPairs : Map<string, number> = new Map();
  bindedCounter: number;

  algorithm : AlgorithmExternal = null;
  algorithms : AlgorithmExternal[];
  actionToDo: Action;
  actionEnum = Action;

  sectionTitles : SectionTitle[] = [];
  selectedAlgoId : number ;

  public static readonly ALGO_ID_FORBIDDEN : number = -1;
  public static readonly ALGO_NAME_DEFAULT : string = "New Algorithm";

  constructor(private algorithmLoader : AlgorithmLoaderService) {
    this.bindedCounter = 0;
    this.actionToDo = Action.notgiven;
    this.loadAllAlgorithmsTitles();
    this.selectedAlgoId = ManagerAlgoPageContentComponent.ALGO_ID_FORBIDDEN; //-1
    this.loadSectionTitles();

  }

  ngAfterViewInit(){}
  changedtext() : void{}
  ngOnInit() {}

  refreshAlgorithm() : void{
    this.loadAlgorithmById(this.algorithm.id); 
    this.loadAllAlgorithmsTitles(); //not obviously
  }

refreshAllAlgorithms() : void{
    this.loadAllAlgorithmsTitles();
    this.setPageContent(this.algorithm);
}

  bindToSection(editorPageIDString : string, sectionInArrayIndex: number) : void{
      this.sectionPairs.set(editorPageIDString, sectionInArrayIndex);    
      ++this.bindedCounter;
  }

  loadAllAlgorithmsTitles() : void{
    this.algorithmLoader.getAlgoTitles().subscribe(algos => {this.algorithms = algos;});
  }

  loadSectionTitles() : void{
    this.algorithmLoader.getSectionTitles().subscribe(sectionTitlesLoaded => {
      this.sectionTitles = sectionTitlesLoaded;
      this.sectionTitles.sort(function(section1, section2){
        return (section1.order - section2.order);
      });
    });
  }  

  onTitleSelected(event : any){

    let selectedFormattedString : string = event.target.value;

      var arr = selectedFormattedString.split('.', 1);
      if (arr.length != 1){
        return;
      }
      var parsedIndex = parseInt(arr[0]);
      if (isNaN(parsedIndex)){
        return;
      }
      if ((parsedIndex >= this.algorithms.length) || (parsedIndex < 0)){
        return;
      }

      this.selectedAlgoId = this.algorithms[parsedIndex].id;
      this.loadAlgorithmById(this.algorithms[parsedIndex].id);
  }

  loadAlgorithmById(algoId : number) :void{
    this.algorithmLoader.getAlgorithmById(algoId).subscribe(algo => {
      this.algorithm = algo;
      this.setPageContent(algo)
   });
  }

  setPageContent(algo : AlgorithmExternal) : void{
    this.editorsSection.forEach(tinymceEditor =>{
      if (this.sectionPairs.has(tinymceEditor.editorIdString)){
        let index : number =  this.sectionPairs.get(tinymceEditor.editorIdString);
        tinymceEditor.setEditorContent(
          ((algo && algo.sections && (algo.sections.length > index)) ? 
            algo.sections[index].text : "")
          );
      }
    });
  }

  onEditButtonClicked(): void{
    this.actionToDo = Action.edit;
    this.algorithm = null;
    this.refreshAllAlgorithms();
  }

  onCreateButtonClicked(): void{
    if (this.sectionTitles.length == 0) {
      return;
    }
    this.actionToDo = Action.create;
    this.algorithm = new AlgorithmExternal(ManagerAlgoPageContentComponent.ALGO_ID_FORBIDDEN,
      ManagerAlgoPageContentComponent.ALGO_NAME_DEFAULT, []);
    this.setPageContent(this.algorithm);
  }

  onConfirmButtonClicked() : void {
    if ((this.actionToDo != Action.create) && (this.actionToDo != Action.edit)){
      return;
    } 

    Swal.fire({
      title: 'Ви впевнені?',
      text: 'Алгоритм буде ' + ((this.algorithm.id == ManagerAlgoPageContentComponent.ALGO_ID_FORBIDDEN) ? 'додано' : 'змінено'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Підтвердити',
      cancelButtonText: 'Відміна'
    }).then((result) => {
      //if true (confirmed by user)
      if (result.value) { 
        if (this.actionToDo == Action.create){
            this.createAlgo().subscribe((alg) => {
              // this.refreshAlgorithm();
              this.onCreateButtonClicked();
              this.alertSuccess("Успішно виконано", "");});
        } else if (this.actionToDo == Action.edit){
            this.updateAlgo().subscribe((alg) => {
              // this.refreshAlgorithm();
              this.onEditButtonClicked();
              this.alertSuccess("Успішно виконано", ""); });
        } 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.alertCancelled();
      }
    });
  }

  onDeleteButtonClicked() : void{
    if (this.algorithm.id == ManagerAlgoPageContentComponent.ALGO_ID_FORBIDDEN){
      return; //error, using forbidden algo id
    }

    Swal.fire({
      title: 'Ви впевнені?',
      text: 'Алгоритм буде видалено', 
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Підтвердити',
      cancelButtonText: 'Відміна'
    }).then((result) => {
      //if true (confirmed by user)
      if (result.value) { 
        this.algorithmLoader.deleteAlgorithm(this.algorithm).subscribe(() => {
        this.algorithm = null;
        this.refreshAllAlgorithms();
        this.alertSuccess("Успішно виконано", "");});
      } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.alertCancelled();
      }
    });
  }

  updateAlgo() : Observable<AlgorithmExternal>{
    this.writeSectionsInAlgorithmFromEditors();
    return this.algorithmLoader.putAlgorithm(this.algorithm);
  }

  createAlgo() : Observable<AlgorithmExternal> {
    this.writeSectionsInAlgorithmFromEditors();
    return this.algorithmLoader.postAlgorithm(this.algorithm);
  }

  writeSectionsInAlgorithmFromEditors() : void{
    this.algorithm.sections = [];
    this.editorsSection.forEach(tinymceEditor =>{
      if (this.sectionPairs.has(tinymceEditor.editorIdString)){
          this.algorithm.sections.push(new SectionExternal(-1, 
          this.sectionTitles[this.sectionPairs.get(tinymceEditor.editorIdString)], 
          tinymceEditor.getEditorContent(), []));
      }
    });
  }

  alertCancelled(): void{
    Swal.fire('Відмінено', '', 'error');
  }

  alertSuccess(header : string, subheader : string) : void{
    Swal.fire(header, subheader, 'success');
  }

  alertError(header : string, subheader : string, error : string) : void{
    Swal.fire(header, subheader + '\n' + error, 'error');
  }
}

export enum Action{
  notgiven = 0,
  create,
  edit
}