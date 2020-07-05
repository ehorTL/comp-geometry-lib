import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AlgorithmsComponent } from './algorithms/algorithms.component';
import {NotfoundComponent} from './notfound/notfound.component';
import { HomeComponent } from './home/home.component';
import {ManagerComponent} from './manager/manager.component';
import { ManagerAlgoSectionsComponent } from './manager-algo-sections/manager-algo-sections.component';
import { ManagerAlgoPageContentComponent } from './manager-algo-page-content/manager-algo-page-content.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { MyPublicationsPageComponent } from './my-publications-page/my-publications-page.component';


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'algorithms', component: AlgorithmsComponent},
  {path: 'contacts', component: ContactPageComponent},
  {path: 'aboutme/publications', component: MyPublicationsPageComponent},
  {path: 'manager', component: ManagerComponent,
  children: [
    {path: 'manage_sections', component: ManagerAlgoSectionsComponent},
    {path: 'manage_algorithmpage', component: ManagerAlgoPageContentComponent},]
},
  {path: '**', component: NotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
