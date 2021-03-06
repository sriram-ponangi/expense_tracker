import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../../models/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class GetExpensesService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getExpenseDetailsByDateRange(startDate: string, endDate: string, responseDataFormat: string): Observable<APIResponse> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('responseData', responseDataFormat);

    // console.log("this.authService.getAuthToken(): ", this.authService.getAuthToken());

    const headers = new HttpHeaders()
      .set('Authorization', this.authService.getAuthToken());

    const options = { params: params, headers: headers };
    return this.http.get<APIResponse>(environment.api, options);
  }


  getMonthlyExpenseHistoryByDateRange(startDate: string, endDate: string): Observable<APIResponse> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);


    const headers = new HttpHeaders()
      .set('Authorization', this.authService.getAuthToken());

    const options = { params: params, headers: headers };

    return this.http.get<APIResponse>(environment.api+"/history", options);
    
  }
}
