import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { User, UserCount } from '../models';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}
  private _baseUrl = `${environment.apiUrl}`;
  getUsers(limit = 50, offset = 0): Observable<User[]> {
    return this.http.get(
      `${this._baseUrl}/users?limit=${limit}&offset=${offset}`
    ) as Observable<User[]>;
  }

  getUsersCount(): Observable<UserCount> {
    return this.http.get(
      `${this._baseUrl}/users/count`
    ) as Observable<UserCount>;
  }
}
