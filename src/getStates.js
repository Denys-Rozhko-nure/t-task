import nextState from "./nextState";

// Функція повертає усі таблиці задачі
export default function getStates(initialState) {
  // Ініціалізуємо масив станів 
  const res = [initialState];

  // Додаємо таблиці у масив станів допоки вони є
  for(let c = nextState(initialState); c !== null; c = nextState(c))
    res.push(c);
  // Повертаємо масив станів
  return res;
}