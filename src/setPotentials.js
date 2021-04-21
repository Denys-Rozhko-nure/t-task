
// Функція, що встрановлює потенціали для методу потенціалів
export default function setPotentials(state) {
  // Беремо масиви а, b та cells для більш зручного використання
  const {a, b, cells} = state;
  // Створюємо пусті массиви потенціалів u та v відповідних розмірів
  const u = new Array(a.length);
  const v = new Array(b.length);
  // Ініціалізуємо початко значення
  u[0] = 0;
  // Виконуємо цикл допоки хоча б один потенціал не знайдений
  while(u.includes(undefined) || v.includes(undefined)) {
    // Ітеруємося по усій матриці клітинок
    for(let i = 0; i < a.length; ++i) {
      for(let j = 0; j < b.length; ++j) {
        // Якщо клітинка є базисною
        if(cells[i][j].val !== null) {
          // Якщо для цієї клітинки ми знаємо один потенціал
          // і не знаємо іншого, то встановлюємо останній
          if(u[i] !== undefined && v[j] === undefined) {
            v[j] = cells[i][j].c - u[i];
          } else if(u[i] === undefined && v[j] !== undefined) {
            u[i] = cells[i][j].c - v[j];
          }
        }
      }
    }
  }
  state.u = u;
  state.v = v;
}