import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StockItem } from '../interface/stock.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = 'http://localhost:3000/api/stock';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getStocks(searchTerm: string = '', page: number = 1, pageSize: number = 10): Observable<{ items: StockItem[], total: number }> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('search', searchTerm)
      .set('page', `${page}`)
      .set('pageSize', `${pageSize}`);
  
    return this.http.get<{ items: StockItem[], total: number }>(`${this.apiUrl}`, { headers, params })
      .pipe(
        catchError(this.handleError)
      );
  }
  

  getStockById(id: string): Observable<StockItem> {
    const headers = this.getAuthHeaders();
    return this.http.get<StockItem>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  addStock(stock: FormData): Observable<StockItem> {
    const headers = this.getAuthHeaders();
    return this.http.post<StockItem>(`${this.apiUrl}`, stock, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateStock(id: string, stock: FormData): Observable<StockItem> {
    const headers = this.getAuthHeaders();
    return this.http.put<StockItem>(`${this.apiUrl}/${id}`, stock, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteStock(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers })
      .pipe(
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
