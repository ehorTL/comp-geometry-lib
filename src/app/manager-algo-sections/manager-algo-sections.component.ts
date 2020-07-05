import { Component, OnInit } from '@angular/core';
import { SectionTitle } from '../section-title';
import {AlgorithmLoaderService} from '../algorithm-loader.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

//a solution of "Cannot find name Swal" issue
declare let Swal: any;

@Component({
  selector: 'app-manager-algo-sections',
  templateUrl: './manager-algo-sections.component.html',
  styleUrls: ['./manager-algo-sections.component.css']
})
export class ManagerAlgoSectionsComponent implements OnInit {
  namePlaceholder : string  = "Enter section name";
  sectionTitles: SectionTitle[] = [];
  idPlaceholder = -1; // unallowable id for real database, so used as a marker of newly created section
  sectionTitlesChangedTo: SectionTitle[] = [];

  constructor(private algoLoaderService: AlgorithmLoaderService) { }

  ngOnInit() {
    this.loadSectionTitles();
  }

  refreshSections() : void{
    this.ngOnInit();
  }

  loadSectionTitles() : void{
    this.algoLoaderService.getSectionTitles().subscribe(secTitles => {
      this.sectionTitles = secTitles;
      this.sectionTitles.sort(function(secTitle1, secTitle2){
        return (secTitle1.order - secTitle2.order);
      });
      this.sectionTitlesChangedTo = this.sectionTitles.map(function(item){return new SectionTitle(item.id, item.title, item.order)});
    });
  }

  createSectionTitle(sectionTitle : SectionTitle) : Observable<SectionChangeServerReport>{
    return this.algoLoaderService.postSectionTitle(sectionTitle).pipe(
      map(() => new SectionChangeServerReport(ServerReport.CREATED, "ok")));
  }
  
  updateSectionTitle(sectionTitle : SectionTitle) : Observable<SectionChangeServerReport>{
    return this.algoLoaderService.putSectionTitle(sectionTitle).pipe(
      map(() => new SectionChangeServerReport(ServerReport.UPDATED, "ok")));
  }

  alertDeleted() : void{
    Swal.fire('Розділ виданено ', 'Розділ видалено з усіх алгоритмів', 'success');
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

  deleteSectionTitle(sectionTitle : SectionTitle) : Observable<SectionChangeServerReport>{
    return this.algoLoaderService.deleteSectionTitle(sectionTitle).pipe(
      map(() => new SectionChangeServerReport(ServerReport.DELETED, "ok")));
  }

  deleteSectionTitleFromArrayByIndex(arrayIndex: number) : void{
    this.sectionTitles.splice(arrayIndex, 1);
    this.sectionTitles.forEach( (currentSectionTitle, index) => {
    if (currentSectionTitle.id == this.idPlaceholder){
      currentSectionTitle.order = (index + 1);
    }
  });

  this.sectionTitlesChangedTo.splice(arrayIndex, 1);
  this.sectionTitlesChangedTo.forEach( (currentSectionTitle, index) => {
    if (currentSectionTitle.id == this.idPlaceholder){
      currentSectionTitle.order = (index + 1);
    } else{
      currentSectionTitle.order = this.sectionTitles[index].order;
    }
  });
  }

  addNewSection() : void{
    var st = new SectionTitle(this.idPlaceholder, "", this.sectionTitles.length + 1);
    this.sectionTitles.push(st);
    this.sectionTitlesChangedTo.push(new SectionTitle(st.id, st.title, st.order));
  }
  
  sectionNameChanged(sectionTitle : SectionTitle, event: any){
    sectionTitle.title = event.target.value;
  }

  sectionOrderChanged(sectionTitle : SectionTitle, $event : any){
    sectionTitle.order = $event.target.value;
  }
  
  onConfirmChangeSectionClicked(sectionTitle : SectionTitle, event : any, arrayIndex: number){
    //nothing to change, not obvious
    if (arrayIndex < 0 || arrayIndex >= this.sectionTitles.length) {
      return;
    }
    
    //define if the section is newly created
    let isNewSectionTitle : boolean = (sectionTitle.id == this.idPlaceholder);
    
    //confirmation alert needed, used one from sweetalert2
    Swal.fire({
      title: 'Ви впевнені?',
      text: 'Розділ буде ' + (isNewSectionTitle ? 'додано' : 'змінено'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Підтвердити',
      cancelButtonText: 'Відміна'
    }).then((result) => {
      if (result.value) { //if true (confirmed by user)
        if (isNewSectionTitle){
            this.createSectionTitle(sectionTitle).subscribe(serverResponseObj => {
              if(serverResponseObj.state == ServerReport.CREATED){
                this.alertSuccess("Успішно виконано", "");
                this.refreshSections();
              } else{
                this.alertError("Не виконано", "Проблема", serverResponseObj.message);
              }
            });
        } else {
            this.updateSectionTitle(sectionTitle).subscribe(serverResponseObj => {
              if(serverResponseObj.state == ServerReport.UPDATED){
                this.alertSuccess("Успішно виконано", "");
                this.refreshSections();
              } else{
                this.alertError("Не виконано", "Проблема", serverResponseObj.message);
              } 
            });
        } 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.alertCancelled();
      }
    });
  }

  onDeleteButtonClicked(sectionTitle : SectionTitle, event : any, arrayIndex: number) : void {
    //nothing to delete, not obvious
    if (arrayIndex < 0 || arrayIndex >= this.sectionTitles.length) {
      return;
    }

    //if sectionTitle is newly created (changes are not saved on server)
    if (sectionTitle.id == this.idPlaceholder){
      this.deleteSectionTitleFromArrayByIndex(arrayIndex);
    }
    
    // confirmation alert needed, used one from sweetalert2
    else {
      Swal.fire({
        title: 'Ви впевнені?',
        text: 'Дані будуть незвотньо видалені! Даний розділ буде видалений з усіх алгоритмів!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Видалити!',
        cancelButtonText: 'Відміна'
      }).then((result) => {
        if (result.value) { //if true (confirmed by user)
            this.deleteSectionTitle(sectionTitle).subscribe(serverResponseObj => {
              if (serverResponseObj.state == ServerReport.DELETED){
                this.deleteSectionTitleFromArrayByIndex(arrayIndex);
                this.refreshSections();
                this.alertDeleted();
              } else {
                this.alertError("Не видалено", "Проблема", serverResponseObj.message);
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.alertCancelled();
        }
      });
    }
  }
}

export class SectionChangeServerReport{
  constructor(public state : ServerReport, public message: string){
  }
}

export enum ServerReport{
  ERROR = 0,
  CREATED,
  UPDATED,
  DELETED,
  READ
}

