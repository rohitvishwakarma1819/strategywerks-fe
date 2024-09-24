import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models';
import { UserService } from '../services/user.service';
import { forkJoin, of, Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport = {} as CdkVirtualScrollViewport;

  users: User[] = [];
  totalUserCount = 0;
  limit = 50;
  offset = 0;
  allFetched = false;
  subsriptions: Subscription[] = [];
  isLoading = false;

  constructor(
    private readonly userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._loadUsers(true);
  }

  private _loadUsers(fetchUserCount = false) {
    this.isLoading = true;
    this.subsriptions.push(
      forkJoin({
        users: this.userService.getUsers(this.limit, this.offset),
        userCount: fetchUserCount
          ? this.userService.getUsersCount()
          : of(undefined),
      }).subscribe({
        next: ({ users, userCount }) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          if (users?.length) {
            this.users = [...this.users, ...users];
            this.offset += this.limit;
          } else {
            this.allFetched = true;
          }

          if (userCount) {
            this.totalUserCount = userCount.count;
          }
        },
        error: (err) => {
          this.isLoading = false;
        },
      })
    );
  }

  onScroll() {
    if (this.viewport) {
      const viewportElementRef = this.viewport.elementRef.nativeElement;
      const scrollHeight = viewportElementRef.scrollHeight;
      const scrollTop = viewportElementRef.scrollTop;
      const viewportHeight = viewportElementRef.clientHeight;
      // when user scroll is 200px away from bottom fetch more data to make the behaviour smooth
      if (
        scrollHeight - scrollTop - viewportHeight <= 100 &&
        !this.isLoading &&
        !this.allFetched
      ) {
        this._loadUsers();
      }
    }
  }

  /**
   * A custom trackBy function used to improve the performance of *ngFor when iterating over a list of users.
   *
   * @method trackById
   * @param {number} index - The index of the current item in the list.
   * @param {User} user - The current user object being iterated over.
   * @returns {number} The unique identifier (id) of the user.
   *
   * @description
   * The `trackById` method is used with Angular's `*ngFor` directive to optimize rendering performance.
   * By default, Angular re-renders the entire list when there are changes, but with `trackBy`,
   * Angular can keep track of items by their unique identifier (user.id), preventing unnecessary re-renders.
   *
   * This method helps Angular identify each item uniquely, thus only updating the DOM when the item's `id` changes.
   *
   * Example usage:
   * ```html
   * <div *ngFor="let user of users; trackBy: trackById">
   *   {{ user.name }}
   * </div>
   * ```
   */
  trackById(index: number, user: User) {
    return user.id;
  }

  /**
   * The ngOnDestroy lifecycle hook is triggered just before the component is destroyed.
   * This method is used to clean up any active subscriptions in the component.
   *
   * @method ngOnDestroy
   * @description This method loops through all the subscriptions stored in the `subscriptions` array
   * and calls the `unsubscribe()` method on each one to avoid memory leaks.
   *
   * Best practice in Angular is to unsubscribe from Observables when a component is destroyed to prevent
   * memory leaks and unintended side effects.
   *
   * Example usage:
   * Assume `this.subscriptions` is an array that stores multiple subscriptions made during the lifecycle
   * of the component (e.g., HTTP requests, event listeners, or observable streams). When the component
   * is destroyed, this method ensures that all those subscriptions are properly cleaned up.
   *
   * ngOnDestroy is automatically called by Angular when the component is destroyed.
   */
  ngOnDestroy() {
    this.subsriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
