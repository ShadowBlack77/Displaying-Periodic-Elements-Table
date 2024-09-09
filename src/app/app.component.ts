import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import PeriodicElement from './interfaces/PeriodicElement.interface';
import { PeriodicElementsService } from './services/periodic-elements.service';
import { delay } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PopupComponent } from './components/popup/popup.component';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatInputModule,
    MatTableModule,
    MatFormFieldModule, 
    FormsModule,
    MatProgressSpinnerModule,
    PopupComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public periodicTable: PeriodicElement[] = [];
  public tableColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  public tableContent!: MatTableDataSource<PeriodicElement>;
  public periodicElementFliterValue: string = '';
  public isSearching: boolean = false;
  public selectedPeriodicElement: PeriodicElement | null = null;
  private typingWaiter!: ReturnType<typeof setTimeout>;

  @ViewChild(PopupComponent) popupComponent!: PopupComponent;

  constructor(private periodicService: PeriodicElementsService) {}
  
  ngOnInit(): void {
    this.periodicService.getAllPeriodicElements()
      .pipe(
        delay(500)
      )
      .subscribe({
        next: (result) => {
          this.periodicTable = result;

          this.tableContent = new MatTableDataSource(this.periodicTable);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  public filterPeriodicTable(): void {
    if (this.typingWaiter) {
      clearTimeout(this.typingWaiter);
    }

    this.typingWaiter = setTimeout(() => {
      this.tableContent.filter = this.periodicElementFliterValue.trim().toLowerCase();
      this.isSearching = false;
    }, 2000);
  
    this.isSearching = true;
  }

  public openSettingsWindow(perdiodicId: number): void {
    const findPeriodicElement = this.periodicTable.find(e => e.position === perdiodicId);

    if (findPeriodicElement) {
      this.selectedPeriodicElement = findPeriodicElement;

      this.popupComponent.loadDetails(this.selectedPeriodicElement);
    }

    gsap.to('#popup-settings', {
      translateX: '0vw',
      duration: 0.5,
      ease: 'power2.in'
    });
  }

  public filterErrorTextFormating(errorMsg: string): string {
    return errorMsg.length <= 10 ? errorMsg : `${errorMsg.slice(0, 9)}...`;
  }

  public formatColumnText(text: string): string {
    return text.length > 9 ? `${text.slice(0, 7)}...` : text;
  }

  public formatSymbolColumnText(text: string): string {
    return text.length > 9 ? `${text.slice(0, 3)}...` : text;
  }

  public onSave(updatedElement: PeriodicElement): void {
    if (updatedElement.position > 0) {
      const index = this.periodicTable.findIndex(e => e.position === updatedElement.position);

      if (index !== -1) {
        this.periodicTable[index] = updatedElement;
        this.tableContent.data = [...this.periodicTable];
      }
    } 
  }
}
