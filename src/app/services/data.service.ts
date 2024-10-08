import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { CSVData } from '../models/csv-data.model';
import * as Papa from 'papaparse';  // Import PapaParse for CSV parsing

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://interview.bigyellowfish.io/api/Content/GetCSVData';

  constructor(private http: HttpClient) { }

  // Method to fetch CSV data from API, parse it, and return as Observable
  getCSVData(): Observable<CSVData[]> {
    const token = this.getToken();

    if (!token) {
      return throwError('Invalid token. Please log in again.');
    }

    return this.http.get(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'text' // Ensure we get the response as text
    }).pipe(
      retry(3),
      map((csvData: string) => this.parseCSVData(csvData)), // Parse the CSV text
      catchError(this.handleError)
    );
  }

  // Parse the CSV data using PapaParse
  private parseCSVData(csvData: string): CSVData[] {
    const parsed = Papa.parse<CSVData>(csvData, {
      header: true,         // Use the first row as headers
      skipEmptyLines: true  // Skip empty lines
    });
    return parsed.data; // Return the parsed data as an array of CSVData
  }

  // Get the token from localStorage
  private getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Error handling for HTTP requests
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
