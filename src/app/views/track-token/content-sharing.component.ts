import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DocumentModalComponent } from '../components/modals/document-modal/document-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericModalComponent } from '../components/modals/generic-modal/generic-modal.component';
import { AzureBlobStorageService } from 'src/app/services/azureService/azure-blob-storage.service';

@Component({
  selector: 'app-content-sharing',
  templateUrl: './content-sharing.component.html',
  styleUrls: ['./content-sharing.component.scss']
})
export class ContentSharingComponent implements OnInit {

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

  columns = ['Nome do arquivo', 'Data de envio', 'Visualizar arquivo']

  formFilter: FormControl
  loading = false
  showLines = {
    top: false,
    bottom: false
  }
  data: any = []

  PAGE_TOKEN: any;



  documentsList: any = []

  constructor(
    public dialog: MatDialog,
    private readonly toastr: ToastrService,
    private _clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private blobService: AzureBlobStorageService
  ) {
    this.formFilter = new FormControl('', [Validators.required])
  }

  ngOnInit(): void {
    this.reloadDocuments()
  }


  reloadDocuments(filter?: string) { 
    this.blobService.listDocuments(filter).then(list => {
      this.documentsList = list
    })
  }

  downloadDocuments(name: string) {
    this.blobService.downloadDocument(name, blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url)
    })
  }

  uploadFile(file: any) {
    const item = file?.files[0]
    this.blobService.uploadFile(item, item.name, () => {
      this.reloadDocuments()
    })
  }

  openModalDocument(file: string) {
    const dialog = this.dialog.open(DocumentModalComponent, {
      panelClass: 'custom-modal',
      width: '100%',
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

  toastrError() {
    this.toastr.error('Erro', 'Erro demais', {
      timeOut: 3000,
      closeButton: true,
      tapToDismiss: false,
      progressBar: true,
    })
  }
}
