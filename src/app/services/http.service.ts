import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AttributeParam } from './model/http.interface';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly apiUrl = environment.apiConfig.uri

  constructor(private readonly http: HttpClient) { }

  genericGet<T>(endpoint: string, id?: string, query?: AttributeParam[]): Observable<T> {
    const url = id ? `${this.apiUrl}/${endpoint}/${id}` : `${this.apiUrl}/${endpoint}`
    let params = new HttpParams();
    if(!!query) {
      query.forEach((attr) => params = params.append(attr.param, attr.value));
    }
    return this.http.get<T>(url, { params }).pipe(map((response: T) => response))
  }

  genericGetExternal<T>(endpoint: string, id?: string, query?: AttributeParam[]): Observable<T> {
    const url = id ? `${endpoint}/${id}` : `${endpoint}`
    let params = new HttpParams();
    if(!!query) {
      query.forEach((attr) => params = params.append(attr.param, attr.value));
    }
    return this.http.get<T>(url, { params }).pipe(map((response: T) => response))
  }

  getDocument<T>(endpoint: string): Observable<Blob> {
    return this.http.get(endpoint, { responseType: 'blob' }).pipe((res) => {
      return res
    })
  }

  genericPost<T>(endpoint: string, data: any, headers?: any): Observable<T> {
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.post<T>(url, data, httpOptions)
      .pipe(map((response: T) => response));
  }

  genericPut<T>(endpoint: string, data: any, id?: string): Observable<T> {
    const url = id ? `${this.apiUrl}/${endpoint}/${id}` : `${this.apiUrl}/${endpoint}`
    return this.http.put<T>(url, data)
      .pipe(map((response: T) => response));
  }


  genericDelete<T>(endpoint: string, id?: string | null, query?: AttributeParam[]): Observable<T> {
    const url = id ? `${this.apiUrl}/${endpoint}/${id}` : `${this.apiUrl}/${endpoint}`;
    let params = new HttpParams();
    if(!!query) {
      query.forEach((attr) => params = params.append(attr.param, attr.value));
    }
    return this.http.delete<T>(url, { params })
      .pipe(map((response: T) => response));

  }
}
