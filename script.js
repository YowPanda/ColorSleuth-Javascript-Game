// Текущий уровень
let level = sessionStorage.getItem("level");	// Получаем уровень из текущей сессии
if (level == null)
{
	level = 0;
}

// Обратный отсчет времени
let timerId = null;
let timer = document.querySelector(".timer");
let currentSec =  sessionStorage.getItem("currentSec");
if (currentSec == null)
{
	currentSec = 15;
}
timer.innerHTML = 'ОСТАЛОСЬ: ' + currentSec + ' СЕК';

// Рандомное целое значение в границах
function getRandom(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;	//Максимум не включается, минимум включается
}

// Список квадратов
const squareList = document.querySelector(".list-of-squares");

// Отдельный квадрат
const square = getComputedStyle(document.querySelector(".list-of-squares li")).all;
squareList.removeChild(squareList.firstChild);

// Ширина поля под квадраты (меньше на 1 пиксель)
let fieldWidth = getComputedStyle(document.querySelector(".playing-field")).getPropertyValue("--playing-field-side");
fieldWidth = fieldWidth.substr(0, fieldWidth.length - 2) - 1;	// Получаем размерность игрового поля

// Переход на следующий уровень
function nextLevel()
{
    // Очищаем список
    while (squareList.firstChild)
	{
        squareList.removeChild(squareList.firstChild);
    }

    // Количество квадратов на поле
    const squareCount = (level + 1) ** 2;

    // Сторона отдельного квадрата
    let squareWidth = (fieldWidth / (level + 1)) - 2;
		
	// Выбираем уникальный квадрат
    let uniqueSquare = getRandom(0, squareCount - 1);

    // Цвета квадратов
    let r = getRandom(70, 150);
    let g = getRandom(70, 150);
    let b = getRandom(70, 150);

	// Стиль для квадратов c добавлением размеров
	const squareStyle = square + `width: ${squareWidth}px; height: ${squareWidth}px;`;

	// Создаем объект уровня и задаем его
	let levelObj = document.querySelector(".level");
    levelObj.innerHTML = 'УРОВЕНЬ: ' + level;
	
    for (let i = 0; i < squareCount; i++)
	{
		// Создаем объекты квадратов
        let squareObj = document.createElement("li");
		
		// Начало игры (перепрохождение)
		if (level === 0)
		{
            squareObj.innerHTML = 'НАЖМИ ДЛЯ СТАРТА';
			timer.innerHTML = 'ОСТАЛОСЬ: ' + currentSec + ' СЕК';			
        }		
		
		// Обработка уникального квадрата
        if (i === uniqueSquare)
		{
			// Приращение цвета к уникальному квадрату
			let increment = 70 / level;
			
			// Стиль уникального квадрата
			const uniqueSquareStyle = squareStyle + `background-color: rgb( ${r - increment}, ${g - increment}, ${b - increment});`;
			squareObj.style = uniqueSquareStyle;
			
			// Обработка клика по уникальному квадрату
            squareObj.onclick = function ()
			{
				// Увеличиваем уровень
                level++;
                sessionStorage.setItem('level', level);
				
				// Задаем таймер если он не задан
				if (timerId == null)
				{
					timerId = setInterval(() =>
					{
						// Уменьшаем таймер
						currentSec--;
						sessionStorage.setItem('currentSec', currentSec);
						timer.innerHTML = 'ОСТАЛОСЬ: ' + currentSec + ' СЕК';
						
						// Если время вышло
						if (currentSec === 0)
						{
							clearInterval(timerId);	// Остановка таймера
							alert("Ого!\nТы дошел до " + level + " уровня за 15 секунд!");
							
							// Сбрасываем параметры
							sessionStorage.clear();
							level = 0;
							currentSec = 15;
							timerId = null;
							
							nextLevel();
						}
					}, 1000);	// Повторять каждую секунду
				}
                nextLevel();
            };
        }
		else
		{
			// Базовый стиль квадратов
			const baseSquareStyle = squareStyle + `background-color: rgb(${r}, ${g}, ${b});`;
            squareObj.style = baseSquareStyle;
			
			// Обработка клика по базовому квадрату
            squareObj.onclick = function ()
			{
				clearInterval(timerId);
				alert("Упс!\nНе тот квадрат!");
							
                sessionStorage.clear();
				level = 0;
				currentSec = 15;
				timerId = null;
				nextLevel();
			}
        }
		
		// Вставляем объект квадрата в список
        squareList.append(squareObj);
    }
}

nextLevel();
