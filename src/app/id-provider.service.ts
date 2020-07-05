import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdProviderService {

  private idCounter : number;
  
  public getId() : number{
    return this.idCounter++;
  }

  constructor() { 
    this.idCounter = 1;
  }
}
