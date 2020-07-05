import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AlgorithmsComponent } from './algorithms/algorithms.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { CommentComponent } from './comment/comment.component';
import { ManagerComponent } from './manager/manager.component';
import { ManagerAlgoSectionsComponent } from './manager-algo-sections/manager-algo-sections.component';
import { ManagerAlgoPageContentComponent } from './manager-algo-page-content/manager-algo-page-content.component';
import { ElementCreatedDirective } from './element-created.directive';
import { TinymceEditorComponent } from './tinymce-editor/tinymce-editor.component';
import { IdProviderService } from './id-provider.service';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { MyPublicationsPageComponent } from './my-publications-page/my-publications-page.component';
import { MyBiographyPageComponent } from './my-biography-page/my-biography-page.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AlgorithmsComponent,
    NotfoundComponent,
    HomeComponent,
    FooterComponent,
    CommentComponent,
    ManagerComponent,
    ManagerAlgoSectionsComponent,
    ManagerAlgoPageContentComponent,
    ElementCreatedDirective,
    TinymceEditorComponent,
    ContactPageComponent,
    MyPublicationsPageComponent,
    MyBiographyPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [IdProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
