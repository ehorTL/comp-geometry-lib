import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {SectionExternal} from './section-external'


@Injectable({
  providedIn: 'root'
})
export class SectionsLoaderService {
  sections: SectionExternal[];
  
  constructor() { }
}
