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
  currentPlayer: number; // Track the current player's turn
  playerScores: number[]; // Track the scores of both players
  winner: number | null; // Track the winner

  constructor(private http: HttpClient) {
    this.numberOfPlayers = 0; // Initialize the variable
    this.currentPlayer = 1; // Initialize the current player
    this.playerScores = [0, 0]; // Initialize player scores
    this.winner = null; // Initialize the winner
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
    } else {
      this.switchPlayerTurn();
    }
  }

  checkForMatch() {
    const [card1, card2] = this.flippedCards;

    if (card1.id === card2.id) {
      this.playerScores[this.currentPlayer - 1]++; // Update player score
      this.flippedCards = [];
      if (this.cards.every(card => card.flipped)) {
        this.declareWinner();
      }
    } else {
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
        this.flippedCards = [];
        this.switchPlayerTurn();
      }, 1000);
    }
  }

  switchPlayerTurn() {
    if (this.numberOfPlayers > 1) {
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }
  }

  declareWinner() {
    this.gameWon = true;
    if (this.numberOfPlayers > 1) {
      this.winner = this.playerScores[0] > this.playerScores[1] ? 1 : 2;
    }
  }
}
