import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DEFAULT_CURRENT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '../../constants';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  currentPage: number = DEFAULT_CURRENT_PAGE;
  itemsPerPage: number = DEFAULT_ITEMS_PER_PAGE;

  @Input() totalItems: number = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: this.currentPage
        },
        queryParamsHandling: 'merge', 
      });
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: this.currentPage
        },
        queryParamsHandling: 'merge', 
      });
    }
  }
}
