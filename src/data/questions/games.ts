import type { QuestionDef } from "../../domain/types.ts";

export const games: QuestionDef[] = [
  {
    category: "Games",
    prompt: "Name a board game",
    open: true,
    answers: [
      "Monopoly", "Scrabble", "Chess", "Draughts|Checkers", "Cluedo|Clue", "Risk",
      "Trivial Pursuit", "Snakes and Ladders", "Ludo", "Backgammon", "Connect Four|Connect 4",
      "Guess Who", "Operation", "Mouse Trap", "Battleship|Battleships",
      "Game of Life|The Game of Life|Life", "Catan|Settlers of Catan", "Ticket to Ride",
      "Carcassonne", "Pandemic", "Go", "Othello|Reversi", "Mahjong", "Pictionary", "Articulate",
      "Boggle", "Kerplunk", "Hungry Hippos", "Buckaroo", "Jenga*", "Twister*", "Stratego",
      "Mastermind", "Sorry", "Frustration", "Dominoes*", "Codenames", "Azul", "Wingspan", "Dixit",
      "Splendor", "Scattergories", "Taboo", "Balderdash", "Cranium", "Monopoly Deal*",
      "Exploding Kittens*", "Uno*", "Diplomacy", "Terraforming Mars", "Gloomhaven", "Hotel",
    ],
  },
  {
    category: "Games",
    prompt: "Name a Super Mario character",
    open: true,
    answers: [
      "Mario", "Luigi", "Princess Peach|Peach", "Bowser", "Yoshi", "Toad", "Wario", "Waluigi",
      "Donkey Kong|DK", "Diddy Kong", "Princess Daisy|Daisy", "Rosalina", "Koopa Troopa|Koopa",
      "Shy Guy", "Boo", "Birdo", "Toadette", "Bowser Jr.", "Kamek", "Lakitu", "Goomba",
      "Bullet Bill", "Chain Chomp", "Piranha Plant", "Dry Bones", "King Boo", "Metal Mario",
      "Baby Mario", "Pauline", "Captain Toad", "Nabbit", "Cappy", "Blooper", "Hammer Bro",
      "Wiggler", "Petey Piranha", "Funky Kong", "Cranky Kong", "Dixie Kong", "Toadsworth",
      "Professor E. Gadd|E. Gadd", "Bob-omb", "Thwomp", "Koopalings*",
    ],
  },
  {
    category: "Games",
    prompt: "Name a video game console",
    open: true,
    answers: [
      "PlayStation|PS1", "PlayStation 2|PS2", "PlayStation 3|PS3", "PlayStation 4|PS4",
      "PlayStation 5|PS5", "PSP", "PS Vita", "Xbox", "Xbox 360", "Xbox One", "Xbox Series X",
      "Xbox Series S", "NES", "SNES|Super Nintendo", "Nintendo 64|N64", "GameCube", "Wii", "Wii U",
      "Switch|Nintendo Switch", "Switch 2", "Game Boy", "Game Boy Color", "Game Boy Advance|GBA",
      "Nintendo DS|DS", "3DS", "Mega Drive|Genesis", "Master System", "Saturn", "Dreamcast",
      "Game Gear", "Atari 2600", "Atari Jaguar", "Atari Lynx", "Neo Geo",
      "TurboGrafx-16|PC Engine", "3DO", "Virtual Boy", "Steam Deck", "Ouya", "Intellivision",
      "ColecoVision", "Vectrex", "N-Gage", "ZX Spectrum*", "Commodore 64*", "Amiga*",
      "Magnavox Odyssey",
    ],
  },
];
