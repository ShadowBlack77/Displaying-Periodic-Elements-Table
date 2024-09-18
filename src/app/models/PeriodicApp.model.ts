import { MatTableDataSource } from "@angular/material/table";
import PeriodicElementModel from "./PeriodicElement.model";

export interface PeriodicAppModel {
  readonly periodicElement: PeriodicElementModel[];
  readonly tableContent: MatTableDataSource<PeriodicElementModel>;
  readonly isLoading: boolean;
  readonly isSearching: boolean;
  readonly periodicElementFilterValue: string;
  readonly typingWaiter?: ReturnType<typeof setTimeout>;
}