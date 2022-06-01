module.exports = {
  testPathIgnorePatterns: ["/node_modules", "/.next/"], // akie e oque ele vai ignorar
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts"
  ],
  transform: { // akie oque ele vai converter para o jest enterder
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  testEnvironment: 'jsdom', // em qual ambiente o test esta rodando jsdom meio que representa a arvore de elemetnos do html
  moduleNameMapper: { // para arquivo de estilos tem que install a dependecia identity-obj-proxy -D
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  }, 
  // Coverage report relatorio dos testes
  collectCoverage: true,
  collectCoverageFrom: [ 
    "src/**/*.tsx", // todos os arquivos em qualquer pasta que terminao com .tsx
    "!src/**/*.spec.tsx", // excluindo apenas os que terminam com .spec.tsx
    "!src/**/*_app.tsx", // ignorar
    "!src/**/*_document.tsx", // ignorar
  ],
  coverageReporters: ["lcov", "json"]
}

// configs para o jest o <rootDir> e a raiz do projeto