const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

let data = null;

try {
  data = JSON.parse(sourceJson);
} catch (error) {
  document.querySelector('#data-error').hidden = false;
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const wanted = [];
  if (guideChecked) {
    wanted.push('guide');
  }
  if (audioChecked) {
    wanted.push('audio');
  }
  if (catalogChecked) {
    wanted.push('catalog');
  }

  const items = services
    .filter(service => wanted.includes(service.id))
    .map(({ title, price }) => {
      return { title: title.trim(), price: price };
    });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return { count: items.length, total: total, items: items };
}

if (data !== null) {
  document.querySelector('#event-title').textContent = data.event.title;
  document.querySelector('#event-date').textContent = data.event.date;
  document.querySelector('#event-place').textContent = data.event.place;
  document.querySelector('#event-description').textContent = data.event.description;

  document.querySelector('#service-form').hidden = false;

  document.querySelector('#show-program').addEventListener('click', function () {
    const program = document.querySelector('#program');
    program.hidden = false;
    program.innerHTML = data.event.meeting;
  });

  document.querySelector('#service-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const guideChecked = document.querySelector('#guide').checked;
    const audioChecked = document.querySelector('#audio').checked;
    const catalogChecked = document.querySelector('#catalog').checked;

    const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);

    const errorEl = document.querySelector('#choice-error');
    const resultEl = document.querySelector('#result');
    const jsonEl = document.querySelector('#report-json');

    if (report.count === 0) {
      errorEl.hidden = false;
      resultEl.hidden = true;
      jsonEl.hidden = true;
      return;
    }

    errorEl.hidden = true;

    const titles = report.items.map(item => item.title).join('<br>');
    resultEl.innerHTML = 'Выбрано услуг: ' + report.count + '<br>Итого: ' + report.total + ' руб.<br>' + titles;
    resultEl.hidden = false;

    const jsonString = JSON.stringify(report);
    JSON.parse(jsonString);
    jsonEl.textContent = jsonString;
    jsonEl.hidden = false;
  });
}
