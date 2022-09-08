import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
describe("Async test example", () => {
  it("async test with done", (done: DoneFn) => {
    let test: boolean = false;

    setTimeout(() => {
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 500);
  });
  it("setTimeout test", fakeAsync(() => {
    let test: boolean = false;

    setTimeout(() => {});

    setTimeout(() => {
      test = true;
      // expect(test).toBeTruthy();
    }, 1000);

    flush();
    expect(test).toBeTruthy();
  }));

  it("async test example Promise", fakeAsync(() => {
    let test: boolean = false;

    Promise.resolve()
      .then(() => {
        console.log("First Promise ");
      })
      .then(() => {
        console.log("Second Promise ");
        test = true;
      });

    flushMicrotasks();
    console.log("Before evaluate expect(()) ");
    expect(test).toBeTruthy();
  }));

  it("Async test example Promise + setTimeout()", fakeAsync(() => {
    let counter = 0;
    Promise.resolve().then(() => {
      counter += 10;
      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);
    flushMicrotasks();
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(10);
    tick(500);
    flush();
    expect(counter).toBe(11);
  }));
  it("Async test example Observable", fakeAsync(() => {
    let test = false;
    console.log("1 Before observe");
    const test$ = of(test).pipe(delay(1000));
    console.log("2 before subscribe");
    test$.subscribe(() => {
      console.log("3 Inside of subscribe");
      test = true;
    });
    console.log("4 After subscribe");
    tick(1000);
    // flush();
    expect(test).toBeTruthy();
  }));
});
