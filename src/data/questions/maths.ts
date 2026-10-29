import type { QuestionDef } from "../../domain/types.ts";

export const maths: QuestionDef[] = [
  {
    category: "Maths",
    prompt: "Name a prime number under 100",
    answers: [
      "2", "3", "5", "7", "11", "13", "17", "19", "23", "29", "31", "37", "41", "43", "47", "53",
      "59", "61", "67", "71", "73", "79", "83", "89", "97",
    ],
  },
  {
    category: "Maths",
    prompt: "Name a power of 2 (up to 65,536)",
    answers: [
      "1", "2", "4", "8", "16", "32", "64", "128", "256", "512", "1024", "2048", "4096", "8192",
      "16384", "32768", "65536",
    ],
  },
  {
    category: "Maths",
    prompt: "Name a Fibonacci number under 1,000",
    answers: [
      "0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "144", "233", "377", "610",
      "987",
    ],
  },
  {
    category: "Maths",
    prompt: "Name a square number under 200",
    answers: [
      "1", "4", "9", "16", "25", "36", "49", "64", "81", "100", "121", "144", "169", "196", "0*",
    ],
  },
  {
    category: "Maths",
    prompt: "Name a 2D shape",
    open: true,
    answers: [
      "Triangle", "Square", "Rectangle", "Circle", "Oval|Ellipse", "Pentagon", "Hexagon",
      "Heptagon|Septagon", "Octagon", "Nonagon", "Decagon", "Hendecagon|Undecagon", "Dodecagon",
      "Rhombus|Diamond", "Parallelogram", "Trapezium|Trapezoid", "Kite", "Star", "Heart",
      "Crescent", "Semicircle", "Quadrilateral", "Icosagon", "Arrow", "Cross", "Annulus|Ring",
      "Sector", "Scalene Triangle", "Isosceles Triangle", "Equilateral Triangle",
      "Right-angled Triangle",
    ],
  },
  {
    category: "Maths",
    prompt: "Name a famous mathematician",
    open: true,
    answers: [
      "Pythagoras", "Euclid", "Archimedes", "Isaac Newton|Newton", "Gottfried Leibniz|Leibniz",
      "Leonhard Euler|Euler", "Carl Friedrich Gauss|Gauss", "Bernhard Riemann|Riemann",
      "Pierre de Fermat|Fermat", "Blaise Pascal|Pascal", "Rene Descartes|Descartes", "Fibonacci",
      "Alan Turing|Turing", "Ada Lovelace|Lovelace", "John von Neumann|von Neumann",
      "Srinivasa Ramanujan|Ramanujan", "Emmy Noether|Noether", "Kurt Godel|Godel",
      "David Hilbert|Hilbert", "Georg Cantor|Cantor", "Andrew Wiles|Wiles", "Terence Tao|Tao",
      "Hypatia", "Al-Khwarizmi", "Joseph Fourier|Fourier", "Pierre-Simon Laplace|Laplace",
      "Joseph-Louis Lagrange|Lagrange", "Evariste Galois|Galois", "John Nash|Nash",
      "Paul Erdos|Erdos", "Grigori Perelman|Perelman", "Benoit Mandelbrot|Mandelbrot",
      "George Boole|Boole", "Charles Babbage|Babbage", "Henri Poincare|Poincare", "Sophie Germain",
      "Maryam Mirzakhani", "Katherine Johnson", "Alonzo Church", "Claude Shannon",
      "Bertrand Russell", "Euclid of Alexandria", "Thales", "Omar Khayyam", "Brahmagupta",
      "Aryabhata", "John Napier|Napier", "Johannes Kepler*",
    ],
  },
];
