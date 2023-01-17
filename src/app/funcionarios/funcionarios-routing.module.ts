import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerificacaoTokenGuard } from '../guards/verificacao-token.guard';
import { IdValidatorGuard } from './guards/id-validator.guard';
import { PodeSairGuard } from './guards/pode-sair.guard';
import { FuncionarioComponent } from './pages/funcionario/funcionario.component';
import { ListarFuncionariosComponent } from './pages/listar-funcionarios/listar-funcionarios.component';

const routes: Routes = [
{
  path:'',
  component:ListarFuncionariosComponent, //rota pai
  children:[
    {
      path: ':idFuncionario', //rota filha , pode ter várias rotas filhas 
      component:FuncionarioComponent, ///importar
      canDeactivate: [ // guard 
        PodeSairGuard
      ],
      canActivate: [ //id validator guard 
        IdValidatorGuard,
        VerificacaoTokenGuard
      ]
    }
  ],
  canActivate : [
    VerificacaoTokenGuard
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionariosRoutingModule { }


///primeiro 

//Rotas iram ser componentes rota = objeto path caminho vazio para
//pagina principal//full vai verificar o link completo
//importar o componente ListarFuncionariosComponent
