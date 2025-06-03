Under the hood of the Logic Rogue GUI is a logic engine written in JavaScript. The engine's parsing function
was pulled from a GitHub repo called formula-parser. This takes a string and turns it into an AST
(abstract syntax tree) that is stored as a JS object. The only connectives available are the material
implication (written as P-Q for 'if P then Q') and the negation(written as ~P for 'not P'). Setting up the
parser required defining the unary connective (negation), the binary connective (material implication), and
the symbol to be used for individual sentence letters like P and Q. In the case that the sentence consists of a
single sentence letter, the parsing provided by formula-parser was augmented
