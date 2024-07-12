import { CoreComponent } from './core/core.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [  
  {path:'',redirectTo:'tikets',pathMatch:'full'},
  {path:'tikets' , loadComponent:() => import('./core/core.component').then((x) => x.CoreComponent)}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
