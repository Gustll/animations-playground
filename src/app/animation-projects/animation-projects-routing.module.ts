import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlipperBallComponent } from './flipper-ball/flipper-ball.component';
import { CollectionComponent } from './collection/collection.component';

const routes: Routes = [
    {
        path: 'collection',
        component: CollectionComponent,
    },
    {
        path: 'flipper-ball',
        component: FlipperBallComponent,
    },
    {
        path: '',
        redirectTo: 'collection',
        pathMatch: 'prefix',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AnimationProjectsRoutingModule {}
