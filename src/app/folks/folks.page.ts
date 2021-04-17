
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { DbService } from './../services/db.service'
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-folks',
  templateUrl: './folks.page.html',
  styleUrls: ['./folks.page.scss'],
})
export class FolksPage implements OnInit {
  editForm: FormGroup;
  id: any;

  constructor(
    private db: DbService,
    private router: Router,
    public formBuilder: FormBuilder,
    private actRoute: ActivatedRoute
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');

    this.db.getPerson(this.id).then(res => {
      this.editForm.setValue({
        fname: res['fname'],
        lname: res['lname'],
        sex: res['sex'],
        dob: res['dob']
      })
    })
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      fname: [''],
      lname: [''],
      sex: [''],
      dob: ['']
    })
  }

  saveForm(){
    this.db.updatePerson(this.id, this.editForm.value)
    .then( (res) => {
      console.log(res)
      this.router.navigate(['/home']);
    })
  }

}
