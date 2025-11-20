export interface ArticleApproval {
  articleApprovalId: number;
  articleId: number;
  approverUserId: number;
  roleId: number;
  status: 'APPROVED' | 'REJECTED';
  comments?: string;
  timestamp: string;
}

export interface ApprovalRequest {
  status: 'APPROVED' | 'REJECTED';
  comments?: string;
}