
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Folks } from './folks';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})

export class DbService {
  private storage: SQLiteObject;
  folksList = new BehaviorSubject([]);
  oldList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'ses_db.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.storage = db;
          this.getFakeData();
      });
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchFolks(): Observable<Folks[]> {
    return this.folksList.asObservable();
  }

    // Render fake data
    getFakeData() {
      this.httpClient.get(
        'assets/dump.sql',
        {responseType: 'text'}
      ).subscribe(data => {
        this.sqlPorter.importSqlToDb(this.storage, data)
          .then(_ => {
            this.getFolks();
            this.isDbReady.next(true);
          })
          .catch(error => console.error(error));
      });
    }

  // Get list
  getFolks(){
    return this.storage.executeSql('SELECT id, fname, lname, sex, dob, julianday() - julianday(dob) AS age FROM folks', []).then(res => {
      let items: Folks[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            fname: res.rows.item(i).fname,
            lname: res.rows.item(i).lname,
            sex: res.rows.item(i).sex,
            dob: res.rows.item(i).dob,
            age: Math.round(res.rows.item(i).age/365),
           });
        }
      }
      this.folksList.next(items);
    });
  }

  // Add
  addPerson(fname, lname, sex, dob) {
    let data = [fname, lname, sex, dob];
    return this.storage.executeSql('INSERT INTO folks (fname, lname, sex, dob) VALUES (?, ?, ?, ?)', data)
    .then(res => {
      this.getFolks();
    });
  }

  // Get single object
  getPerson(id): Promise<Folks> {
    return this.storage.executeSql('SELECT * FROM folks WHERE id = ?', [id]).then(res => {
      return {
        id: res.rows.item(0).id,
        fname: res.rows.item(0).fname,
        lname: res.rows.item(0).lname,
        sex: res.rows.item(0).sex,
        dob: res.rows.item(0).dob,
        age: res.rows.item(0).age,
      }
    });
  }

  // Update
  updatePerson(id, folks: Folks) {
    let data = [folks.fname, folks.lname, folks.sex, folks.dob];
    return this.storage.executeSql(`UPDATE folks SET fname = ?, lname = ?, sex = ?, dob = ? WHERE id = ${id}`, data)
    .then(data => {
      this.getFolks();
    })
  }

  // Delete
  deletePerson(id) {
    return this.storage.executeSql('DELETE FROM folks WHERE id = ?', [id])
    .then(_ => {
      this.getFolks();
    });
  }

/*  getAge(){
    return this.storage.executeSql('SELECT julianday(now) - julianday(dob) FROM folks AS age', []).then(res => {
      let items: Folks[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            age: res.rows.item(i).age
           });
        }
      }
      this.folksList.next(items);
    });
  } */


}
