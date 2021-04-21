
// Функція приймає початковий стан задачі
// і повертає опорний план знайдений методом північно-західного кута 
// У ньому заповлені лише масиви a, b та c
export default function setInitialPlan(state) {
  // Фактично, просто скорочуємо назву змінної задля зручності
  const cells = state.cells;

  // Створюємо копії масивів a та b, щоб їх модифікація
  // не вплинула на оригінали 
  const a = JSON.parse(JSON.stringify(state.a));
  const b = JSON.parse(JSON.stringify(state.b));
 
  // Об'являємо об'єкт, у котрому будемо зберігати поточне місце у матриці
  const currPos = {
    i: 0, // нормер рядка починаючи з 0
    j:0,  // нормер стовпця починаючи з 0
   };

  // Цикл, до поки ми не дійшли до нижньої правої клітинки
  while(currPos.i < cells.length && currPos.j < cells[0].length) {
   // Створюємо змінні для поточних значеннь а та b 
   const currA = a[currPos.i];
   const currB = b[currPos.j];
   // Якщо, попит даного спожвача більший за можливості даного постачальник
   if(currA < currB) {
     // То по дорозі ij ми перевозимо ту кількість товару, що
     // відповідає можливостям постачальника
     cells[currPos.i][currPos.j].val = currA;
     // Відповідно зменшуємо попит користувача на ту саму кількість
     b[currPos.j] = currB - currA;
     // Переходимо до наступного постачальника
     currPos.i++;

     // Аналогічно, якщо навпаки можливість постачальника
     // перевищує попит споживача 
   } else if(currA > currB){
     cells[currPos.i][currPos.j].val = currB;
     a[currPos.i] = currA - currB;
     currPos.j++;

     // Якщо величини попиту і постачанні рівні, то переходимо далі так
     // щоб не вийти за границі матриці
   } else {
    cells[currPos.i][currPos.j].val = currB;
    a[currPos.i] = 0;
    b[currPos.j] = 0;
    if(currPos.i+1 === cells.length)
      currPos.j++;
    else
      currPos.i++;
   }
  }
 }