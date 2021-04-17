import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { DbService } from './../services/db.service';
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mainForm: FormGroup;
  Data: any[] = [];
  filterTerm: string;
  avg: number;
  min: number;
  max: number;


  constructor(
    private db: DbService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router

  ) {
      //this.searchControl = new FormControl();
    }

  ngOnInit() {
    this.db.dbState().subscribe((res) => {
      if(res){
        this.db.fetchFolks().subscribe(item => {
          this.Data = item
        })
      }
    });

    this.mainForm = this.formBuilder.group({
      fname: [''],
      lname: [''],
      sex: [''],
      dob: ['']
      })

    }

    storeData() {
      this.db.addPerson(
        this.mainForm.value.fname,
        this.mainForm.value.lname,
        this.mainForm.value.sex,
        this.mainForm.value.dob,
      ).then((res) => {
        this.mainForm.reset();
      })
    }

    deletePerson(id){
        this.db.deletePerson(id).then(async(res) => {
          let toast = await this.toast.create({
            message: 'Person deleted',
            duration: 2500
          });
          toast.present();
        })
      }

  calcStats(age){
        var max = 0;
        var min = 0;
        var sum = 0;
        var avg = 0;

          for (var i = 1; i < age.length; i++) {
              if (age[i] > max) {
                  max = age[i];
              }
              if (age[i] < min) {
                  min = age[i];
              }
              sum = sum + age[i];
              avg = sum / age.length;
          }
          return avg;
          return max;
          return min;

      }

}
