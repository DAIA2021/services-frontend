import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionario.service';

@Component({
  selector: 'app-form-funcionario',
  templateUrl: './form-funcionario.component.html',
  styleUrls: ['./form-funcionario.component.css']
})
export class FormFuncionarioComponent implements OnInit {
 //2 criar formGroup
  formFuncionario:FormGroup = this.fb.group({
    nome:['' , [ Validators.required ]],
    email: ['', [ Validators.required, Validators.email ]],
    foto: ['']
  })

  foto!: File // File representa um arquivo
  fotoPreview: string = '' // url que vai carregar a imagem
  salvandoFuncionario: boolean = false
///importar
  constructor(
    private fb: FormBuilder, //1 injetado 
    private funcService: FuncionarioService,
    private dialogRef: MatDialogRef<FormFuncionarioComponent>, //qual componente é referencia
    private snackbar : MatSnackBar  // com esse objeto criado o snack bar 
      
  ) { }

  ngOnInit(): void {
  }
  // 1 função 
  recuperarFoto(event: any ): void {
   this.foto = event.target.files[0]
   this.carregarPreview()
  }
 // 2 função 
  carregarPreview(): void {
    const reader = new FileReader() //ler arquivos FileReader

    reader.readAsDataURL(this.foto)

    reader.onload = () => {
      this.fotoPreview = reader.result as string
    }
  } 
  
  salvar(): void { 
    this.salvandoFuncionario = true
    const f: Funcionario = this.formFuncionario.value
    f.foto = ''
    let obsSalvar: Observable<any>

    if (this.formFuncionario.value.foto.length != undefined) {
      obsSalvar = this.funcService.salvarFuncionario(f, this.foto)
    } else {
      obsSalvar = this.funcService.salvarFuncionario(f)
    }

    obsSalvar.subscribe(
      (resultado) => {
        // 1° testar se o resultado é uma Promise ou não
        if (resultado instanceof Promise) {
          /**
           * Se cair no if, significa que há uma promise e que tem uma
           * foto para salvar
           */

          // 1° -> Recuperar o observable que me é retornado do primeiro subscribe

          /**
           * a função then() é executada
           * quando a promise consegue te retornar os dados com sucesso
           *
           * nesse caso, o dado que será retorna é um observable com o funcionário
           * que foi salvo no banco de dados
           * variável que guarda um Observable com $ no final
           */
          resultado.then((obs$) => {
            // inscrevendo-se no observable que nos retornará o funcionário salvo no banco de dados
            obs$.subscribe(
              () => {
                // quando o funcionário for salvo, aparecerá um snackbar na tela e o dialog será fechado
                this.snackbar.open('Funcionário salvo com sucesso', 'Ok', {
                  duration: 3000
                })
                this.dialogRef.close()// essa função fecha dialog pelo typescript
              }
            )
          })
        } else {
          /**
           * Se cair no else, significa que o funcionário já foi salvo
           * e não tinha foto para enviar
           */
          this.snackbar.open('Funcionário salvo com sucesso', 'Ok', {
            duration: 3000
          })
          this.dialogRef.close()
        }
      }
    )
  }
}


 

 