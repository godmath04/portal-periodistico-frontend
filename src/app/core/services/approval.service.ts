import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';
import { ApprovalRequest, ArticleApproval } from '../models/approval.model';

@Injectable({
  providedIn: 'root',
})
export class ApprovalService {
  private apiUrl = 'http://localhost:8082/approvals'; // URL del article-service

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los artículos pendientes de aprobación para el usuario actual
   */
  getPendingApprovals(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/pending`);
  }

  /**
   * Aprueba o rechaza un artículo
   */
  processApproval(articleId: number, request: ApprovalRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${articleId}`, request);
  }

  /**
   * Obtiene el historial de aprobaciones de un artículo
   */
  getApprovalHistory(articleId: number): Observable<ArticleApproval[]> {
    return this.http.get<ArticleApproval[]>(`${this.apiUrl}/${articleId}/history`);
  }
}
