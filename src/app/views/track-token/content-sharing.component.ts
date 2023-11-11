import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DocumentModalComponent } from '../components/modals/document-modal/document-modal.component';
import { TrackTokenService } from './services/track-token.service';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericModalComponent } from '../components/modals/generic-modal/generic-modal.component';
import { AttributeParam } from 'src/app/services/model/http.interface';

@Component({
  selector: 'app-content-sharing',
  templateUrl: './content-sharing.component.html',
  styleUrls: ['./content-sharing.component.scss']
})
export class ContentSharingComponent implements OnInit {

// 




  @HostListener('window:scroll', ['$event'])
  onScrollEvent(event: any) {
    if (event.target.scrollTop > 0) {
      this.showLines.top = true
    } else {
      this.showLines.top = false
    }

    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.showLines.bottom = false
    } else {
      this.showLines.bottom = true
    }
  }

  columns = ["", "Nome", "Descrição", "Data de Criação (dd/MM/yyyy)", "Data de Modificação (dd/MM/yyyy)", "Documento"]

  token: FormControl
  loading = false
  showLines = {
    top: false,
    bottom: false
  }
  data: any = []

  PAGE_TOKEN: any;

  attributeParam: AttributeParam = {
    param: 'language',
    value: ''
  }

  constructor(private readonly trackTokenService: TrackTokenService,
    public dialog: MatDialog,
    private readonly toastr: ToastrService,
    private _clipboard: Clipboard,
    private _snackBar: MatSnackBar
  ) {
    this.token = new FormControl('', [Validators.required])
  }

  ngOnInit(): void {}



  openModalDocument(file: string) {
    const dialog = this.dialog.open(DocumentModalComponent, {
      panelClass: 'custom-modal',
      width: this.iconTable(file) === 'pdf' ? '100%' : 'auto',
      data: {
        file,
        type: this.iconTable(file)
      }
    })

    dialog.afterClosed().subscribe((res) => {
    })
  }

  openInfoModal(type: string, title: string, message: string) {
    const dialog = this.dialog.open(GenericModalComponent, {
      width: '400px',
      data: {
        type: type,
        title: title,
        message: message
      }
    })

    dialog.afterClosed().subscribe((res) => {
    })
  }

  iconTable(link: string) {
    return link.includes('.pdf') ? 'pdf' : 'image'
  }

  getTokenResult() {
    if (this.token.valid) {
      this.loading = true
      const param = []
      param.push(this.attributeParam)
      this.trackTokenService.getTokenResult(this.token.value, param).subscribe({
        next: (res: any) => {
          this.loading = false
          this.data = res
        }, error: (error) => {
          this.data = []
          this.toastrError()
          this.loading = false
        }
      })
    }
  }

  copyHash(hash: string) {
    this._clipboard.copy(hash)
    this._snackBar.open('Copiado', 'Sucesso', {
      duration: 2000,
    })
  }

  toastrError() {
    this.toastr.error('Erro', 'Erro demais', {
      timeOut: 3000,
      closeButton: true,
      tapToDismiss: false,
      progressBar: true,
    })
  }
}
