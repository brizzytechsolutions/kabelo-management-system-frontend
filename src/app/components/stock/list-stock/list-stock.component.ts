import { Component, OnInit } from '@angular/core';
import { StockService } from '../../../services/stock.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddStockComponent } from '../add-stock/add-stock.component';
import { StockItem } from '../../../interface/stock.interface';

@Component({
  selector: 'app-list-stock',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, AddStockComponent],
  templateUrl: './list-stock.component.html',
  styleUrls: ['./list-stock.component.scss']
})
export class ListStockComponent implements OnInit {
  stocks: StockItem[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  errorMessage: string = '';

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.stockService.getStocks(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        if (data && data.items) {
          this.stocks = data.items.map(item => ({
            ...item,
            images: item.images ? item.images.map(imagePath => `http://localhost:3000${imagePath}`) : []
          }));
        } else {
          this.stocks = [];
        }
  
        if (data.total && this.pageSize > 0) {
          this.totalPages = Math.ceil(data.total / this.pageSize);
        } else {
          this.totalPages = 1;
        }
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.message || 'An error occurred while searching for stocks.';
        this.stocks = [];
      },
      complete: () => {
        console.info('Stock list loading completed');
      }
    });
  }
  

  searchStocks(): void {
    if (this.searchTerm.length > 2) {
      this.currentPage = 1;
      this.loadStocks();
    }
  }  

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadStocks();
    }
  }

  deleteStock(id: string | undefined): void {
    if (!id) {
      this.errorMessage = 'Stock ID is missing or invalid.';
      return;
    }
    if (confirm('Are you sure you want to delete this stock item?')) {
      this.stockService.deleteStock(id).subscribe({
        next: () => {
          this.loadStocks();
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
        complete: () => {
          console.info('Stock deletion completed');
        }
      });
    }
  }  

  onStockAdded(): void {
    this.loadStocks();
  }
}
