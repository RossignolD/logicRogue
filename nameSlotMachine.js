const names = {
  "Given Names": [
    "Peter",
    "Ruth",
    "Haskell",
    "Rene",
    "Leonhard",
    "Solomon",
    "Gangesha",
    "David",
    "Jacques",
    "Saul",
    "Ahmed",
    "Christine",
    "Joachim",
    "Joan",
    "Giuseppe",
    "Willard",
    "Julia",
    "Helena",
    "Yuting",
    "Raghunatha",
    "Alan",
    "Robert",
    "Juan Luis",
    "Hao",
    "Jin",
    "Lotfi",
  ],
  "Family Names": [
    "Abelard",
    "Barcan Marcus",
    "Curry",
    "Descartes",
    "Euler",
    "Feferman",
    "Hilbert",
    "Herbrand",
    "Kripke",
    "Khan",
    "Ladd-Franklin",
    "Lambert",
    "Moschovakis",
    "Peano",
    "Quine",
    "Robinson",
    "Rasiowa",
    "Shen",
    "Siromani",
    "Turing",
    "Upadhyaya",
    "Vaught",
    "Vives",
    "Wang",
    "Yuelin",
    "Zadeh",
  ],
};
function nameSlotMachine() {
  const givenNames = names["Given Names"];
  const familyNames = names["Family Names"];
  const randomGivenName =
    givenNames[Math.floor(Math.random() * givenNames.length)];
  const randomFamilyName =
    familyNames[Math.floor(Math.random() * familyNames.length)];
  const fullName = `${randomGivenName} ${randomFamilyName}`;
  return fullName;
}

function main() {
  console.log(nameSlotMachine());
}

main();

export { nameSlotMachine };
