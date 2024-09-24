import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import { UserService } from '../services/user.service';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { User } from '../models';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { UserItemComponent } from '../user-item/user-item.component';
import { MatDivider } from '@angular/material/divider';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  let viewportMock: CdkVirtualScrollViewport;

  const users = [
    {
      id: '5df38f6e695566a48211da8f',
      firstName: 'Blankenship',
      lastName: 'Vincent',
      email: 'blankenshipvincent@rocklogic.com',
      children: {
        firstName: 'Robinson',
        lastName: 'Alston',
        email: 'robinsonalston@rocklogic.com',
      },
    },
    {
      id: '5df38f6e8a4caadc4aa0dc36',
      firstName: 'Frederick',
      lastName: 'Stuart',
      email: 'frederickstuart@rocklogic.com',
      children: {
        firstName: 'Reed',
        lastName: 'Velez',
        email: 'reedvelez@rocklogic.com',
      },
    },
  ] as User[];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUsers',
      'getUsersCount',
    ]);
    await TestBed.configureTestingModule({
      declarations: [UserListComponent, UserItemComponent],
      imports: [
        MatCardModule,
        MatProgressSpinnerModule,
        ScrollingModule,
        MatDivider,
      ],
      providers: [
        {
          provide: UserService,
          useValue: userServiceSpy,
        },
        {
          provide: CdkVirtualScrollViewport,
          useValue: {
            elementRef: {
              nativeElement: {
                scrollTop: 0,
                clientHeight: 200,
                scrollHeight: 800,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    viewportMock = TestBed.inject(CdkVirtualScrollViewport);
    component.viewport = viewportMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading text when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const loadingDiv = fixture.debugElement.query(By.css('.loading'));
    expect(loadingDiv).toBeTruthy();
  });

  it('should not display loading text when isLoading is false', () => {
    component.isLoading = false;
    fixture.detectChanges();

    const loadingDiv = fixture.debugElement.query(By.css('.loading'));
    expect(loadingDiv).not.toBeTruthy();
  });

  it('should display user item when users array has some data', () => {
    component.users = users;
    fixture.detectChanges();

    const userItem = fixture.debugElement.query(By.css('.user-item'));
    expect(userItem).toBeTruthy();
  });

  it('should call loadUsers when scrolled to bottom', () => {
    const spy = spyOn<any>(component, '_loadUsers');
    viewportMock.elementRef.nativeElement.scrollTop = 1000;

    component.onScroll();

    expect(spy).toHaveBeenCalled();
  });

  it('should not call loadUsers when loading is already in progress', () => {
    component.isLoading = true;
    const spy = spyOn<any>(component, '_loadUsers');
    viewportMock.elementRef.nativeElement.scrollTop = 1000;

    component.onScroll();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should fetch user count only if fetchUserCount argument is passed true', () => {
    component['_loadUsers'](true);

    expect(userServiceSpy.getUsersCount).toHaveBeenCalled();
  });
});
