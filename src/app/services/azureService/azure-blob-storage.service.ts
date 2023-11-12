import { Injectable } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

@Injectable({
  providedIn: 'root'
})
export class AzureBlobStorageService {

  //https://www.youtube.com/watch?v=cme_mAmR1LA video de apoio

  accountName = "unicollabsa"
  containerName = "unicollab"

  constructor() { }

  public async listDocuments(filter?: string): Promise<[]> {
    let result: any = []

    let blobs = this.containerClient().listBlobsFlat();
    for await (const blob of blobs) {
      if (filter) {
        if (blob.name.includes(filter)) {
          result.push(
            {
              name: blob.name,
              date: blob.properties.createdOn
            }
          )
        }
      } else {
        result.push(
          {
            name: blob.name,
            date: blob.properties.createdOn
          }
        )
      }
    }
    return result
  }

  public downloadDocument(name: string, handler: (blob: Blob) => void) {
    const blobClient = this.containerClient().getBlobClient(name);
    blobClient.download().then(res => {
      res.blobBody?.then(blob => {
        handler(blob)
      })
    })
  }

  public uploadFile(content: Blob, name: string, handler: () => void) {
    const blockBlobClient = this.containerClient().getBlockBlobClient(name);
    blockBlobClient.uploadData(content, { blobHTTPHeaders: { blobContentType: content.type } }).then(() => handler())
  }

  private containerClient(sas?: string): ContainerClient {
    let token = "sp=racwdl&st=2023-11-12T02:15:59Z&se=2023-12-20T10:15:59Z&spr=https&sv=2022-11-02&sr=c&sig=iRYUCEh7%2B%2FSXE6THofxmcuTG8LTCVYfccAs35HYNMTA%3D"
    if (sas) {
      token = sas
    }
    return new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net?${token}`).getContainerClient(this.containerName);
  }
}
