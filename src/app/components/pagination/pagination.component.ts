import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DEFAULT_CURRENT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '@constants/index';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  currentPage: number = DEFAULT_CURRENT_PAGE;
  itemsPerPage: number = DEFAULT_ITEMS_PER_PAGE;

  @Input() totalItems: number = 0;

  constructor(private router: Router, private route: ActivatedRoute) {}

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.navigateToPage(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.navigateToPage(this.currentPage);
    }
  }

  goToPage(page: number) {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.navigateToPage(this.currentPage);
    }
  }

  private navigateToPage(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page,
      },
      queryParamsHandling: 'merge',
    });
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
