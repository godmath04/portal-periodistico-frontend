import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article, CreateArticleRequest } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = 'http://localhost:8082/api/v1/articles'; // URL del article-service

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los artículos
   */
  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  /**
   * Obtiene un artículo por ID
   */
  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene los artículos del usuario autenticado
   */
  getMyArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/my-articles`);
  }

  /**
   * Crea un nuevo artículo
   */
  createArticle(article: CreateArticleRequest): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article);
  }

  /**
   * Envía un artículo a revisión
   */
  submitForReview(articleId: number): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${articleId}/submit`, {});
  }

  /**
   * Elimina un artículo
   */
  deleteArticle(articleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${articleId}`);
  }
}
