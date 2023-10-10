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
  selectedStatusFilter: string = 'all';

  items: any[] = [];

  ngOnInit() {
    // Load items from localStorage if available
    const storedItems = localStorage.getItem('items');
    if (storedItems) {
      this.items = JSON.parse(storedItems);
    }
  }

  addItem() {
    const newItem = {
      name: this.newItemName,
      task: this.newItemStatus,
      startTime: new Date(),
      endTime: new Date(),
      duration: this.newItemDuration,
      status: this.newItemStatus,
      isEditing: false,
    };

    this.items.push(newItem);

    // Reset form fields
    this.newItemName = '';
    this.newItemStatus = 'pending';
    this.newItemDuration = 0;

    // Save items to localStorage
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  editItem(index: number) {
    this.items[index].isEditing = true;
  }

  updateItem(index: number) {
    this.items[index].isEditing = false;

    // Save items to localStorage
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  cancelEdit(index: number) {
    this.items[index].isEditing = false;
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);

    // Save items to localStorage
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
