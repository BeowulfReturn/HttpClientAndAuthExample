import { TestBed, inject } from '@angular/core/testing';

import { MyInterceptor } from './my-interceptor';

describe('MyInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyInterceptor]
    });
  });

  it('should be created', inject([MyInterceptor], (service: MyInterceptor) => {
    expect(service).toBeTruthy();
  }));
});
