import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { AuthService } from '../../../core/services/auth.service';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './article-list.html',
  styleUrl: './article-list.scss',
})
export class ArticleList implements OnInit {
  articles: Article[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  statusMap: { [key: number]: { name: string; class: string } } = {
    1: { name: 'Borrador', class: 'status-draft' },
    2: { name: 'Publicado', class: 'status-published' },
    3: { name: 'En Revisión', class: 'status-review' },
    4: { name: 'Observado', class: 'status-flagged' },
  };

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyArticles();
  }

  loadMyArticles(): void {
    this.loading = true;
    this.errorMessage = '';
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'No se pudo obtener el usuario autenticado';
      this.loading = false;
      return;
    }

    this.articleService.getArticlesByAuthor(userId).subscribe({
      next: (articles) => {
        this.articles = articles;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando artículos:', error);
        this.errorMessage = 'Error al cargar los artículos';
        this.loading = false;
      },
    });
  }

  getStatusInfo(statusId: number) {
    return this.statusMap[statusId] || { name: 'Desconocido', class: '' };
  }

  viewArticle(articleId: number): void {
    console.log('Ver artículo:', articleId);
  }

  editArticle(articleId: number): void {
    console.log('Editar artículo:', articleId);
    this.router.navigate(['/articles/edit', articleId]);
  }

  deleteArticle(articleId: number): void {
    if (confirm('¿Estás seguro de eliminar este artículo? Esta acción no se puede deshacer.')) {
      this.loading = true;
      this.errorMessage = '';

      this.articleService.deleteArticle(articleId).subscribe({
        next: () => {
          console.log('Artículo eliminado exitosamente');
          this.loadMyArticles(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar artículo:', error);
          this.errorMessage = error.error || 'Error al eliminar el artículo';
          this.loading = false;
        },
      });
    }
  }

  createArticle(): void {
    this.router.navigate(['/articles/create']);
  }

  submitForReview(articleId: number): void {
    alert('Funcionalidad "Enviar a Revisión" pendiente de implementar');
    // TODO: Implementar cuando tengamos el endpoint
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
