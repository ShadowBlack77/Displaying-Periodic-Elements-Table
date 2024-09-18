import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import PeriodicElementModel from './models/PeriodicElement.model';
import { PeriodicElementsService } from './services/periodic-elements.service';
import { delay, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PopupComponent } from './components/popup/popup.component';
import { gsap } from 'gsap';
import { rxState } from '@rx-angular/state';
import { PeriodicAppModel } from './models/PeriodicApp.model';

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
export class AppComponent {

  private readonly periodicElementService = inject(PeriodicElementsService);

  public tableColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  public state = rxState<PeriodicAppModel>(({ set, connect }) => {
    set({
      tableContent: new MatTableDataSource<PeriodicElementModel>(),
      periodicElement: [],
      isLoading: true,
      isSearching: false,
      periodicElementFilterValue: '',
    });

    connect('periodicElement', this.periodicElementService.getAll().pipe(
      delay(500),
      tap((data) => {
        this.state.set({ tableContent: new MatTableDataSource(data) });
        this.state.set({ isLoading: false });
      })
    ));
  }); 

  @ViewChild(PopupComponent) popupComponent!: PopupComponent;

  public selectedPeriodicElement: PeriodicElementModel | null = null;

  public filterPeriodicTable(): void {
    this.state.set({ isSearching: true });

    const currentTypingWaiter = this.state.get('typingWaiter');
    if (currentTypingWaiter) {
      clearTimeout(currentTypingWaiter);
    }

    const typingWaiter = setTimeout(() => {
      const filterValue = this.state.get('periodicElementFilterValue').trim().toLowerCase();
      this.state.get('tableContent').filter = filterValue;
      this.state.set({ isSearching: false });
    }, 2000);

    this.state.set({ typingWaiter });
  }

  public openSettingsWindow(perdiodicId: number): void {
    const findPeriodicElement = this.state.get().periodicElement.find(e => e.position === perdiodicId);

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

  public onSave(updatedElement: PeriodicElementModel): void {
    if (updatedElement.position > 0) {
      const index = this.state.get().periodicElement.findIndex(e => e.position === updatedElement.position);

      if (index !== -1) {
        this.state.get().periodicElement[index] = updatedElement;
        this.state.get().tableContent.data = [...this.state.get().periodicElement];
      }
    } 
  }
}
