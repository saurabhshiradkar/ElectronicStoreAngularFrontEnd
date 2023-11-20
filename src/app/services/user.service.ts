import { Injectable } from '@angular/core';
import { User, UsersResponse } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { first, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  //signup logic
  signupUser(user: User) {
    return this.httpClient.post<User>(`${environment.apiUrl}/users`, user);
  }

  //GET ALL USERS
  getAllUsers() {
    return this.httpClient.get<UsersResponse>(`${environment.apiUrl}/users`);
  }

  //GET SINGLE USER
  getUser(userId: string) {
    return this.httpClient.get<User>(`${environment.apiUrl}/users/${userId}`);
  }

  //UPDATE USER
  updateUser(user: User) {
    return this.httpClient.put<User>(
      `${environment.apiUrl}/users/${user.userId}`,
      user
    );
  }

  //DELETE USER
  deleteUser(userId: string) {
    return this.httpClient.delete(`${environment.apiUrl}/users/${userId}`);
  }

  //GET USER BY EMAIL
  getUserByEmail(userEmail: string) {
    return this.httpClient.get<User>(
      `${environment.apiUrl}/users/email/${userEmail}`
    );
  }

  //UPLOAD USER IMAGE
  uploadUserImage(userId: string, userImage: File) {
    let formData = new FormData();
    formData.append('image', userImage);

    return this.httpClient.post(
      `${environment.apiUrl}/users/image/${userId}`,
      formData
    );
  }

  //SEARCH USERS
  searchUsers(query: string) {
    return this.httpClient.get<User[]>(
      `${environment.apiUrl}/users/search/${query}`
    );
  }

  getUserImageUrl(user: User) {
    const imageNameDefault: string = '/assets/images/default_profile.png';

    if (user.imageName === '' || 'default.png') {
      return imageNameDefault;
    } 
    else 
    if (
      user.imageName.startsWith('http') ||
      user.imageName.startsWith('https') ||
      user.imageName.includes('data') || 
      user.imageName.includes('://')
    ) {
      return user.imageName;
    } else {
      return `${environment.apiUrl}/users/image/${user.userId}`;
      // ?${new Date().getTime()}
    }
  }
}
