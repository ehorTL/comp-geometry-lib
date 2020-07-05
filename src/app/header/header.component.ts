import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  pageMain = "Головна";
  language = "Мова";
  aboutMe = "Про мене";
  langUa = "UA";
  langEn = "EN";
  pageAlgorithms = "Алгоритми";
  ourContacts = "Контакти";
  myBiography = "Біографія";
  myPublications = "Публікації";
  ourProjects = "Проекти";
  labSamsung = "Лабораторія SAMSUNG";

  name = "John";

  constructor() { }

  ngOnInit() {
  }

}
