import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable, tap } from 'rxjs';
import { Funcionario } from '../models/funcionario';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // importação do fireStorage
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root' ///toda aplicação tem acesso aos dados desse serviço
})
export class FuncionarioService {
 ///2 criado variavel para guardar o endereço da url, readonly apenas leitura
  private readonly baseUrl: string = 'http://localhost:8080/servicos/funcionarios'
  atualizarFuncionariosSub$: BehaviorSubject<boolean> = new BehaviorSubject(true)

  constructor(
    private http: HttpClient, // 1 passo
    private storage: AngularFireStorage, // objeto responsável por salvar os arquivos no firebase
    private authService: AuthService
  ) { }  

 //1 função pegar todos funcionarios

  getFuncionarios():Observable<Funcionario[]> {
    
    return this.http.get<Funcionario[]>(this.baseUrl, {
      ///http objeto que faz a requisição
    })
  }
  //http://localhost:3000/funcionarios/1 (id do funcionario)

  deleteFuncionario(func: Funcionario): Observable<any> {
    
    //Se não tiver foto, apenas será deletado o email e nome

    if (func.foto.length > 0){

      //1º pegar a referência da imagem no firestorage
      //refFromURL() pega referência do arquivo do storage pelo link de acesso gerado pelo firebase

      return this.storage.refFromURL(func.foto).delete().pipe(
        mergeMap(()=>{

          //mergeMap tem a função de pegar dois ou mais observables e transformar todos em um só
          
          
          return this.http.delete<any>(`${this.baseUrl}/${func.idFuncionario}`, {
            
          })
        })
      )
    }

    return this.http.delete<any>(`${this.baseUrl}/${func.idFuncionario}`, {
      
    })
  }
//http://localhost:3000/funcionarios/
  getFuncionarioById(id:number): Observable<Funcionario>{
    //função utilizada no funcionario.componente

    return this.http.get<Funcionario>(`${this.baseUrl}/${id}`, {
      
    })
  }

  //RXJS Operators: funções que manipulam os dados que os observables te retornam, os dados modificados

  //O "?" na frente do parãmetro faz com que ele seja opcional na hora de executar a função

  salvarFuncionario(func: Funcionario, foto?: File){
    
    //fazendo requisição POST para salvar os dados do funcionário
    // @return funcionário que acabou de ser salvo
    //a função pipe é utilizada para colocar os operadores do RXJS que manipularão os dados que são retornados dos observables
    //o pipe map manipula cada dado que o observable te retorna, transformando em algo diferente e te retorna esse dado modificado

    if (foto == undefined){ //se a foto não existe, será retornado um observable que apenas salva os dados básicos
      return this.http.post<Funcionario>(this.baseUrl, func)
    }

   return this.http.post<Funcionario>(this.baseUrl, func).pipe(
      map(async (func) => {
        // pipe map manipula cada dado que o Observable te retorna, tranformando em algo diferente e te retorna esse dado modificado

        //1º Fazer upload da imagem e recuperar o link gerado

       const linkFotoFirebase = await this.uploadImagem(foto)
       
       //2º Atribuir o link gerado ao funcionário criado

       func.foto = linkFotoFirebase

       //3º Atualizar funcionário com a foto

       return this.atualizarFuncionario(func)
      })
    )
  }

  //fazer com que a função receba a foto ou não

  atualizarFuncionario(func: Funcionario, foto?: File): any{

    //se a foto não foi passada, atualizar apena com os dados básicos

    if (foto == undefined){
    return this.http.put<Funcionario>(`${this.baseUrl}/${func.idFuncionario}`, func).pipe(
      tap((funcionario)=>{
        this.atualizarFuncionariosSub$.next(true)
      })
    )
    }

    //se já existir uma foto ligada a esse funcionário, iremos deletá-la para pôr a nova

    if (func.foto.length > 0) {
      const inscricao = this.storage.refFromURL(func.foto).delete().subscribe(
        () => {
          inscricao.unsubscribe()
        }
      )
    }

    return this.http.put<Funcionario>(`${this.baseUrl}/${func.idFuncionario}`, func).pipe(
      mergeMap(async (funcionarioAtualizado) => {
        const linkFotoFirebase = await this.uploadImagem(foto)

        funcionarioAtualizado.foto = linkFotoFirebase

        return this.atualizarFuncionario(funcionarioAtualizado)
      }),
      tap((funcionario)=>{
        this.atualizarFuncionariosSub$.next(true)
      })
    )
  }

  // 1º pegar a imagem
  // 2º fazer o upload da imagem
  // 3º gerar o link de download e retorna-lo
  private async uploadImagem(foto: File): Promise<string> {
    //a palavra async vai retornar uma promisse informa que a função vai trabalahar com
    //código assíncrono, ou seja, códigos que demoram para serem exercutados

    const nomeDoArquivo = Date.now() //retorna a data atual em milissegundos

    // faz o upload do arquivos para o firebase
    // 1º parâmetro: nome do arquivo
    // 2 parâmetro: o arquivo que deve ser enviado

    const dados = await this.storage.upload(`${nomeDoArquivo}`, foto)
    // await está indicando que esta linha que vai demorar pra ser executada
    //a propriedade REF é a referência do arquivo no firebase
    const getDownloadURL = await dados.ref.getDownloadURL() // retorna um link para o acesso da imagem
    return getDownloadURL
  }
}