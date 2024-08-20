import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../../services/stock.service';
import { CommonModule } from '@angular/common';
import { StockItem } from '../../../interface/stock.interface';
import { Accessory } from '../../../interface/accessory.interface';

@Component({
  selector: 'app-detail-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-stock.component.html',
  styleUrls: ['./detail-stock.component.scss'],
})
export class DetailStockComponent implements OnInit {
  stockForm: FormGroup;
  stockId: string;
  existingImages: string[] = [];
  accessories: Accessory[] = [];
  errorMessage: string = ''; 

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stockForm = this.fb.group({
      regNo: [''],
      make: [''],
      model: [''],
      modelYear: [''],
      kms: [''],
      color: [''],
      vin: [''],
      retailPrice: [''],
      costPrice: [''],
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
  
        console.log('Images:', stock.images);
      console.log('Accessories:', stock.accessories);

      this.existingImages = stock.images ? stock.images.map(imagePath => `http://localhost:3000${imagePath}`) : [];
      
      this.accessories = stock.accessories ? stock.accessories.map(accessory => ({
        ...accessory,
        image: `http://localhost:3000${accessory.image}`
      })) : [];
        
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
      complete: () => {
        console.info('Stock details loading completed');
      }
    });
  }
  

  goBack(): void {
    this.router.navigate(['/stock-list']);
  }
}
