// Імпортуємо бібліотеку React задля корректної роботи рендерингу
import React, {useState} from "react";
// Підключення стилів. Це робиться у файлі джаваскрипт, бо збірник React 
// (на базі WebPack) усе одно переносить їх у HTML самостійно
import "./index.css";
// Нижче ми імпортуємо усі функції, необхідні для виконалля логіки задачі

// Функція, що знаходить опорний план
import setInitialPlan from "./setInitialPlan";
// Функція, що ініціалізує клітинки з вводу користувача
import initializeCells from "./initializeCells";
// Встрановлює потенціали для методу потенціалів
import setPotentials from "./setPotentials";
// Встановлює псевдо-тарифи для небазисних клітинок
import setPseudoC from "./setPseudoC";
// Отримує усі таблиці(стани) задачі
import getStates from "./getStates";

// Ініціюємо шаблон початкового стану задачі
const initialState = {
  // Майбутній масив клітинок
  cells: [],
  // Масив отримувачів товару
  b: [],
  // Масив постачальників товару
  a: [],
}

// Функція, що відображає усі дані
function App() {
  // useState - функція із React, що дозволяє реактивно змінювати значення змінних
  // У функції ми завжди отримуємо поточне значенн змінної (states i finalMessage)
  // Встановлюємо ми значення через особливу функцію(наступну після змінної), що встановлює
  // актуальне значення і запускає перемальовку розмітки з уже актуальними даними
  const [states, setStates] = useState([]);
  const [finalMessage, setFinalMessage] = useState("");

  // Функція початку обчисленнь
  function startCalculate() {
    // Ініціюємо клітинки першої таблиці
    initializeCells(initialState);
    // Шукаємо опорний план
    setInitialPlan(initialState);
    // Встановлюємо потенціали для методу потенціалів
    setPotentials(initialState);
    // Шукаємо псевдо-тарифи для небазисних клітинок
    setPseudoC(initialState);
    // Отримуємо масив таблиць задачі
    const states = getStates(initialState);

    // Беремо останню таблицю
    const lastState = states[states.length - 1];
    
    // Ініціалізуємо змінну суми витрат на перевезення
    let sum = 0;
    // Якщо є кінцевий стан
    if(lastState) {
      // Ітеруємося по клітинкам
      for(let row of lastState.cells) {
        for(let cell of row) {
          // Якщо клітинка не є штучною і є базисною відповідно
          // Детальніше про структуру cell - у файлі initializeCells.js
          if(cell.c !== 1e5 && cell.val !== null) 
            // То додаємо у витрати добуток фінального значення клітики і вагу цього перевезення
            sum += cell.c * cell.val;
        }
      }
      // Встановлюємо фінальне повідомлення
      setFinalMessage(`Отже, перевезення усіх можливих товарів буде коштувати ${sum} грн`);
    }

    // Встановлюємо усі стани
    setStates(states);
  }
  // Сворюємо функції створення розмітки для клітинок вводу значень матриці, обмежені, і коефіцієнтів цільової функції відповідно
  // Зроблено це задля зручності і відсутності дублюючогося коду
  const aInput = (i) => (<input 
      type="number" 
      min="0" 

      // У таких `` кавичках - шабланні строки. Вони підставляюсть значення з ${} у строку
      // Наприклад `a${i}${j}` при i = 1 та j = 6 буде "a16"
      id={`a${i}`} 
      step="0.01"
      
      // У таких фігурних дужках вставляються не статичні значення, як у HTML
      // А динамічні, як у JSX
      defaultValue={5 - i}
  />);
  const bInput = (j) => (<input 
      type="number" 
      min="0" 
      id={`b${j}`} 
      step="0.01" 
      defaultValue={(j + 3)} 
  />);
  const cInput = (i, j) => (<input 
      type="number" 
      id={`c${i}${j}`} 
      step="0.01" 
      defaultValue={(i+3)*(j+2)}
  />);

  // Тут ми повертаємо увесь JSX код.
  // Зазвичай він відповідає HTML кодові, тому коментувати будемо лише окремі моменти
  return (
    <>
      <h3>Уведіть свої дані у таблицю нижче і натисніть "Розрахувати"</h3>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>B<sub>1</sub> = {bInput(0)}</th>
            <th>B<sub>2</sub> = {bInput(1)}</th>
            <th>B<sub>3</sub> = {bInput(2)}</th>
          </tr>
        </thead>
        <tbody>
          {/* Коментарі тут пишуться так, а не через "//", як у джаваскрипт  */}
      
          {/* Конструкція з фігурних скобок означає, що ми щось динамічно вписуємо
              Нижче, ми беремо масив і для кожного з його елементів повераємо JSX розмітку
              Це створено для рендерингу списку однотипних елементів
              У даному випадку усі, окрім верхньої рядки таблиці 
          */}

          {[0, 1, 2].map(i =>
            <tr key={i}>
              <td>A<sub>{i+1}</sub> = {aInput(i)}</td>
              {[0, 1, 2].map(j =>
                <td key={j}>C<sub>{i+1}{j+1}</sub> = {cInput(i, j)}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>

     {/*Тут кнопці "Розрахувати" ми визначаємо, що функція початку обчислень
     буде запускатися при кліці на кнопку через задання аргументу
     onClick
    */}

    <button onClick={startCalculate} >Розрахувати</button>

    {/*className у JSX - аналог class у HTML*/}
    <div className="finalMessage">{finalMessage}</div>

      {states.map(state =>
        <table>
          <thead>
            <tr>
              <th></th>
              {state.b.map((el, j) =>
                <th key={j}>B<sub>{j+1}</sub> = {el} <br />
                    v<sub>{j+1}</sub> = {state.v[j]}
                </th>
              )}
            </tr>
          </thead>

          <tbody>
          {state.a.map((el, i) =>
            <tr key={i}>
              <td>A<sub>{i+1}</sub> = {state.a[i]} <br />
                  u<sub>{i+1}</sub> = {state.u[i]}
              </td>
              {state.cells[i].map(cell =>
               <td className={"cell " + (cell.isInCycle ? "in-cycle" : "")}>
               <div className="c">{cell.c}</div>

               {cell.val !== null ? 
                 <div className="val">{cell.val}</div> 
                 :
                 <div className="c_">{cell.c_}</div>
               }
               </td>
              )}
            </tr>
          )}
        </tbody>
        </table>
      )}

    </>
  );
}

export default App;
