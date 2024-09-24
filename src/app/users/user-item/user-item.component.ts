import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
})
export class UserItemComponent implements OnInit {
  @Input() user?: User;
  ngOnInit(): void {}
}
