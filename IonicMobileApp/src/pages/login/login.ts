/**
 * Copyright 2017 IBM Corp.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthHandlerProvider } from '../../providers/auth-handler/auth-handler';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  form;
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, public authHandler:AuthHandlerProvider, public loadingCtrl: LoadingController) {
    console.log('--> LoginPage constructor() called');

    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    this.authHandler.setCallbacks(
      () =>  {
        this.loader.dismiss();
        let view = this.navCtrl.getActive();
        if (!(view.instance instanceof HomePage )) {
          this.navCtrl.setRoot(HomePage);
        }
      }, (error) => {
        this.loader.dismiss();
        if (error !== null) {
          this.showAlert('Login Failure', error);
        } else {
          this.showAlert('Login Failure', 'Failed to login.');
        }
      }, () => {
        // this.navCtrl.setRoot(Login);
      });
  }

  processForm() {
    // Reference: https://github.com/driftyco/ionic-preview-app/blob/master/src/pages/inputs/basic/pages.ts
    let username = this.form.value.username;
    let password = this.form.value.password;
    if (username === "" || password === "") {
      this.showAlert('Login Failure', 'Username and password are required');
      return;
    }
    console.log('--> Sign-in with user: ' + username);
    this.loader = this.loadingCtrl.create({
      content: 'Signining in. Please wait ...',
    });
    this.loader.present().then(() => {
      this.authHandler.login(username, password);
    });
  }

  showAlert(alertTitle, alertMessage) {
    let prompt = this.alertCtrl.create({
      title: alertTitle,
      message: alertMessage,
      buttons: [{
          text: 'Ok',
      }]
    });
    prompt.present();
  }

  ionViewDidLoad() {
    console.log('--> LoginPage ionViewDidLoad() called');
  }

}
