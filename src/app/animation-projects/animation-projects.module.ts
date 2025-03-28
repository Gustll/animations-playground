import { NgModule } from "@angular/core";
import { FlipperBallComponent } from "./flipper-ball/flipper-ball.component";
import { AnimationProjectsRoutingModule } from "./animation-projects-routing.module";
import { CollectionComponent } from "./collection/collection.component";

@NgModule({
    declarations: [
        FlipperBallComponent,
        CollectionComponent
    ],
    imports: [
        AnimationProjectsRoutingModule,
    ],
})
export class AnimationProjectsModule {


}
