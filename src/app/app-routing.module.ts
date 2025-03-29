import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'animation-projects',
        loadChildren: () =>
            import('./animation-projects/animation-projects.module').then(
                (m) => m.AnimationProjectsModule,
            ),
    },
    {
        path: '',
        redirectTo: 'animation-projects',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
