import { Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer/customer.component';

export const routes: Routes = [
  { path: '', component: CustomerComponent }, // Default route to customer management
  { path: '**', redirectTo: '' } // Wildcard redirect
];