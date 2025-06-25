module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",  // Usa babel-jest para transformar os arquivos JS e JSX
  },
  transformIgnorePatterns: [
    "/node_modules/(?!antd|rc-pagination|react-router-dom)/",  // Transforma 'antd', 'rc-pagination' e 'react-router-dom'
  ],
  testEnvironment: "jsdom",  // Ambiente de testes para emular o navegador
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',  // Para evitar erros com CSS
  },
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",  // Para usar matchers do jest-dom como 'toBeInTheDocument'
  ],
  moduleDirectories: [
    "node_modules",
    "src",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.test.{js,jsx,ts,tsx}",
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};
