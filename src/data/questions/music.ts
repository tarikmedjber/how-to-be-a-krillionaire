import type { QuestionDef } from "../../domain/types.ts";

export const music: QuestionDef[] = [
  {
    category: "Music",
    prompt: "Name a Taylor Swift studio album",
    answers: [
      "Taylor Swift|Debut", "Fearless", "Speak Now", "Red", "1989", "Reputation", "Lover",
      "Folklore", "Evermore", "Midnights", "The Tortured Poets Department|TTPD",
      "The Life of a Showgirl|Showgirl",
    ],
  },
  {
    category: "Music",
    prompt: "Name a Beatles song",
    open: true,
    answers: [
      "Hey Jude", "Let It Be", "Yesterday", "Help!|Help", "Something", "Come Together",
      "Here Comes the Sun", "Yellow Submarine", "All You Need Is Love", "Penny Lane",
      "Strawberry Fields Forever", "A Hard Day's Night", "Can't Buy Me Love", "Love Me Do",
      "She Loves You", "I Want to Hold Your Hand", "Eleanor Rigby",
      "Lucy in the Sky with Diamonds", "Get Back", "Twist and Shout", "Blackbird", "Day Tripper",
      "Paperback Writer", "Ticket to Ride", "In My Life", "Norwegian Wood", "Michelle",
      "Drive My Car", "Revolution", "While My Guitar Gently Weeps", "Ob-La-Di Ob-La-Da",
      "The Long and Winding Road", "Across the Universe", "Back in the U.S.S.R.|Back in the USSR",
      "Helter Skelter", "I Am the Walrus", "A Day in the Life",
      "With a Little Help from My Friends", "Sgt. Pepper's Lonely Hearts Club Band|Sgt Pepper",
      "Octopus's Garden", "Here There and Everywhere", "Good Day Sunshine", "Taxman",
      "Nowhere Man", "Please Please Me", "From Me to You", "I Feel Fine", "Eight Days a Week",
      "We Can Work It Out", "Hello Goodbye", "Lady Madonna", "The Ballad of John and Yoko",
      "Dear Prudence", "Golden Slumbers", "Got to Get You into My Life", "Rain",
      "Tomorrow Never Knows", "I Saw Her Standing There", "And I Love Her", "All My Loving",
      "Magical Mystery Tour", "Maxwell's Silver Hammer", "Because", "Girl", "Julia",
      "Now and Then",
    ],
  },
  {
    category: "Music",
    prompt: "Name a member of the Spice Girls",
    answers: [
      "Mel B|Scary Spice|Melanie Brown", "Mel C|Sporty Spice|Melanie Chisholm",
      "Emma Bunton|Baby Spice", "Geri Halliwell|Ginger Spice|Geri",
      "Victoria Beckham|Posh Spice|Victoria Adams",
    ],
  },
  {
    category: "Music",
    prompt: "Name a member of One Direction",
    answers: [
      "Harry Styles|Harry", "Niall Horan|Niall", "Liam Payne|Liam", "Louis Tomlinson|Louis",
      "Zayn Malik|Zayn",
    ],
  },
  {
    category: "Music",
    prompt: "Name a member of the Beatles",
    answers: [
      "John Lennon|Lennon|John", "Paul McCartney|McCartney|Paul",
      "George Harrison|Harrison|George", "Ringo Starr|Ringo", "Pete Best*", "Stuart Sutcliffe*",
    ],
  },
  {
    category: "Music",
    prompt: "Name a musical instrument",
    open: true,
    answers: [
      "Piano", "Guitar", "Electric Guitar", "Bass Guitar|Bass", "Drums", "Violin", "Viola",
      "Cello", "Double Bass", "Harp", "Flute", "Piccolo", "Clarinet", "Oboe", "Bassoon",
      "Saxophone|Sax", "Trumpet", "Trombone", "French Horn|Horn", "Tuba", "Cornet", "Euphonium",
      "Harmonica", "Accordion", "Bagpipes", "Banjo", "Mandolin", "Ukulele", "Sitar", "Organ",
      "Harpsichord", "Keyboard|Synthesizer", "Xylophone", "Glockenspiel", "Marimba", "Triangle",
      "Tambourine", "Cymbals", "Timpani", "Recorder", "Didgeridoo", "Bongos", "Congas",
      "Castanets", "Maracas", "Kazoo", "Steel Drum|Steel Pan", "Lute", "Zither", "Theremin",
      "Tabla", "Djembe", "Cowbell", "Ocarina", "Pan Pipes", "Melodica", "Lyre", "Balalaika",
      "Koto", "Shamisen", "Erhu",
    ],
  },
];
