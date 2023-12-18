import { ComponentType } from '@angular/cdk/overlay';
import { Component, Provider, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Testing class that embeds a dummy component with the feature to be tested on it.
 */
export class TestableFeature<T, F> {
  public fixture!: ComponentFixture<T>;
  public component!: T;
  public feature!: F;
  public element!: HTMLElement;

  constructor(
    private compClass: ComponentType<T>,
    private featureClass: ComponentType<F>,
    private cssSelector: string
  ) {}

  /** Prepares the test bed and instantiates useful variables */
  prepareTestBed(wrapInBeforeEach = true) {
    if (wrapInBeforeEach) beforeEach(() => this.executePreparation());
    else this.executePreparation();
  }

  /** Tests if the feature gets created correctly */
  isCreated() {
    it('Gets created on use', () => expect(this.feature).toBeDefined());
  }

  /** Tests if the feature has a given class */
  hasClass(baseClass: string) {
    it('Has the base class', () => expect(this.element).toHaveClass(baseClass));
  }

  /** Returns an HTML element according to the provided selector */
  getHtmlElement(selector: string): HTMLElement {
    return this.fixture.debugElement.query(By.css(selector)).nativeElement;
  }

  /** Returns an array of HTML elements according to the provided selector */
  getHtmlElements(selector: string): HTMLElement[] {
    return this.fixture.debugElement
      .queryAll(By.css(selector))
      .map((v) => v.nativeElement);
  }

  /** Tests if the feature can change one of its attributes */
  canHandleAttribute(
    attr: string,
    key: keyof F = attr as keyof F,
    value: any = 'testing value'
  ) {
    it(`Is able to change its "${attr}" attribute`, () => {
      const { feature: directive, fixture, element } = this;
      directive[key] = value;
      fixture.detectChanges();
      expect(element.attributes.getNamedItem(attr)!.value).toEqual(value);
    });
  }

  private executePreparation() {
    this.fixture = TestBed.configureTestingModule({
      imports: [this.compClass],
    }).createComponent(this.compClass);

    this.component = this.fixture.componentInstance;

    this.fixture.detectChanges();

    this.element = this.fixture.debugElement.query(
      By.css(this.cssSelector)
    ).nativeElement;

    const query =
      this.fixture.debugElement.query(By.directive(this.featureClass)) ??
      this.fixture.debugElement.query(By.css(this.cssSelector));

    this.feature = query.injector.get(this.featureClass);
  }
}

export function createTestingComponent<T>(
  template: string,
  imports: Type<any>[],
  assignments: T,
  providers: Provider[] = []
) {
  @Component({ standalone: true, imports, template, providers })
  class TestClass {
    constructor() {
      Object.assign(this, assignments);
    }
  }

  return TestClass as new () => T;
}
