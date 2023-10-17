import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  newItemName: string = '';
  newItemStatus: string = 'pending';
  newItemDuration: number = 0;
  newItemLocation: string = '';
  items: any[] = [];
  selectedStatusFilter: string = 'all';

  ngOnInit() {
    const storedItems = localStorage.getItem('items');
    if (storedItems) {
      this.items = JSON.parse(storedItems);
    }
  }

  addItem() {
    const newItem = {
      name: this.newItemName,
      status: this.newItemStatus,
      startTime: new Date(),
      endTime: new Date(),
      duration: this.newItemDuration,
      location: this.newItemLocation,
      isEditing: false,
    };

    this.items.push(newItem);

    this.newItemName = '';
    this.newItemStatus = 'pending';
    this.newItemDuration = 0;
    this.newItemLocation = '';

    localStorage.setItem('items', JSON.stringify(this.items));
  }

  viewLocationOnMap(location: string) {
    // You can use the Google Maps API for this purpose
    window.open(`https://maps.google.com/maps?q=${location}&output=embed`);
  }

  exportToCSV() {
    const csvData = this.convertItemsToCSV(this.items);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'items.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  convertItemsToCSV(items: any[]): string {
    const header = [
      'Name',
      'Status',
      'Start Time',
      'End Time',
      'Duration',
      'Location',
    ];
    const rows = items.map((item) => [
      item.name,
      item.status,
      item.startTime,
      item.endTime,
      item.duration,
      item.location,
    ]);
    return [header, ...rows].map((e) => e.join(',')).join('\n');
  }

  editItem(index: number) {
    this.items[index].isEditing = true;
  }

  updateItem(index: number) {
    this.items[index].isEditing = false;
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  cancelEdit(index: number) {
    this.items[index].isEditing = false;
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  get filteredItems() {
    if (this.selectedStatusFilter === 'all') {
      return this.items;
    } else {
      return this.items.filter(
        (item) => item.status === this.selectedStatusFilter
      );
    }
  }
}
