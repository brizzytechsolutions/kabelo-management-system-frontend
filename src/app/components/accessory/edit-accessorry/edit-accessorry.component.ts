import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Accessory } from '../../../interface/accessory.interface';
import { AccessoryService } from '../../../services/accessory.service';

@Component({
  selector: 'app-edit-accessorry',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-accessorry.component.html',
  styleUrls: ['./edit-accessorry.component.scss'],
})
export class EditAccessorryComponent implements OnInit {
  accessoryForm: FormGroup;
  accessoryId: string;
  errorMessage: string = ''; // Error message property

  constructor(
    private fb: FormBuilder,
    private accessoryService: AccessoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.accessoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      image: [''],
    });

    this.accessoryId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadAccessory();
  }

  loadAccessory(): void {
    this.accessoryService.getAccessoryById(this.accessoryId).subscribe({
      next: (accessory: Accessory) => {
        this.accessoryForm.patchValue({
          name: accessory.name,
          description: accessory.description,
        });
        this.errorMessage = ''; // Clear any previous errors
      },
      error: (error) => {
        this.errorMessage = error.message; // Capture errors
      },
      complete: () => {
        console.info('Accessory loading completed'); // Optional: handle completion
      },
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.accessoryForm.patchValue({ image: file });
  }

  onSubmit(): void {
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

      this.accessoryService.updateAccessory(this.accessoryId, formData).subscribe({
        next: () => {
          this.router.navigate(['/accessory-list']);
          this.errorMessage = ''; // Clear any previous errors
        },
        error: (error) => {
          this.errorMessage = error.message; // Capture errors
        },
        complete: () => {
          console.info('Accessory update completed'); // Optional: handle completion
        },
      });
    }
  }
}
