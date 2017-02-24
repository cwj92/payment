import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Payment } from '../../stores/payments/model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/withLatestFrom';
@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {

  @Input() amountLimit: number;

  bookingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      totalAmount: '',
      payments: this.fb.array([]),
    });
  }

  get total(): FormControl {
    return this.bookingForm.get('totalAmount') as FormControl;
  }

  get payments(): FormArray {
    return this.bookingForm.get('payments') as FormArray;
  }

  ngOnInit() {
    this.total.valueChanges
      .subscribe(totalAmount => {
        this.clearPayment();
        const paymentsAmount = this.splitEqual(totalAmount);
        for (let i = 0; i < paymentsAmount.length; i++) {
          this.addPayment(this.fb.group(<Payment>{amount: paymentsAmount[i]}));
        }
      });
  }

  addPayment(payment: FormGroup) {
    this.payments.push(payment);
  }

  clearPayment() {
    this.bookingForm.controls['payments'] = this.fb.array([]);
  }

  splitEqual(total: number): number[] {
    let _total = total;
    const payments2: number[] = [];
    do {
      const amount = Math.min(_total, this.amountLimit);
      payments2.push(amount);
      _total -= amount;
    } while (_total > 0);

    return payments2;
  }
}
