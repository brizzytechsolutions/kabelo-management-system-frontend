import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../../services/stock.service';
import { CommonModule } from '@angular/common';
import { StockItem } from '../../../interface/stock.interface';

@Component({
  selector: 'app-edit-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
      accessories: this.fb.array([]),  // Initialize accessories as a FormArray
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
        this.existingImages = stock.images ? stock.images.map(imagePath => `http://localhost:3000${imagePath}`) : [];
        this.setAccessories(stock.accessories || []);
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

  setAccessories(accessories: any[]): void {
    const accessoryFormArray = this.stockForm.get('accessories') as FormArray;
    accessoryFormArray.clear(); // Clear existing form array controls
    accessories.forEach(accessory => {
      accessoryFormArray.push(this.fb.group({
        name: [accessory.name, Validators.required],
        description: [accessory.description],
        existingImage: [accessory.image], // Assuming 'image' is the correct field name
        newImage: ['']
      }));
    });
  }

  get accessories(): FormArray {
    return this.stockForm.get('accessories') as FormArray;
  }

  addAccessory(): void {
    const newAccessoryGroup = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      existingImage: [''], // No existing image for a new accessory
      newImage: ['']
    });
  
    this.accessories.push(newAccessoryGroup);
    this.saveAccessory(this.accessories.length - 1);
  }
  
  saveAccessory(index: number): void {
    console.log(`Save accessory at index: ${index}`);
    const accessory = this.accessories.at(index);
    accessory.markAsPristine();
    this.onSubmit();
  }

  removeAccessory(index: number): void {
    this.accessories.removeAt(index);
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    this.stockForm.patchValue({ images: files });
  }

  onAccessoryFileChange(event: any, index: number): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.accessories.at(index).patchValue({ newImage: files[0] });
    }
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
            } else if (key === 'accessories') {
                const accessories = this.stockForm.get(key)?.value;
                accessories.forEach((accessory: any, index: number) => {
                    formData.append(`accessories[${index}][name]`, accessory.name);
                    formData.append(`accessories[${index}][description]`, accessory.description);
                    if (accessory.newImage) {
                        formData.append(`accessories[${index}][image]`, accessory.newImage);
                    }
                });
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
