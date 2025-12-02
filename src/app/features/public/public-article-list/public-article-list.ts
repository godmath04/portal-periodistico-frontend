import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-public-article-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-article-list.html',
  styleUrl: './public-article-list.scss',
})
export class PublicArticleList implements OnInit {
  articles: Article[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPublishedArticles();
  }

  loadPublishedArticles(): void {
    this.loading = true;
    this.errorMessage = '';

    this.articleService.getAllPublishedArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading published articles:', error);
        this.errorMessage = 'Error al cargar los artículos. Por favor, intenta nuevamente.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewArticle(articleId: number): void {
    this.router.navigate(['/public/articles', articleId]);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  getAuthorName(article: Article): string {
    if (article.author.firstName && article.author.lastName) {
      return `${article.author.firstName} ${article.author.lastName}`;
    }
    return article.author.username || 'Autor desconocido';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
