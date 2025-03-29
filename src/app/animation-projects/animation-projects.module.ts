import { NgModule } from "@angular/core";
import { FlipperBallComponent } from "./flipper-ball/flipper-ball.component";
import { AnimationProjectsRoutingModule } from "./animation-projects-routing.module";
import { CollectionComponent } from "./collection/collection.component";
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    declarations: [
        FlipperBallComponent,
        CollectionComponent
    ],
    imports: [
        AnimationProjectsRoutingModule,
        MatInputModule,
        MatFormField,
        MatSliderModule,
        ReactiveFormsModule,
        MatFormFieldModule
    ]
})
export class AnimationProjectsModule {


}
