# Under the hood of the Logic Rogue GUI.

## Parsing

The engine's parsing function
was pulled from a GitHub repo called formula-parser. This takes a string and turns it into an AST
(abstract syntax tree) that is stored as a JS object. The only connectives available are the material conditional (written as P-Q for 'if P then Q') and the negation(written as ~P for 'not P'). Setting up the
parser required defining the unary connective (negation), the binary connective (material conditional), and
the symbol to be used for individual sentence letters like P and Q. In the case that the sentence consists of a
single sentence letter, the parsing provided by formula-parser was augmented. The augmentation allows
this case to be handled as a special case.

## Inference Rules

Due to the fact that the only connectives available in Logic Rogue are the negation and material conditional,
the only inference rules implemented are those that operate on these connectives. Modus Ponens (MP),
Modus Tollens (MT), Double Elimination Introduction and Elimination (DNI and DNE) are the rules available
in the final encounter. Repetition is always available.

## Natural Deduction in the style of D. Kalish and R. Montague

The system of natural deduction used to prove sentences in the encounter is the system created by Kalish and
Montague in their textbook _Logic: Techniques of Formal Reasoning_. There are three types of derivation
in the book: Direct Derivation (DD), Conditional Derivation (CD), and the perennial logician favorite,
Indirect Derivation (ID). The derivation ends when one of the following is achieved: a Conclusion, a Consequent,
or a Contradiction. These close out DD, CD, and ID, respectively. The engine recognizes each of these
conditions and checks after every operation performed if the derivation has been completed.

## Assumptions

As soon as the derivation begins, the player may choose to make an assumptionto gain a "free"
sentence in their inventory. If the desired sentence is a conditional, the player may choose to make a
_assumption for CD_, which is the antecedent of the desired sentence. The player may choose to make a
_assumption for ID_ on any type of goal sentence. The only constraint of this is that the assumption
must be made as the first step in the derivation.
