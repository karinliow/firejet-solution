import * as babel from '@babel/parser';
import * as traverse from '@babel/traverse';
import { Node } from '@babel/types';
import * as fs from 'fs';
import prettier from "prettier";

// Use for TASK 3
async function lint(code: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const formattedCode = prettier.format(code);
      resolve(formattedCode);
    }, Math.random() * 1000); // random delay between 0 and 1 seconds
  });
}

// TASK 1: Use babel to parse JSX/TS into AST

// read from assignment.ts
const codes = fs.readFileSync('assignment.ts', 'utf8');

// convert code into AST
const ast = babel.parse(codes, {
  sourceType: 'module',
  plugins: [
    'jsx', 
    'typescript', 
  ],
});

console.log(ast);


// TASK 2: Use Traverse to find 'tsx' literals
const tsxComments: Node['loc'][] = [];

traverse.default(ast, {
  enter(path) {
    const node = path.node;
    if (node.type === 'TemplateLiteral') {
      const leadingComments = node.leadingComments;
      if (leadingComments) {
        leadingComments.forEach(comment => {
          if (comment && comment.type === 'CommentBlock' && comment.value.includes('tsx')) {
            tsxComments.push(comment.loc);
            // TASK 3: Lint Codes
            lint(node.quasis[0].value.raw).then(formattedCode => {
              console.log('Formatted code:', formattedCode);
            });
          }
        });
      }
    }
  },
});

console.log('Template literals with /*tsx*/:', tsxComments);

/* TASK 4: Identify any edge cases in your proposed solution.
   
   Answer:
   Edge Case 1 - "tsx" lines that are nested within a "tsx" may not be identified

*/

/* TASK 5: Specify the time complexity and space complexity for your proposed solution
   
   Answer:
   Time Complexity is O(n) as if the size of input grows, the time taken to traverse grows too

*/
