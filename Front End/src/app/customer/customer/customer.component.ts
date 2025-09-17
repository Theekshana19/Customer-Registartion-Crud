import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customers: Customer[] = [];
  customerForm: FormGroup;
  editingCustomer: Customer | null = null;

  constructor(private customerService: CustomerService, private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['']
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customer: Customer = this.customerForm.value;

      if (this.editingCustomer) {
        // Update confirmation
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to update this customer?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, update it!',
          cancelButtonText: 'Cancel'
        }).then(result => {
          if (result.isConfirmed) {
            customer.id = this.editingCustomer!.id;
            this.customerService.updateCustomer(customer.id, customer).subscribe(() => {
              this.loadCustomers();
              this.resetForm();
              Swal.fire('Updated!', 'Customer has been updated.', 'success');
            });
          }
        });
      } else {
        // Save confirmation
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to add this customer?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, save it!',
          cancelButtonText: 'Cancel'
        }).then(result => {
          if (result.isConfirmed) {
            this.customerService.createCustomer(customer).subscribe(() => {
              this.loadCustomers();
              this.resetForm();
              Swal.fire('Saved!', 'Customer has been added.', 'success');
            });
          }
        });
      }
    }
  }

  editCustomer(customer: Customer): void {
    this.editingCustomer = customer;
    this.customerForm.patchValue(customer);
  }

  deleteCustomer(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.customerService.deleteCustomer(id).subscribe(() => {
          this.loadCustomers();
          Swal.fire('Deleted!', 'Customer has been removed.', 'success');
        });
      }
    });
  }

  resetForm(): void {
    this.customerForm.reset();
    this.editingCustomer = null;
  }
}
