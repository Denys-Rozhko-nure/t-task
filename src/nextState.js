import setPotentials from "./setPotentials";
import setPseudoC from "./setPseudoC";

// Отримуємо попередній стан
export default function nextState(prevState) {
  
  // Створюємо копію попереднього стану
  const state = JSON.parse(JSON.stringify(prevState));
  // Беремо масиви а, b та cells для більш зручного використання 
  const {a, b, cells} = state;

  // Входимо у нескінченний цикл
  while(true) {
    // Створюємо змінні наймешного значення псевдо-тарифу
    // та його положення
    let minC_ = 0;
    let minC_Pos = {
      i: -1, // рядок починаючи з 0 
      j: -1  // стовпець починаючи з 0
    };
    // Ітеруємося по усій матриці клітинок
    for(let i = 0; i < a.length; ++i) {
      for(let j = 0; j < b.length; ++j) {
        // Позначаємо усі як такі, що не беруть участь у циклі
        // Щоб не зберіглися помітки з минулої таблиці,
        // котру ми скопіювали
        cells[i][j].isInCycle = false;
        // Оновлюємо мінімум псевдо тарифу, якщо
        // поточне значення менше за попереднє
        if(cells[i][j].c_ < minC_) {
          minC_ = cells[i][j].c_;
          minC_Pos = {i, j};
        }
      }
    }
    // Якщо усі псевдо-тарифи невід'ємні
    // то отриманий розв'язок є оптимальним
    // і наступного стану не існує.
    // Тому ми повертаємо пусте значення
    if(minC_ >= 0)
      return null;
    
    // Отримуємо цикл обходу відносно клітинки
    // з найменшим значенням псевдо-тарифу 
    const cycle = getCycle(state, minC_Pos, "v") || getCycle(state, minC_Pos, "h");
    // Якщо для цієї клітинки можливо побудуваци цикл
    if(cycle !== null) {
      // Позначаємо його у попередній таблиці
      markCycle(cycle, prevState.cells);
      // Застосовуємо перестановку по цьому циклові
      // для поточного стану
      applyCycle(cycle, state.cells);
      // Знаходимо потенціали для оновленого стану
      setPotentials(state);
      // Знаходимо псевдо-тарифи для оновленого стану
      setPseudoC(state);
      // повертаємо поточний стан
      return state;
    }
    // Якщо для цієї клітинки неможливо побудувати цикл
    // То ми ставимо їй значення 0 і шукаємо наступну за величиною
    cells[minC_Pos.i][minC_Pos.j].c_ = 0;
  }
}

// Функція, що приймає об'єкт стану, поточної позиції(для рекурсії),
// поточного напрямку руху (вертикально для "v", чи горизонтально для "h") та
// поточний вже існуючий маршрут
// повертає масив об'єктів з двох полів {i, j} - рядок та стовпець клітинки,
// через яку проходить цикл
function getCycle(state, pos, direction, path = []) {
  const {a, b, cells} = state;

  // Якщо наша поточна позиція співпадає з початком нашого циклу, то
  // виходимо з рекурсії і повертаємо поточний шлях
  if(path.length > 1 && pos.i === path[0].i && pos.j === path[0].j) 
    return path;

  // Інашке додаємо до поточного шляху поточну позицію 
  path = path.concat(pos);

  // При вертиальному напрямку ітеруємося по
  // рядкам з незмінним стовпцем
  if(direction === "v") {
    for(let i = 0; i < a.length; ++i) {
        // Якщо клітинка на даній ітерації є базисною, або клітинкою, з якої ми починали цикл
      if((cells[i][pos.j].val !== null || path[0] && path[0].j === pos.j && path[0].i === i) &&
        // І її ще не було у даному шляху(окрім найпершої) 
        elementIsNotInPath(path, {i,j:pos.j}) &&
        // І вона не є нулем, котрий треба віднімати у циклі
        !(path.length % 2 === 1 && cells[i][pos.j].val === 0)
      ) {
        // То переходимо на наступний етап рекурсії
        const nextCycle = getCycle(state, {i, j:pos.j}, "h" ,path);
        // Якщо, успішно, то повертаємо результат
        if(nextCycle)
          return nextCycle;
      }
    }
    // Аналогічно для ітерації по стовпцям
  } else {
    for(let j = 0; j < b.length; ++j) {
      if((cells[pos.i][j].val !== null || path[0] && path[0].j === j && path[0].i === pos.i) && 
        elementIsNotInPath(path, {j,i:pos.i}) &&
        !(path.length % 2 === 1 && cells[pos.i][j].val === 0)
      ) {
        const nextCycle = getCycle(state, {j,i:pos.i},"v" ,path);
        if(nextCycle)
          return nextCycle;
      }
    }
  }

  return null;
}

// Функція, що перевіряє чи не були ми у клітинці pos на шлях path
function elementIsNotInPath(path, pos) {
  // Інтеруємося по усік клітинкам шлях, окрім першої
  // і порівнюємо їх з поточною
  for(let k = 1; k < path.length; ++k) {
    if(path[k].i === pos.i && path[k].j === pos.j)
      return false;
  }
  return true;
}

// До усіх клітинок, що були залучені до циклу, додаємо відповідне поле
function markCycle(cycle, cells) {
  for(let i = 0; i < cycle.length; ++i) 
    cells[cycle[i].i][cycle[i].j].isInCycle = true;
}

// Виконуємо перестановку у циклі
function applyCycle(cycle, cells) {
  // Ініціалізуємо значення найменшого "мінусу"
  let min = cells[cycle[1].i][cycle[1].j].val;
  // Перебираєму усі "мінуси" і шукаємо найменший
  for(let i = 1; i < cycle.length; i+=2) 
    min = Math.min(min, cells[cycle[i].i][cycle[i].j].val)
  
  let coef = 1;
  // Уводимо нову клітинку до базису
  cells[cycle[0].i][cycle[0].j].val = 0;
  // Ітеруємося по усім клітинкам циклу
  for(let i = 0; i < cycle.length; ++i) {
    // І додаємо чи віднімаємо від них відповідний єлемент
    cells[cycle[i].i][cycle[i].j].val += coef*min;
    coef *= -1;
  }

  // Знаходимо перший нуль після перестановки у циклі
  // і виводимо його з базису
  for(let i = 0; i < cycle.length; ++i) {
    if(cells[cycle[i].i][cycle[i].j].val === 0) {
      cells[cycle[i].i][cycle[i].j].val = null;
      break;
    }
  }
}