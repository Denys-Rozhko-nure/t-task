

export default function setPseudoC(state) {
  // Створюємо змінні для більш зручного використання
  // масивів u, v та cells для поточного стану
  const {u, v, cells} = state;

  // Ітеруємося по усій матриці клітинок
  for(let i = 0; i < u.length; ++i) {
    for(let j = 0; j < v.length; ++j) {
      // Якщо клітинка небазисна
      if(cells[i][j].val === null) {
        // То вираховуємо для неї фіктивний тариф
        cells[i][j].c_ = cells[i][j].c - u[i] - v[j];
      }
    }
  }
}