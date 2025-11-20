import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // *** AGREGAR RouterLink, RouterLinkActive ***
import { ArticleService } from '../../../core/services/article.service';
import { AuthService } from '../../../core/services/auth.service'; // *** AGREGAR ***
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // *** AGREGAR RouterLink, RouterLinkActive ***
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
    private authService: AuthService, // *** AGREGAR ***
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyArticles();
  }

  loadMyArticles(): void {
    this.loading = true;
    this.errorMessage = '';

    this.articleService.getMyArticles().subscribe({
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
  }

  createArticle(): void {
    this.router.navigate(['/articles/create']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
