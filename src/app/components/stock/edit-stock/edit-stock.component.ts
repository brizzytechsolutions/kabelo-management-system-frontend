import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../../services/stock.service';
import { CommonModule } from '@angular/common';
import { StockItem } from '../../../interface/stock.interface';

@Component({
  selector: 'app-edit-stock',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-stock.component.html',
  styleUrls: ['./edit-stock.component.scss'],
})
export class EditStockComponent implements OnInit {
  stockForm: FormGroup;
  stockId: string;
  existingImages: string[] = [];
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stockForm = this.fb.group({
      regNo: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      modelYear: ['', [Validators.required, Validators.min(1886)]],
      kms: ['', [Validators.required, Validators.min(0)]],
      color: ['', Validators.required],
      vin: ['', Validators.required],
      retailPrice: ['', [Validators.required, Validators.min(0)]],
      costPrice: ['', [Validators.required, Validators.min(0)]],
      images: [''],
    });

    this.stockId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadStock();
  }

  loadStock(): void {
    this.stockService.getStockById(this.stockId).subscribe({
      next: (stock: StockItem) => {
        this.stockForm.patchValue({
          regNo: stock.regNo,
          make: stock.make,
          model: stock.model,
          modelYear: stock.modelYear,
          kms: stock.kms,
          color: stock.color,
          vin: stock.vin,
          retailPrice: stock.retailPrice,
          costPrice: stock.costPrice,
        });
        this.existingImages = stock.images.map(image => `http://localhost:3000${image}`) || [];
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
      complete: () => {
        console.info('Stock loading completed');
      }
    });
    
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    this.stockForm.patchValue({ images: files });
  }

  onSubmit(): void {
    if (this.stockForm.valid) {
      const formData = new FormData();
      Object.keys(this.stockForm.value).forEach((key) => {
        if (key === 'images') {
          const files = this.stockForm.get(key)?.value;
          if (files) {
            for (let i = 0; i < files.length; i++) {
              formData.append('images', files[i]);
            }
          }
        } else {
          formData.append(key, this.stockForm.get(key)?.value);
        }
      });

      this.stockService.updateStock(this.stockId, formData).subscribe({
        next: () => {
          this.router.navigate(['/stock-list']);
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
        complete: () => {
          console.info('Stock update completed');
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  deleteImage(image: string): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.existingImages = this.existingImages.filter((img) => img !== image);
    }
  }

  goBack(): void {
    this.router.navigate(['/stock-list']);
  }
}
