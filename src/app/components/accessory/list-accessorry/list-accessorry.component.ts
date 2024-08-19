import { Component, OnInit } from '@angular/core';
import { Accessory } from '../../../interface/accessory.interface';
import { AccessoryService } from '../../../services/accessory.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-accessorry',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-accessorry.component.html',
  styleUrls: ['./list-accessorry.component.scss'],
})
export class ListAccessorryComponent implements OnInit {
  accessories: Accessory[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  constructor(private accessoryService: AccessoryService) {}

  ngOnInit(): void {
    this.loadAccessories();
  }

  loadAccessories(): void {
    this.accessoryService.getAccessories(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.accessories = data.items;
        this.totalPages = Math.ceil(data.total / this.pageSize);
        this.errorMessage = ''; // Clear any previous errors
      },
      error: (error) => {
        this.errorMessage = error.message; // Capture errors
      },
      complete: () => {
        console.info('Accessory list loading completed'); // Optional: handle completion
      },
    });
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAccessories();
    }
  }

  deleteAccessory(id: string | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid accessory ID';
      return;
    }

    if (confirm('Are you sure you want to delete this accessory?')) {
      this.accessoryService.deleteAccessory(id).subscribe({
        next: () => {
          this.loadAccessories(); // Refresh the list after deletion
        },
        error: (error) => {
          this.errorMessage = error.message; // Capture errors
        },
        complete: () => {
          console.info('Accessory deletion completed'); // Optional: handle completion
        },
      });
    }
  }
}
