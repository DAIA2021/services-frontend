import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//localhost: 4200 =
const routes: Routes = [
  {
    path:'funcionarios', //modulo funcionarios , criado função para importar o modulo
    loadChildren:()=> import('./funcionarios/funcionarios.module').then(m => m.FuncionariosModule) //
  },
  {
    path:'',
    pathMatch:'full',
    redirectTo: 'funcionarios'  ///essa rota foi criado para entrar direto na pagina /funcionarios
  },
  {
    path:'auth',
    loadChildren:() => import ('./auth/auth.module').then (m => m.AuthModule)
  
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


//2º vou carregar um modulo = função
//localhost:4200/funcionarios
// 2 path para entrar direto na pagina de funcionarios