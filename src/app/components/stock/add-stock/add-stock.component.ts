import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockService } from '../../../services/stock.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StockItem } from '../../../interface/stock.interface';
import { Accessory } from '../../../interface/accessory.interface';


@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss']
})
export class AddStockComponent {
  stockForm: FormGroup;
  errorMessage: string = '';

  @Output() stockAdded = new EventEmitter<void>();
  @ViewChild('closeModal') closeModal!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
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
      images: ['', Validators.required],
      accessories: this.fb.array([]),
    });
  }

  get accessories(): FormArray {
    return this.stockForm.get('accessories') as FormArray;
  }

  addAccessory() {
    this.accessories.push(this.fb.group({
      name: ['', Validators.required],
      description: [''],
      image: ['', Validators.required]
    }));
  }

  removeAccessory(index: number) {
    this.accessories.removeAt(index);
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.stockForm.patchValue({ images: files });
      this.stockForm.get('images')?.updateValueAndValidity();
    }
  }

  onAccessoryFileChange(event: any, index: number) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.accessories.at(index).patchValue({ image: files[0] });
      this.accessories.at(index).get('image')?.updateValueAndValidity();
    }
  }

  onSubmit() {
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
            if (accessory.image) {
              formData.append(`accessories[${index}][image]`, accessory.image);
            }
          });
        } else {
          formData.append(key, this.stockForm.get(key)?.value);
        }
      });

      this.stockService.addStock(formData).subscribe({
        next: (stock: StockItem) => {
          this.errorMessage = ''; 
          this.stockForm.reset();
          this.stockAdded.emit();
          this.closeModal.nativeElement.click();
        },
        error: (error) => {
          this.errorMessage = error.message; 
        },
        complete: () => {
          console.info('Stock addition completed'); 
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}
