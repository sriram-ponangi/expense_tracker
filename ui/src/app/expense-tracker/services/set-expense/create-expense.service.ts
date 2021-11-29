import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../../models/APIResponse';
import { ExpensesInfo } from '../../models/ExpensesInfo';

@Injectable({
  providedIn: 'root'
})
export class CreateExpenseService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  setExpenseInfo(body: any): Observable<APIResponse> {

    let isSuccessful = false;

    const headers = new HttpHeaders()
      .set('Authorization', this.authService.getAuthToken());

    const options = { headers: headers };

    return this.http.post<APIResponse>(environment.api, body, options);

  }
}
