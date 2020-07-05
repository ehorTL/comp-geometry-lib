import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AlgorithmExternal } from './algorithm-external';
import {map} from 'rxjs/operators';
import { SectionExternal } from './section-external';
import { SectionTitle } from './section-title';
import { AlgorithmComment } from './algorithm-comment';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmLoaderService {

  private host : string = "https://compgeometry.herokuapp.com/";

  private getURLAlgoList = this.host + "algorithm/all";
  private getURLAlgoById = this.host + "algorithm/"; // /id
  private postURLAlgo = this.host + "algorithm/manager/add";
  private putURLAlgo =  this.host + "algorithm/manager/update/";// /id
  private deleteURLAlgo =  this.host + "algorithm/manager/delete/"; // /id

  private getURLSectionTitles =  this.host + "manager/sectiontitle/all";
  private getURLSectionTitleById = this.host + "manager/sectiontitle/";//id
  private postURLSectionTitle =  this.host + "manager/sectiontitle/add";
  private putURLSectionTitle =  this.host + "manager/sectiontitle/update/";//id
  private deleteURLSectionTitle =  this.host + "manager/sectiontitle/delete/"; //id
  
  getURLCommentsByAlgoId(algoId : number) : string{
      return this.host + "algorithm/" + algoId + "/comments";
  }

  getURLCommentsByParentId (algoId : number, parentId : number){
      return this.host + "algorithm/" + algoId + "/comments/children/" + parentId; 
  }
  
  postURLCommentByAlgoId(algoId : number){
    return this.host + "algorithm/" + algoId + "/comments/user/add";
  }

  deleteURLCommentByAlgorithmId(algoId : number, commentId : number){
      return this.host + "algorithm/" + algoId + "/comments/manager/delete/" + commentId;
  }

  constructor(private http : HttpClient) {}

  getSectionTitles() : Observable<SectionTitle[]>{
    return this.http.get<SectionTitle[]>(this.getURLSectionTitles);
  }

  getAlgorithmById(algoId: number) : Observable<AlgorithmExternal>{
    var url = this.getURLAlgoById + new Number(algoId).toString();
    return this.http.get<AlgorithmExternal>(url);
  }

  getAlgoTitles() : Observable<AlgorithmExternal[]>{
    return this.http.get<any[]>(this.getURLAlgoList).pipe(
      map(algolist => algolist.map(algoitem => new AlgorithmExternal(algoitem.id, algoitem.title, null)))
    );
  }

  putSectionTitle(sectionTitle: SectionTitle) : Observable<any>{
    var url = this.putURLSectionTitle + new Number(sectionTitle.id).toString();
    return this.http.put<SectionTitle>(url, sectionTitle, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  postSectionTitle(sectionTitle: SectionTitle) : any{
    var url = this.postURLSectionTitle;
    return this.http.post<SectionTitle>(url, sectionTitle, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  
  deleteSectionTitle(sectionTitle : SectionTitle) : Observable<void>{
    var url = this.deleteURLSectionTitle + new Number(sectionTitle.id).toString();
    return this.http.delete<void>(url);
  }

  putAlgorithm(algo: AlgorithmExternal) : Observable<AlgorithmExternal>{
    var url = this.putURLAlgo + new Number(algo.id).toString();
    console.log(url);

    return this.http.put<AlgorithmExternal>(url, algo, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  
  postAlgorithm(algo: AlgorithmExternal) : Observable<AlgorithmExternal>{
    var url = this.postURLAlgo;
    return this.http.post<AlgorithmExternal>(url, algo, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteAlgorithm(algo: AlgorithmExternal) : Observable<void>{
    var url = this.deleteURLAlgo + new Number(algo.id).toString();
    return this.http.delete<void>(url);
  }

  getCommentsAllByAlgoId (algoId : number) : Observable<AlgorithmComment[]>{
      let url = this.getURLCommentsByAlgoId(algoId);
      return this.http.get<AlgorithmComment[]>(url);
  }

  postComment(algorithmId : number, comment : AlgorithmComment) : Observable<AlgorithmComment>{
    let url = this.postURLCommentByAlgoId(algorithmId);
    return this.http.post<AlgorithmComment>(url, comment, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteComment(algorithmId : number, commentId : number) : Observable<void>{
    let url : string = this.deleteURLCommentByAlgorithmId(algorithmId, commentId);
    return this.http.delete<void>(url);
  }
}