import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, distinctUntilChanged, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class DataService {

  constructor(
    private http: HttpClient
  ) {}

  request = (url: string) => {

    let response = this.http.get(url, {observe: "response"});

    return response;

  };

  getData = (url: string, extractMethod?: any) => {

    let response = this.http.get(url, {observe: "body"});

    if (extractMethod) {
      response = response.pipe(
        map(extractMethod)
      );
    }

    return response
      .pipe(
        distinctUntilChanged(),
        catchError((error) => of(error || "Server Error"))
      );

  };

  postData = (url: string, data: any) => {
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post(url, data, {
      headers: headers
    })
      .pipe(
        catchError((error) => of(error || "Server Error"))
      )
    ;

  };

  deleteData = (url: string) => {
    return this.http.delete(url)
      .pipe(
        catchError((error) => of(error || "Server Error"))
      )
    ;
  };


}
