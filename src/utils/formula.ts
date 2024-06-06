type GetCellValue = (ref: string) => string | number | null;

interface ASTNode {
  type: string;
}

interface LiteralNode extends ASTNode {
  type: 'Literal';
  value: string | number | null;
}

interface FunctionCallNode extends ASTNode {
  type: 'FunctionCall';
  func: string;
  args: ASTNode[];
}

const isNumber = (value: string): boolean => !isNaN(Number(value));
const isString = (value: string): boolean => value.startsWith('"') && value.endsWith('"');
const isReference = (value: string): boolean => /^\$[A-Z]+[0-9]+$/i.test(value);

const evaluate = (expr: string, getCellValue: GetCellValue): string | number | null => {
  if (isReference(expr)) {
    const value = getCellValue(expr);
    if (value === null) throw new Error(`Reference ${expr} not found`);
    return value;
  }
  if (isNumber(expr)) return Number(expr);
  if (isString(expr)) return expr.slice(1, -1).replace(/\\"/g, '"');
  if (expr.startsWith('=')) {
    expr = expr.slice(1);
    return evaluateExpression(expr, getCellValue);
  }
  throw new Error('Invalid expression');
};

const evaluateExpression = (expr: string, getCellValue: GetCellValue): string | number | null => {
  const tokens = tokenize(expr);
  const ast = parseTokens(tokens);
  return evaluateAST(ast, getCellValue);
};

const tokenize = (expr: string): string[] => {
  const regex = /([A-Z]+\(|\)|,|\$[A-Z]+[0-9]+|[0-9.]+|"[^"]*")/gi;
  return expr.match(regex) || [];
};

const parseTokens = (tokens: string[]): ASTNode => {
  let i = 0;

  const parseExpression = (): ASTNode => {
    if (isReference(tokens[i] ?? '') || isNumber(tokens[i] ?? '') || isString(tokens[i] ?? '')) {
      return { type: 'Literal', value: tokens[i++] ?? '' } as LiteralNode;
    }
    if (/^[A-Z]+\($/i.test(tokens[i] ?? '')) {
      const func = (tokens[i++] ?? '').slice(0, -1);
      const args = [];
      while (tokens[i] !== ')' && i < tokens.length) {
        args.push(parseExpression());
        if (tokens[i] === ',') i++;
      }
      if (tokens[i] !== ')') throw new Error('Mismatched parentheses');
      i++;
      return { type: 'FunctionCall', func, args } as FunctionCallNode;
    }
    throw new Error('Unexpected token');
  };

  return parseExpression();
};

const evaluateAST = (node: ASTNode, getCellValue: GetCellValue): string | number | null => {
  switch (node.type) {
    case 'Literal':
      return evaluate((node as LiteralNode).value as string, getCellValue);
    case 'FunctionCall':
      const funcNode = node as FunctionCallNode;
      const args = funcNode.args.map(arg => evaluateAST(arg, getCellValue));
      return evaluateFunctionCall(funcNode.func, args);
    default:
      throw new Error('Unknown AST node type');
  }
};

const evaluateFunctionCall = (func: string, args: (string | number | null)[]): string | number | null => {
  switch (func.toUpperCase()) {
    case 'SUM':
      if (args.some(arg => typeof arg !== 'number')) throw new Error('SUM arguments must be numbers');
      return (args as number[]).reduce((acc, arg) => acc + (arg as number), 0);
    default:
      throw new Error(`Unknown function ${func}`);
  }
};

const evaluateFormula = (formula: string, getCellValue: GetCellValue): string | number | null => {
  return evaluate(formula, getCellValue);
};

export { evaluateFormula };
