import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FolksPageRoutingModule } from './folks-routing.module';
import { FolksPage } from './folks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolksPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FolksPage]
})
export class FolksPageModule {}
