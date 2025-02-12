/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'memory-game';
  numberOfPlayers: number; // Ensure type is specified
  cards: any[] = [];
  flippedCards: any[] = [];
  gameWon = false;

  constructor(private http: HttpClient) {
    this.numberOfPlayers = 0; // Initialize the variable
  }

  ngOnInit() {
    this.fetchStarWarsCharacters();
  }

  fetchStarWarsCharacters() {
    this.http.get('https://akabab.github.io/starwars-api/api/all.json').subscribe((data: any) => {
      const characters = data.slice(0, 8); // Get the first 8 characters
      this.cards = this.shuffleCards([...characters, ...characters]); // Duplicate and shuffle the cards
    });
  }

  shuffleCards(cards: any[]) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards.map(card => ({ ...card, flipped: false }));
  }

  flipCard(card: any) {
    if (card.flipped || this.flippedCards.length === 2) {
      return;
    }

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.checkForMatch();
    }
  }

  checkForMatch() {
    const [card1, card2] = this.flippedCards;

    if (card1.id === card2.id) {
      this.flippedCards = [];
      if (this.cards.every(card => card.flipped)) {
        this.gameWon = true;
      }
    } else {
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
        this.flippedCards = [];
      }, 1000);
    }
  }
}
