import { Course } from "./../model/course";
import { filter } from "rxjs/operators";
import { element } from "protractor";
import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "../services/courses.service";
import { HttpClient } from "@angular/common/http";
import { COURSES } from "../../../../server/db-data";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let courseService: any;
  const beginnerCourses = setupCourses().filter(
    (course: Course) => course.category == "BEGINNER"
  );
  const advancedCourses = setupCourses().filter(
    (course: Course) => course.category == "ADVANCED"
  );
  beforeEach(waitForAsync(() => {
    const courseServiceSpy = jasmine.createSpyObj("CourseService", [
      "findAllCourses",
    ]);
    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: courseServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        courseService = TestBed.inject(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    // console.log(beginnerCourses)
    courseService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display only advanced courses", () => {
    courseService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Cannot find advanced tab");
  });

  it("should display both tabs", () => {
    courseService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2, "Cannot find 2 tabs");
  });

  it("should display advanced courses when tab clicked, fakeAsync", fakeAsync(() => {
    courseService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    // console.log(tabs)
    click(tabs[1]);

    fixture.detectChanges();

    // flush();
    tick(16);

    fixture.detectChanges();

    const cardTitles = el.queryAll(By.css(".mat-card-title"));
    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
    expect(cardTitles[0].nativeElement.textContent).toContain(
      "Angular Security Course"
    );

    // setTimeout(() => {
    //   fixture.detectChanges();
    //   const cardTitles = el.queryAll(By.css(".mat-card-title"));
    //   expect(cardTitles.length).toBeGreaterThan(
    //     0,
    //     "Could not find card titles"
    //   );
    //   expect(cardTitles[0].nativeElement.textContent).toContain(
    //     "Angular Security Course"
    //   );

    //   done();
    // }, 500);
  }));
  it("should display advanced courses when tab clicked, waitForAsync", waitForAsync(() => {
    courseService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    // console.log(tabs)
    click(tabs[1]);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const cardTitles = el.queryAll(By.css(".mat-card-title"));
      expect(cardTitles.length).toBeGreaterThan(
        0,
        "Could not find card titles"
      );
      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      );
    });

    // setTimeout(() => {
    //   fixture.detectChanges();
    //   const cardTitles = el.queryAll(By.css(".mat-card-title"));
    //   expect(cardTitles.length).toBeGreaterThan(
    //     0,
    //     "Could not find card titles"
    //   );
    //   expect(cardTitles[0].nativeElement.textContent).toContain(
    //     "Angular Security Course"
    //   );

    //   done();
    // }, 500);
  }));
});
