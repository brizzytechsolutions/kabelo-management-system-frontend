import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccessoryService } from '../../../services/accessory.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-accessorry',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-accessorry.component.html',
  styleUrl: './add-accessorry.component.scss'
})
export class AddAccessorryComponent {
  accessoryForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private accessoryService: AccessoryService, private router: Router) {
    this.accessoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      image: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.accessoryForm.valid) {
      const formData = new FormData();
      Object.keys(this.accessoryForm.value).forEach((key) => {
        if (key === 'image') {
          const file = this.accessoryForm.get(key)?.value;
          if (file) {
            formData.append('image', file);
          }
        } else {
          formData.append(key, this.accessoryForm.get(key)?.value);
        }
      });
  
      this.accessoryService.addAccessory(formData).subscribe({
        next: () => {
          this.router.navigate(['/accessory-list']);
          this.errorMessage = ''; // Clear any previous errors
        },
        error: (error) => {
          this.errorMessage = error.message; // Capture errors
        },
        complete: () => {
          console.info('Accessory addition completed'); // Optional: handle completion
        },
      });
    }
  }
  

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.accessoryForm.patchValue({ image: file });
  }
}
