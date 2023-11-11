import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { AttributeParam } from 'src/app/services/model/http.interface';

@Injectable({
  providedIn: 'root'
})
export class TrackTokenService {
  private readonly endpointToken = 'Token/GetTokenItems'
  private readonly endpointDocument = 'endpointToken'

  constructor(private readonly httpService: HttpService) { }

  //DefaultEndpointsProtocol=https;AccountName=unicollabsa;AccountKey=ExI3wjz2mdwPfG2Cc7BC+6TuuPzwLmRLDhh88aXzc/CKr/cHpMzU+cO4cz8G9/xdWKyIFoUYTnAP+ASt17mQoQ==;EndpointSuffix=core.windows.net
  

  getTokenResult(token: string, param: AttributeParam[]) {
    return this.httpService.genericGet(this.endpointToken, token, param).pipe((res) => {
      return res
    })
  }

  getDocument(url: string) {
    return this.httpService.getDocument(url).pipe((res) => {
      return res
    })
  }
}
