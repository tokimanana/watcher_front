import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  protected readonly apiUrl: string = environment.apiUrl;
  protected readonly defaultTimeout: number = 30000;

  constructor(protected http: HttpClient) {}

  /**
   * Effectue une requête GET
   * @param endpoint - Le chemin de l'endpoint relatif à l'URL de base
   * @param params - Paramètres optionnels de la requête
   * @param headers - En-têtes HTTP personnalisés
   * @param timeoutMs - Timeout personnalisé en millisecondes
   */
  public get<T>(
    endpoint: string,
    params?: Record<string, any>,
    headers?: HttpHeaders,
    timeoutMs?: number
  ): Observable<T> {
    const options = {
      params: this.buildParams(params),
      headers: headers || this.getDefaultHeaders(),
    };

    return this.http
      .get<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, options)
      .pipe(
        timeout(timeoutMs || this.defaultTimeout),
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Effectue une requête POST
   * @param endpoint - Le chemin de l'endpoint relatif à l'URL de base
   * @param body - Corps de la requête
   * @param headers - En-têtes HTTP personnalisés
   * @param timeoutMs - Timeout personnalisé en millisecondes
   */
  public post<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders,
    timeoutMs?: number
  ): Observable<T> {
    const requestHeaders = headers || this.getDefaultHeaders();

    return this.http
      .post<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, body, {
        headers: requestHeaders,
      })
      .pipe(
        timeout(timeoutMs || this.defaultTimeout),
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Effectue une requête PUT
   * @param endpoint - Le chemin de l'endpoint relatif à l'URL de base
   * @param body - Corps de la requête
   * @param headers - En-têtes HTTP personnalisés
   * @param timeoutMs - Timeout personnalisé en millisecondes
   */
  public put<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders,
    timeoutMs?: number
  ): Observable<T> {
    const requestHeaders = headers || this.getDefaultHeaders();

    return this.http
      .put<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, body, {
        headers: requestHeaders,
      })
      .pipe(
        timeout(timeoutMs || this.defaultTimeout),
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Effectue une requête PATCH
   * @param endpoint - Le chemin de l'endpoint relatif à l'URL de base
   * @param body - Corps de la requête
   * @param headers - En-têtes HTTP personnalisés
   * @param timeoutMs - Timeout personnalisé en millisecondes
   */
  public patch<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders,
    timeoutMs?: number
  ): Observable<T> {
    const requestHeaders = headers || this.getDefaultHeaders();

    return this.http
      .patch<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, body, {
        headers: requestHeaders,
      })
      .pipe(
        timeout(timeoutMs || this.defaultTimeout),
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Effectue une requête DELETE
   * @param endpoint - Le chemin de l'endpoint relatif à l'URL de base
   * @param params - Paramètres optionnels de la requête
   * @param headers - En-têtes HTTP personnalisés
   * @param timeoutMs - Timeout personnalisé en millisecondes
   */
  public delete<T>(
    endpoint: string,
    params?: Record<string, any>,
    headers?: HttpHeaders,
    timeoutMs?: number
  ): Observable<T> {
    const options = {
      params: this.buildParams(params),
      headers: headers || this.getDefaultHeaders(),
    };

    return this.http
      .delete<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, options)
      .pipe(
        timeout(timeoutMs || this.defaultTimeout),
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error))
      );
  }

  private extractData<T>(response: ApiResponse<T> | T): T {
    if (this.isApiResponse(response)) {
      return response.data;
    }
    return response as T;
  }

  private isApiResponse<T>(response: any): response is ApiResponse<T> {
    return (
      response &&
      typeof response === 'object' &&
      'data' in response &&
      'success' in response &&
      'message' in response
    );
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inattendue est survenue';
    let errorCode: string | number = 'UNKNOWN_ERROR';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur de connexion: ${error.error.message}`;
      errorCode = 'CLIENT_ERROR';
    } else {
      errorCode = error.status;
      // Essayer d'extraire le message d'erreur du format API
      if (error.error && this.isApiResponse(error.error)) {
        errorMessage = error.error.message;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        switch (error.status) {
          case 0:
            errorMessage =
              'Impossible de joindre le serveur. Vérifiez votre connexion internet.';
            break;
          case 400:
            errorMessage = 'Requête invalide. Vérifiez les données envoyées.';
            break;
          case 401:
            errorMessage = 'Accès non autorisé. Veuillez vous reconnecter.';
            break;
          case 403:
            errorMessage =
              "Accès interdit. Vous n'avez pas les permissions nécessaires.";
            break;
          case 404:
            errorMessage = 'Ressource non trouvée.';
            break;
          case 408:
            errorMessage = "Délai d'attente dépassé. Veuillez réessayer.";
            break;
          case 429:
            errorMessage =
              'Trop de requêtes. Veuillez patienter avant de réessayer.';
            break;
          case 500:
            errorMessage =
              'Erreur interne du serveur. Veuillez réessayer plus tard.';
            break;
          case 502:
          case 503:
          case 504:
            errorMessage =
              'Service temporairement indisponible. Veuillez réessayer plus tard.';
            break;
          default:
            errorMessage = `Erreur ${error.status}: ${error.message}`;
        }
      }
    }

    if (!environment.production) {
      console.error('Erreur API détaillée:', {
        url: error.url,
        status: error.status,
        statusText: error.statusText,
        error: error.error,
        message: errorMessage,
      });
    }

    const enrichedError = new Error(errorMessage);
    (enrichedError as any).code = errorCode;
    (enrichedError as any).originalError = error;

    return throwError(() => enrichedError);
  }

  private buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    if (params && typeof params === 'object') {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              httpParams = httpParams.append(key, item.toString());
            });
          } else {
            httpParams = httpParams.set(key, value.toString());
          }
        }
      });
    }

    return httpParams;
  }

  protected getDefaultHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  protected getFullUrl(endpoint: string): string {
    return `${this.apiUrl}/${endpoint}`;
  }

  /**
   * Crée un chemin d'URL avec des paramètres
   * Exemple: createUrlWithParams('users', '123', 'courses') => 'users/123/courses'
   */
  protected createUrlWithParams(...parts: (string | number)[]): string {
    return parts
      .filter((part) => part !== null && part !== undefined && part !== '')
      .map((part) => part.toString())
      .join('/');
  }

  protected isEmpty(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return true;
    return Object.keys(obj).length === 0;
  }

  protected encodeParams(params: Record<string, any>): string {
    return Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join('&');
  }
}
