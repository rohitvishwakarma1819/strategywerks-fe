import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UsersRoutingModule } from './users.routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './services/user.service';
import { UserItemComponent } from './user-item/user-item.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [UserListComponent, UserItemComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ScrollingModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  providers: [provideHttpClient(), UserService, provideAnimations()],
})
export class UsersModule {}
