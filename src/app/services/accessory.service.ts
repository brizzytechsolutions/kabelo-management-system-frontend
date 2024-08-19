import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Accessory } from '../interface/accessory.interface';
@Injectable({
  providedIn: 'root',
})
export class AccessoryService {
  private apiUrl = 'http://localhost:3000/api/accessory';

  constructor(private http: HttpClient) {}

  getAccessories(page: number = 1, pageSize: number = 10): Observable<{ items: Accessory[], total: number }> {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<{ items: Accessory[], total: number }>(`${this.apiUrl}`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getAccessoryById(id: string): Observable<Accessory> {
    return this.http.get<Accessory>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addAccessory(accessory: FormData): Observable<Accessory> {
    return this.http.post<Accessory>(`${this.apiUrl}`, accessory).pipe(
      catchError(this.handleError)
    );
  }

  updateAccessory(id: string, accessory: FormData): Observable<Accessory> {
    return this.http.put<Accessory>(`${this.apiUrl}/${id}`, accessory).pipe(
      catchError(this.handleError)
    );
  }

  deleteAccessory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
