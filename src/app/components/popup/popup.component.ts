import { Component, EventEmitter, Input, Output } from '@angular/core';
import { gsap } from 'gsap';
import PeriodicElement from '../../interfaces/PeriodicElement.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormField,
    MatInputModule, 
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  @Output() save = new EventEmitter<PeriodicElement>();

  public periodicPostionElement: number = 0;
  public periodicNameElement: string = '';
  public periodicWeightElement: number = 0;
  public periodicSymbolElement: string = '';

  public periodicNameElementError: string = '';
  public periodicWeightElementError: string = '';
  public periodicSymbolElementEror: string = '';

  loadDetails(element: PeriodicElement): void {
    this.periodicPostionElement = element.position
    this.periodicNameElement = element.name;
    this.periodicWeightElement = element.weight;
    this.periodicSymbolElement = element.symbol;
  }

  public handleCloseClickButton(): void {
    gsap.to('#popup-settings', {
      translateX: '-100vw',
      duration: 0.5,
      ease: 'power2.Out'
    });
  }

  public saveSettings(): void {

    this.periodicNameElementError = '';
    this.periodicSymbolElementEror = '';
    this.periodicWeightElementError = '';

    if (
      this.periodicPostionElement > 0 &&
      this.periodicNameElement.trim() !== '' &&
      this.periodicWeightElement > 0 &&
      this.periodicSymbolElement.trim() !== ''
    ) {
      const updatedElement: PeriodicElement = {
        position: this.periodicPostionElement,
        name: this.periodicNameElement,
        weight: this.periodicWeightElement,
        symbol: this.periodicSymbolElement
      }
  
      this.save.emit(updatedElement);
      this.handleCloseClickButton();
    } else {
      if (this.periodicNameElement.trim() === '') {
        this.periodicNameElementError = 'Name field cannot be empty!';
      }

      if (this.periodicWeightElement <= 0) {
        this.periodicWeightElementError = 'Must be higher then 0!';
      }

      if (this.periodicSymbolElement.trim() === '') {
        this.periodicSymbolElementEror = 'Symbol field cannot be empty!';
      }
    }
  }
}
