import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolksPage } from './folks.page';

const routes: Routes = [
  {
    path: '',
    component: FolksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolksPageRoutingModule {}
