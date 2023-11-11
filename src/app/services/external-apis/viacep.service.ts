import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class ViacepService {
  private readonly urlViaCep = 'https://viacep.com.br/ws'
  constructor(private readonly httpService: HttpService) { }

  getAddress(cep: string) {
    const endpoint = `${cep}/json/`
    return this.httpService.genericGetExternal(this.urlViaCep, endpoint).pipe((res) => {
      return res
    })
  }
}
