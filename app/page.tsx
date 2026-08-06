"use client";

import { useMemo, useState } from "react";

type Tab = "roadmap" | "current" | "news" | "machine" | "organ" | "history";
type NewsType = "action" | "oper" | "cycle_closed";

const tabs: { id: Tab; label: string }[] = [
  { id: "machine", label: "Философская машина" },
  { id: "roadmap", label: "Дорожная карта" },
  { id: "current", label: "Текущий шаг" },
  { id: "news", label: "Новости" },
  { id: "history", label: "История сайта" },
];

const organs = [
  { id: "catalog", name: "Каталог", role: "SKU, ассортимент, принты и идентичность товара" },
  { id: "packing", name: "Упаковка", role: "Этикетки, маркировка единиц и сопоставление кодов" },
  { id: "logistic", name: "Логистика", role: "Поставки, коробки, кластеры, склады и таймслоты" },
  { id: "legal", name: "Право", role: "Требования к обороту товара и декларации" },
  { id: "legal/docs", name: "Правовые документы", role: "Хранение подтверждений и разрешительных документов" },
  { id: "economics", name: "Экономика", role: "Затраты, цена, прибыль и финансовое закрытие" },
  { id: "brand", name: "Бренд", role: "Публичное и визуальное представление проекта" },
];

const stages = [
  {
    id: "stage-01",
    horizon: "Сейчас",
    title: "Проверка ассортимента и операционного цикла",
    status: "В работе",
    confirmation: "Подтверждено",
    current: true,
    goal: "Проверить спрос, фактическую экономику и повторяемость пути от закупки до продажи на Ozon.",
    results: ["Первая партия: 30 единиц", "24 продажи зафиксированы; 4 единицы украдены на складе; 2 оставались непроданными", "Текущий денежный результат: −11 768,06 ₽ с учётом первичных расходов", "Повторяемая себестоимость без первичной маркировки: 510,17 ₽ на единицу"],
    transition: ["Повторить цикл на следующей партии", "Подтвердить прибыль после всех расходов", "Подтвердить устойчивый спрос и возвраты"],
    organs: ["catalog", "packing", "logistic", "economics", "legal"],
  },
  {
    id: "stage-02",
    horizon: "Ближайший цикл / до 6 месяцев",
    title: "Повторный ассортиментный эксперимент",
    status: "Запланировано",
    confirmation: "Частично подтверждено",
    current: false,
    goal: "Проверить ассортимент, цену и распределение товарного запаса на большей партии.",
    results: ["Список следующего заказа: 75 SKU из 32 предпочитаемых принтов", "ABC-тест цены и продвижения", "Две X-Dock поставки: Санкт-Петербург и СЗО; Москва, МО и дальние регионы"],
    transition: ["Поставка принята складами", "Получены сопоставимые данные продаж", "Зафиксированы рабочие правила цены, маркировки и упаковки"],
    organs: ["catalog", "packing", "logistic", "economics"],
  },
  {
    id: "stage-03",
    horizon: "Около 2 лет",
    title: "Развитие каналов и устойчивой поставки",
    status: "Требует решения",
    confirmation: "Требует уточнения",
    current: false,
    goal: "Горизонт зафиксирован в прежней модели проекта, но его детальная декомпозиция в доступной беседе не восстановлена.",
    results: ["Подтверждён только сам горизонт", "Точные этапы и количественные условия требуют исходного артефакта"],
    transition: ["Восстановить исходный план", "Согласовать критерии устойчивости и масштаба"],
    organs: [],
  },
  {
    id: "stage-04",
    horizon: "5–7 лет · 2031–2033",
    title: "Федеральная многоканальная система",
    status: "Будущий этап",
    confirmation: "Подтверждено как целевой ориентир",
    current: false,
    goal: "Покрытие розничного и оптового рынка РФ через маркетплейсы, DTC-магазин, опт и региональных партнёров.",
    results: ["20 000+ пар в год", "100+ оптовых клиентов", "B2B-инфраструктура", "Альтернативные производители", "Устойчивый бренд категории"],
    transition: ["Не определено: это конечный горизонт действующего плана"],
    organs: ["brand", "catalog", "logistic", "economics"],
  },
];

