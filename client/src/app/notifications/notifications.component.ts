import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../shared/notification.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications;
  error: string = null;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    let notificationSub = this.notificationService.getNotifications(
      this.authService.user.value.getUsername
    );
    notificationSub.subscribe(
      notificationsArray => {
        this.notifications = notificationsArray;
      },
      errorMessage => {
        this.error = 'Something went wrong.';
      }
    );
  }

  navigateToProfile(notificationContent: string) {
    let username = notificationContent.split(' ');
    this.router.navigate([`/${username[1]}`]);
  }
}
