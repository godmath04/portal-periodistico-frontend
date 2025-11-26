import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../core/services/article.service';
import { ApprovalService } from '../../core/services/approval.service';
import { AuthService } from '../../core/services/auth.service';
import { Article } from '../../core/models/article.model';
import { ApprovalRequest } from '../../core/models/approval.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  pendingArticles: Article[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Para el modal de aprobación/rechazo
  showModal: boolean = false;
  selectedArticle: Article | null = null;
  approvalAction: 'APPROVED' | 'REJECTED' = 'APPROVED';
  comments: string = '';

  constructor(
    private articleService: ArticleService,
    private approvalService: ApprovalService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPendingArticles();
  }

  loadPendingArticles(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.articleService.getPendingArticles().subscribe({
      next: (articles) => {
        console.log('Artículos pendientes:', articles);
        this.pendingArticles = articles;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando artículos pendientes:', error);
        this.errorMessage = 'Error al cargar los artículos pendientes';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openApprovalModal(article: Article, action: 'APPROVED' | 'REJECTED'): void {
    this.selectedArticle = article;
    this.approvalAction = action;
    this.comments = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedArticle = null;
    this.comments = '';
  }

  submitApproval(): void {
    if (!this.selectedArticle) return;

    const request: ApprovalRequest = {
      articleId: this.selectedArticle.idArticle,
      status: this.approvalAction,
      comments: this.comments || undefined,
    };

    this.loading = true;
    this.errorMessage = '';

    this.approvalService.processApproval(this.selectedArticle.idArticle, request).subscribe({
      next: (response) => {
        console.log('Aprobación procesada:', response);
        this.successMessage = response.message || 'Aprobación procesada exitosamente';
        this.closeModal();
        this.loadPendingArticles(); // Recargar la lista
      },
      error: (error) => {
        console.error('Error procesando aprobación:', error);
        this.errorMessage = error.error || 'Error al procesar la aprobación';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  viewArticle(articleId: number): void {
    this.router.navigate(['/articles/detail', articleId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
