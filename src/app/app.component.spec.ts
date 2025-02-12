import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppComponent],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'memory-game' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('memory-game');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, memory-game');
  });

  it('should fetch Star Wars characters from the API', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const mockCharacters = [
      { id: 1, name: 'Luke Skywalker', image: 'luke.jpg' },
      { id: 2, name: 'Darth Vader', image: 'vader.jpg' },
    ];

    app.fetchStarWarsCharacters();
    const req = httpMock.expectOne('https://akabab.github.io/starwars-api/api/all.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacters);

    expect(app.cards.length).toBe(4); // 2 characters duplicated
  });

  it('should flip a card', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const card = { id: 1, name: 'Luke Skywalker', image: 'luke.jpg', flipped: false };
    app.cards = [card];

    app.flipCard(card);
    expect(card.flipped).toBeTrue();
    expect(app.flippedCards.length).toBe(1);
  });

  it('should check for matching cards', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const card1 = { id: 1, name: 'Luke Skywalker', image: 'luke.jpg', flipped: false };
    const card2 = { id: 1, name: 'Luke Skywalker', image: 'luke.jpg', flipped: false };
    const card3 = { id: 2, name: 'Darth Vader', image: 'vader.jpg', flipped: false };

    app.cards = [card1, card2, card3];

    app.flipCard(card1);
    app.flipCard(card2);

    expect(app.flippedCards.length).toBe(0);
    expect(card1.flipped).toBeTrue();
    expect(card2.flipped).toBeTrue();
  });

  it('should display a winning message when all pairs are matched', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const card1 = { id: 1, name: 'Luke Skywalker', image: 'luke.jpg', flipped: true };
    const card2 = { id: 1, name: 'Luke Skywalker', image: 'luke.jpg', flipped: true };
    const card3 = { id: 2, name: 'Darth Vader', image: 'vader.jpg', flipped: true };
    const card4 = { id: 2, name: 'Darth Vader', image: 'vader.jpg', flipped: true };

    app.cards = [card1, card2, card3, card4];
    app.checkForMatch();

    expect(app.gameWon).toBeTrue();
  });
});