const tasks = [
  { id: "task-01", title: "Запустить продажи на Ozon", status: "Завершено", org: null, related: ["catalog"], evidence: "Магазин работает; продажи первой партии зафиксированы. Единственный орган-владелец по имеющимся данным не установлен." },
  { id: "task-02", title: "Рассчитать фактическую экономику первой партии", status: "Завершено", org: "economics", related: [], evidence: "При расходах 26 525,06 ₽ и чистом поступлении Ozon 14 757 ₽ текущий денежный результат составил −11 768,06 ₽. Без разовых 11 220 ₽ на первичную маркировку повторяемая себестоимость — 510,17 ₽, расчётная операционная прибыль — 104,71 ₽ на проданную единицу." },
  { id: "task-03", title: "Сформировать ассортимент следующего заказа", status: "Завершено", org: "catalog", related: [], evidence: "Сформирован список из 75 SKU, включающий 32 предпочитаемых принта. Это состав заказа, а не подтверждённое количество принятого складом товара." },
  { id: "task-04", title: "Подготовить и ввести коды маркировки", status: "Завершено", org: "packing", related: ["legal"], evidence: "Документ успешно принят системой «Честный знак»." },
  { id: "task-05", title: "Исправить процесс печати и наклеивания этикеток", status: "Завершено", org: "packing", related: ["catalog"], evidence: "Зафиксированы ошибки и новая инструкция: согласованный порядок, SKU и соседние этикетки." },
  { id: "task-06", title: "Провести две X-Dock поставки", status: "В работе", org: "logistic", related: [], evidence: "Сформированы отдельные грузоместа для кластеров «Санкт-Петербург и СЗО» и «Москва, МО и дальние регионы» с точкой сдачи ВЛАДИВОСТОК_491. Передача и приёмка складом документами не подтверждены." },
  { id: "task-07", title: "Получить декларацию на серийно выпускаемую одежду", status: "В работе", org: "legal", related: ["legal/docs"], evidence: "В памятке от 15 июля зафиксирована схема 3д по ТР ТС 017/2011 и необходимость договора с фактическим изготовителем. Наличие подписанного договора, испытаний и зарегистрированной декларации не подтверждено." },
  { id: "task-08", title: "Провести ABC-тест цены и продвижения", status: "Запланировано", org: "economics", related: ["catalog"], evidence: "План теста сформирован для следующей партии; результатов ещё нет." },
];

const news: { id: string; date: string; title: string; summary: string; type: NewsType; org: string | null; task?: string }[] = [
  { id: "news-01", date: "7 июня 2026", title: "Зафиксирован долгосрочный горизонт проекта", summary: "Long-Term Vision Register сформулировал ориентиры на 5–7 лет. Это план, не достигнутый результат.", type: "action", org: null },
  { id: "news-02", date: "1 июля 2026", title: "Документ принят «Честным знаком»", summary: "Формат документа для ввода полученных от физических лиц товаров успешно прошёл загрузку.", type: "oper", org: "packing", task: "task-04" },
  { id: "news-03", date: "15 июля 2026", title: "Обновлена инструкция по этикетированию", summary: "После ошибок первого цикла зафиксирован новый порядок печати: связанный порядок SKU, Ozon и кодов маркировки.", type: "cycle_closed", org: "packing", task: "task-05" },
  { id: "news-06", date: "15 июля 2026", title: "Созданы грузоместа для двух направлений", summary: "Сформированы этикетки X-Dock поставок в Санкт-Петербург и СЗО, а также в Москву, МО и дальние регионы. Приёмка складом пока не подтверждена.", type: "action", org: "logistic", task: "task-06" },
  { id: "news-04", date: "16 июля 2026", title: "Рассчитана фактическая экономика первой партии", summary: "Текущий денежный результат составил −11 768,06 ₽. Без разовой первичной маркировки расчётная повторяемая прибыль — 104,71 ₽ на продажу; для цели 500 ₽ рассчитана минимальная фактическая цена 2 900 ₽.", type: "cycle_closed", org: "economics", task: "task-02" },
  { id: "news-05", date: "16 июля 2026", title: "Сформирован следующий ассортимент", summary: "После добавления пропущенной группы ethniclanna список достиг 75 SKU из 32 предпочитаемых принтов. Это состав заказа, а не подтверждение складской приёмки 75 единиц.", type: "action", org: "catalog", task: "task-03" },
];

