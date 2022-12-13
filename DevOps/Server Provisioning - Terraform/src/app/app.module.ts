import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateComponent } from './components/template/template.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { SelectTemplateComponent } from './components/select-template/select-template.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
const appRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Notifications' }
  },
  {
    path: 'template',
    component: TemplateComponent,
    data: { title: 'Notifications' }
  },
  {   
    path: 'select-template',
    component: SelectTemplateComponent,
    data: { title: 'Notifications' }
  }
] 

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    SelectTemplateComponent,
    DashboardComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
