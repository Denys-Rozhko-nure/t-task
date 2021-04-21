
// Експортуємо основну функцію з файлу
// Ця функція приймає шаблон початкового стану і одразу декомпозує його у масиви a, b, cells
export default function initializeCells({a, b, cells}) {

  // На початку ми знаходимо елементи, що були створені
  // для вводу даних масивів а та b і беремо з них значення
  for(let i = 0; i < 3; ++i) {
    a[i] = document.getElementById(`a${i}`).valueAsNumber;
    b[i] = document.getElementById(`b${i}`).valueAsNumber;
  }

  // Знаходимо сумму масивів а та b
  const sumA = a.reduce((sum, val) => sum + val);
  const sumB = b.reduce((sum, val) => sum + val);

  // Ящко задача несбалансована, то додаємо фіктивного постачальника, чи споживача
  if(sumA > sumB) 
    b.push(sumA - sumB);
  else if(sumB > sumA)
    a.push(sumB - sumA);

  // Робимо обхід по матриці вагів перевезень
  for(let i = 0; i < a.length; ++i) {
    // Додаємо у матрицю клітинок рядок довжиною, як у масива b
    cells.push(new Array(b.length));
    for(let j = 0; j < b.length; ++j) {
      // Знаходимо елемент для считування ваги Cij
      const el = document.getElementById(`c${i}${j}`);
      cells[i][j] = {
        // Кожна клітинка у матриці cells - об'єкт з наступними полями
        // с - вага клітинки
        // с_ - псевдотариф клітинки, існує лише для небазисних клітинок
        // val - значення клітинки, що відповідає кількості, товару, що ми перевозимо за цим шляхом
        // є лише у базисних клітинок 
        
        // Якщо, такого елементу немає - то це вага для 
        // фіктивного споживача або постачальника, тому 
        // робимо її дуже великою
        c:  el ? el.valueAsNumber : 1e5,
        c_:null,
        val:null
      }
    }
  }
}