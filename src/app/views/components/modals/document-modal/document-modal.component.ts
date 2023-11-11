import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.scss']
})
export class DocumentModalComponent implements OnInit {

  sizeImage = 0;
  defaultWidth = 0;
  porcentImage = 100

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DocumentModalComponent>
  ) {

  }

  ngOnInit(): void {
    this.getSizeImage()
  }

  handleClick(type?: boolean): void {
    this.dialogRef.close(type)
  }

  async getSizeImage() {
    setTimeout(() => {
      const element = document.getElementById('div-image');
      if (element) {
        this.defaultWidth = element.clientWidth
      }
    }, 500);

  }

  addSize() {
    if (this.sizeImage < 2) {
      const element = document.getElementById('div-image');
      if (element) {
        const width = element.clientWidth
        element.style.width = width + (this.defaultWidth / 2) + 'px';
        this.sizeImage++
        this.porcentImage += 50;
      }
    }
  }

  removeSize() {
    if (this.sizeImage > 0) {
      const element = document.getElementById('div-image');
      if (element) {
        const width = element.clientWidth
        element.style.width = width - (this.defaultWidth / 2) + 'px';
        this.sizeImage--
        this.porcentImage -= 50;
      }
    }
  }


}