const typeLabels: Record<NewsType, string> = {
  action: "Действие",
  oper: "Операционный результат",
  cycle_closed: "Замкнутый цикл",
};

function OrgLinks({ ids, onNavigate }: { ids: string[]; onNavigate?: (id: string) => void }) {
  return <div className="organ-links">{ids.map((id) => <button key={id} data-org={id} onClick={() => onNavigate?.(id)}>{organs.find((org) => org.id === id)?.name ?? id}</button>)}</div>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("machine");
  const [selectedOrg, setSelectedOrg] = useState("catalog");
  const [newsFilter, setNewsFilter] = useState<"all" | NewsType>("all");
  const filteredNews = useMemo(() => newsFilter === "all" ? news : news.filter((item) => item.type === newsFilter), [newsFilter]);
  const go = (next: Tab, anchor?: string) => {
    setTab(next);
    requestAnimationFrame(() => anchor && document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };
  const openOrgan = (id: string) => {
    setSelectedOrg(id);
    go("organ");
  };
  const activeOrg = organs.find((org) => org.id === selectedOrg) ?? organs[0];
  const organTasks = tasks.filter((task) => task.org === activeOrg.id || task.related.includes(activeOrg.id));
  const organNews = news.filter((item) => item.org === activeOrg.id || (item.task && organTasks.some((task) => task.id === item.task)));
  const organStages = stages.filter((stage) => stage.organs.includes(activeOrg.id));

  return (
    <main>
      <header className="masthead">
        <div className="brand-row">
          <a className="compact-brand" href="#top" onClick={() => setTab("machine")} aria-label="Elephant Pants — философская машина">
            <span className="compact-mark">EP</span>
            <span>Elephant Pants<small>философская машина проекта</small></span>
          </a>
          <span className="edition">МАКЕТ · 05.08.2026</span>
        </div>
        <nav className="tabs" id="top" aria-label="Разделы проекта">{tabs.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}>{item.label}</button>)}</nav>
      </header>

      <section className="content-shell">
        {tab === "roadmap" && <div className="section" aria-labelledby="roadmap-title">
          <div className="section-head">
            <div><p className="section-index">01 / Business roadmap</p><h2 id="roadmap-title">Дорожная карта</h2></div>
            <p>Подтверждённая траектория от первой партии до федеральной многоканальной системы. Неизвестное не заполняется предположениями.</p>
          </div>
          <div className="roadmap">
            {stages.map((stage, index) => <article className={`stage ${stage.current ? "stage-current" : ""}`} key={stage.id} id={stage.id}>
              <div className="stage-rail"><span>{String(index + 1).padStart(2, "0")}</span></div>
              <div className="stage-main">
                <div className="stage-meta"><span>{stage.horizon}</span><span>{stage.status}</span><span>{stage.confirmation}</span></div>
                {stage.current && <p className="you-are-here">Мы находимся здесь</p>}
                <h3>{stage.title}</h3>
                <p className="stage-goal">{stage.goal}</p>
                <div className="stage-grid">
                  <div><h4>Ожидаемые / полученные ориентиры</h4><ul>{stage.results.map((r) => <li key={r}>{r}</li>)}</ul></div>
                  <div><h4>Условия перехода</h4><ul>{stage.transition.map((r) => <li key={r}>{r}</li>)}</ul></div>
                </div>
                {stage.organs.length > 0 ? <OrgLinks ids={stage.organs} onNavigate={openOrgan} /> : <p className="muted-note">Ответственные органы не установлены.</p>}
                {stage.current && <button className="text-link" onClick={() => go("current")}>Открыть текущий шаг →</button>}
              </div>
            </article>)}
          </div>
        </div>}

        {tab === "current" && <div className="section" aria-labelledby="current-title">
          <div className="section-head">
            <div><p className="section-index">02 / Current stage</p><h2 id="current-title">Текущий шаг</h2></div>
            <p>Проверка ассортимента, экономики и повторяемости операционного цикла. Данные актуальны по подтверждениям в беседе на 22 июля 2026.</p>
          </div>
          <div className="current-summary">
            <div><span>Связанный этап</span><strong>01 · Проверка ассортимента и операционного цикла</strong></div>
            <div><span>Подтверждённый контур</span><strong>30 товаров → 24 продано · 4 украдено на складе · 2 оставалось</strong></div>
            <div><span>Незакрыто</span><strong>Повторный цикл, устойчивая маржа, спрос и возвраты</strong></div>
          </div>
          <div className="task-list">
            {tasks.map((task) => <article className="task" key={task.id} id={task.id}>
              <div className="task-title"><span>{task.id.replace("task-", "")}</span><h3>{task.title}</h3><em className={`status status-${task.status.toLowerCase().replaceAll(" ", "-")}`}>{task.status}</em></div>
              <p>{task.evidence}</p>
              <div className="task-foot"><span>Владелец:</span>{task.org ? <OrgLinks ids={[task.org]} onNavigate={openOrgan} /> : <span className="unassigned">не установлен</span>}{task.related.length > 0 && <><span>Участвуют:</span><OrgLinks ids={task.related} onNavigate={openOrgan} /></>}</div>
            </article>)}
          </div>
        </div>}

        {tab === "news" && <div className="section" aria-labelledby="news-title">
          <div className="section-head">
            <div><p className="section-index">03 / Project log</p><h2 id="news-title">Новости проекта</h2></div>
            <p>События бизнеса отделены от изменений сайта. Тип показывает глубину достигнутого результата.</p>
          </div>
          <div className="filter-row" role="group" aria-label="Фильтр новостей">
            {(["all", "action", "oper", "cycle_closed"] as const).map((f) => <button key={f} className={newsFilter === f ? "selected" : ""} onClick={() => setNewsFilter(f)}>{f === "all" ? "Все" : typeLabels[f]}</button>)}
          </div>
          <div className="news-list">
            {filteredNews.map((item) => <article key={item.id} className="news-item">
              <time>{item.date}</time><div><span className={`news-type type-${item.type}`}>{typeLabels[item.type]}</span><h3>{item.title}</h3><p>{item.summary}</p><div className="news-links">{item.org ? <OrgLinks ids={[item.org]} onNavigate={openOrgan} /> : <span className="unassigned">Ответственный орган не установлен</span>}{item.task && <button className="text-link" onClick={() => go("current", item.task)}>Связанная задача →</button>}</div></div>
            </article>)}
          </div>
          <aside className="classification"><h3>Как читаются типы</h3><dl><div><dt>Действие</dt><dd>Шаг выполнен, но изменение внешнего состояния ещё не подтверждено.</dd></div><div><dt>Операционный результат</dt><dd>Система приняла действие или наблюдаемое состояние изменилось.</dd></div><div><dt>Замкнутый цикл</dt><dd>Результат привёл к изменению инструкции, правила, знания или плана.</dd></div></dl></aside>
        </div>}

        {tab === "machine" && <div className="machine-page" aria-label="Философская машина Elephant Pants">
          <aside className="machine-sidebar" aria-label="Подразделы философской машины">
            <a href="#opers-map"><span>01 /</span> карта opers</a>
            <a href="#oneoff-cycles"><span>02 /</span> разовые циклы</a>
            <a href="#next-step"><span>03 /</span> следующий шаг</a>
          </aside>
          <div className="machine-main">
            <div className="machine-diagram" id="machine-map">
              <img src="/machine-diagram-blue.png" alt="Философская машина Elephant Pants: Catalog входит в цикл Economics, состоящий из Import, Logistic и Sales; Cashflow выходит из машины, а бюджет возвращается к новым каталогам." />
            </div>
          <section className="machine-section" id="opers-map"><div className="machine-section-head"><span>01 / карта opers</span><div><h2>Кто и что приводит машину в движение</h2><p>Opers распределены между тремя циклами. Узел задаёт контекст взаимодействия, но ещё не фиксирует исполнителя: он будет определён в будущей инструкции каждого oper.</p></div></div>
            <div className="opers-table"><div className="opers-row opers-header"><span>Цикл</span><span>Узел</span><span>Opers</span><span>Инструкции</span></div>{[
              ['import','Import','ChinRada',['запрос','каталог','платёж','отправка']],['logistic','Logistic','CDEK',['сообщение','платёж','отправка']],['logistic','Logistic','Self',['приёмка','маркировка','упаковка','отгрузка']],['sales','Sales','Ozon',['анализ','маркетинг','выручка']]
            ].map(([cycle,title,node,opers],i) => <div key={`${node}-${i}`} className={`opers-row row-${cycle}`}><strong>{title as string}</strong><b>{node as string}</b><div className="oper-pills">{(opers as string[]).map(x => <span key={x}>{x}</span>)}</div><small>TODO · для каждого oper</small></div>)}</div>
          </section>
          <section className="oneoff-section" id="oneoff-cycles"><div className="machine-section-head"><span>02 / разовые циклы</span><div><h2>Проекты, которые меняют состояние машины</h2><p>В отличие от постоянного оборота Economics, каждый проект имеет конечный результат и закрывается после прохождения своих стадий.</p></div></div><div className="oneoff-grid">{[['P / 01','Декларация 3Д','Разовый регуляторный цикл проекта.'],['P / 02','Маркировка','Подбор и настройка ПО, создающие условия для регулярного oper «маркировка».'],['P / 03','Брендирование','Отдельный цикл развития бренда, не равный регулярному oper «маркетинг».']].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><div><small>цель</small><small>бюджет</small><small>стадии</small><small>отчёт</small><small>результат</small></div></article>)}</div></section>
          <section className="instruction-next" id="next-step"><div><span>03 / следующий шаг</span><strong>Из схемы — в инструкции.</strong></div><div><h2>Добавить подробную инструкцию для каждого oper</h2><p>Структура машины уже зафиксирована. Следующий слой делает её исполнимой: каждая операция получает собственную детальную инструкцию.</p></div></section>
          </div>
        </div>}

        {tab === "organ" && <div className="section" aria-labelledby="organ-title">
          <div className="organ-detail-head">
            <button className="back-link" onClick={() => go("machine")}>← Все органы</button>
            <p className="section-index">ORG / {activeOrg.id}</p>
            <h2 id="organ-title">{activeOrg.name}</h2>
            <p>{activeOrg.role}</p>
          </div>
          <div className="organ-totals"><span>{organStages.length} этапов дорожной карты</span><span>{organTasks.length} связанных задач</span><span>{organNews.length} связанных новостей</span></div>
          <div className="organ-aggregate">
            <section><h3>Дорожная карта</h3>{organStages.length ? organStages.map((stage) => <article className="aggregate-item" key={stage.id}><p className="aggregate-meta">{stage.horizon} · {stage.status}</p><h4>{stage.title}</h4><p>{stage.goal}</p><button className="text-link" onClick={() => go("roadmap", stage.id)}>Открыть этап →</button></article>) : <p className="empty-state">Связанные этапы не зафиксированы.</p>}</section>
            <section><h3>Задачи</h3>{organTasks.length ? organTasks.map((task) => <article className="aggregate-item" key={task.id}><p className="aggregate-meta">{task.org === activeOrg.id ? "Орган-владелец" : "Участвующий орган"} · {task.status}</p><h4>{task.title}</h4><p>{task.evidence}</p><button className="text-link" onClick={() => go("current", task.id)}>Открыть задачу →</button></article>) : <p className="empty-state">Связанные задачи не зафиксированы.</p>}</section>
            <section><h3>Новости и результаты</h3>{organNews.length ? organNews.map((item) => <article className="aggregate-item" key={item.id}><p className="aggregate-meta">{item.date} · {typeLabels[item.type]}</p><h4>{item.title}</h4><p>{item.summary}</p>{item.task && <button className="text-link" onClick={() => go("current", item.task)}>Открыть связанную задачу →</button>}</article>) : <p className="empty-state">Связанные новости не зафиксированы.</p>}</section>
          </div>
        </div>}

        {tab === "history" && <div className="section" aria-labelledby="history-title">
          <div className="section-head"><div><p className="section-index">05 / Site changelog</p><h2 id="history-title">История сайта</h2></div><p>Здесь фиксируются только изменения представления проекта. Продажи, поставки и маркировка остаются в новостях бизнеса.</p></div>
          <article className="change-entry"><div><time>5 августа 2026</time><span>Размер диаграммы</span></div><h3>Отменено ограничение высоты 400 px</h3><ul><li>Обрезанная версия 1774 × 400 px заменена полноразмерным изображением 1774 × 887 px.</li><li>Диаграмма занимает ширину рабочей колонки, а её высота рассчитывается автоматически.</li><li>Исходные пропорции изображения сохранены без растяжения.</li></ul><p className="change-note">Основание: прямое указание оператора.</p></article>
          <article className="change-entry"><div><time>5 августа 2026</time><span>Навигация философской машины</span></div><h3>Добавлен левый сайдбар подразделов</h3><ul><li>Карта opers, разовые циклы и следующий шаг получили постоянную навигацию.</li><li>Содержимое страницы смещено вправо в отдельную рабочую колонку.</li><li>Диаграмма размещена с компактными боковыми полями и сохраняет целиком все подписи.</li></ul><p className="change-note">Основание: прямое указание оператора.</p></article>
          <article className="change-entry"><div><time>5 августа 2026</time><span>Визуальная правка схемы</span></div><h3>Возвращён исходный синий фон</h3><ul><li>Зелёная версия статичной схемы заменена ранее утверждённой синей версией.</li><li>Удалена нижняя подпись «Бюджет»; линия и стрелка возврата сохранены.</li><li>Остальная структура и расположение элементов не изменены.</li></ul><p className="change-note">Основание: прямое указание оператора.</p></article>
          <article className="change-entry"><div><time>5 августа 2026</time><span>Финализация изображения схемы</span></div><h3>Установлена согласованная диаграмма высотой 400 px</h3><ul><li>Холст расширен до высоты 400 px без изменения пропорций круглых шестерёнок.</li><li>Стрелка Cashflow → Catalog восстановлена и стала непрерывной.</li><li>Синий фон осветлён; структура и подписи схемы сохранены.</li></ul><p className="change-note">Основание: утверждённая оператором статичная версия.</p></article>
          <article className="change-entry"><div><time>5 августа 2026</time><span>Замена реализации схемы</span></div><h3>Утверждённая схема размещена как изображение</h3><ul><li>Программно собранная версия machine-diagram полностью удалена.</li><li>На её месте размещена утверждённая статичная схема без изменений структуры.</li><li>Тёмно-синий фон изображения заменён фирменным зелёным фоном сайта.</li></ul><p className="change-note">Основание: прямое указание оператора.</p></article>
          <article className="change-entry"><div><time>5 августа 2026</time><span>Обновление схемы</span></div><h3>Циклы представлены как сцепленная солнечная система</h3><ul><li>Три цикла выстроены в ряд и стилизованы под солнца в палитре тайского текстиля.</li><li>Треугольные Catalog и Cashflow показывают вход в машину и выход из неё.</li><li>Бюджетный контур получил направленную влево стрелку возврата к новым каталогам.</li><li>Синий фон заменён фирменным зелёным; вводный блок machine-hero удалён.</li></ul><p className="change-note">Основание: утверждённая оператором структура статичной схемы.</p></article>
          <article className="change-entry"><div><time>5 августа 2026</time><span>Исправление интерфейса</span></div><h3>Схема машины раскрыта на всю ширину экрана</h3><ul><li>Блок machine-diagram выведен за ограничения внутренней колонки.</li><li>Крайние и нижние подписи размещены внутри безопасной области и больше не обрезаются.</li><li>Сохранена адаптивная компоновка для узких экранов.</li></ul><p className="change-note">Основание: прямое указание оператора.</p></article>
          <article className="change-entry"><div><time>5 августа 2026</time><span>Новая главная страница</span></div><h3>Философская машина перенесена из репозитория</h3><ul><li>Раздел «Философская машина» стал первым и открывается по умолчанию.</li><li>Содержимое синхронизировано с актуальным макетом репозитория ep_dashboard.</li><li>На всём сайте установлена компактная общая шапка из макета.</li></ul><p className="change-note">Основание: прямое указание оператора и текущее содержимое valerol/ep_dashboard.</p></article>
          <article className="change-entry"><div><time>22 июля 2026</time><span>Агрегация по органам</span></div><h3>Теги органов стали рабочими фильтрами</h3><ul><li>Каждый тег открывает отдельное представление выбранного органа.</li><li>На странице органа собраны все связанные этапы дорожной карты, задачи и новости.</li><li>Учитываются как владение задачей, так и подтверждённое участие органа.</li></ul><p className="change-note">Основание: исправление навигационной и смысловой функции тегов по указанию оператора.</p></article>
          <article className="change-entry"><div><time>22 июля 2026</time><span>Уточнение состава следующего заказа</span></div><h3>Исправлено соотношение SKU и принтов</h3><ul><li>Следующий заказ уточнён как 75 SKU из 32 предпочитаемых принтов.</li><li>Удалена ошибочная формулировка о 75 предпочитаемых принтах.</li></ul><p className="change-note">Основание: прямое уточнение оператора.</p></article>
          <article className="change-entry"><div><time>22 июля 2026</time><span>Проверка фактов по Google Drive</span></div><h3>Исправлены фактические данные</h3><ul><li>Схема декларации исправлена с 4д на 3д согласно юридической памятке.</li><li>Добавлены точные результаты юнит-экономики и ценовой расчёт.</li><li>Состав заказа отделён от подтверждённой складской приёмки товара.</li><li>Добавлены две созданные X-Dock поставки; их приёмка оставлена неподтверждённой.</li><li>Экономический цикл переклассифицирован как замкнутый: расчёт привёл к новому ценовому правилу.</li></ul><p className="change-note">Основание: документы папок economics, logistic и legal в Google Drive Elephant Pants.</p></article>
          <article className="change-entry"><div><time>22 июля 2026</time><span>Первая версия GPT Sites</span></div><h3>Создано живое представление Elephant Pants</h3><ul><li>Добавлена долгосрочная дорожная карта с отметкой текущей позиции.</li><li>Операционный план выделен в раздел «Текущий шаг».</li><li>Актуализированы подтверждённые задачи и новости до 22 июля.</li><li>Задачи и новости связаны с каноническими органами.</li><li>Добавлена отдельная история сайта и правила классификации событий.</li></ul><p className="change-note">Основание: подтверждённые сведения текущей беседы и восстановленное содержание Long-Term Vision Register.</p></article>
          <article className="source-register"><h3>Реестр источников и пробелов</h3><div className="source-grid"><div><h4>Подтверждено документами</h4><p>Экономика партии на 30 единиц; 24 продажи, 4 кражи и остаток 2; расходы 26 525,06 ₽; сальдо Ozon 14 757 ₽; две этикетки X-Dock; памятка по декларации 3д.</p></div><div><h4>Подтверждено беседой</h4><p>Список следующего заказа из 75 SKU и 32 предпочитаемых принтов, успешная загрузка документа «Честным знаком» и обновлённая инструкция этикетирования. Хранящийся XML сам по себе не является свидетельством принятия.</p></div><div><h4>Требует подтверждения</h4><p>Передача и приёмка двух поставок, договор с фактическим изготовителем, испытания и декларация 3д, результаты продвижения, устойчивый спрос, маржа и возвраты.</p></div><div><h4>Историческое правило</h4><p>При обновлении сохраняется предыдущий снимок; новая запись относится либо к бизнесу, либо к сайту, но не к обоим сразу.</p></div></div></article>
        </div>}
      </section>

      <footer><span>Elephant Pants</span><p>Рабочая история проекта · только подтверждённые сведения</p><button onClick={() => setTab("history")}>Метод и источники</button></footer>
    </main>
  );
}
