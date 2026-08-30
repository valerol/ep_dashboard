"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type View = "state" | "cycles" | "physiology" | "projects" | "observation" | "strategy" | "service";
type ClosableCycle = { id: string; type: string; title: string; parent: string | null; evidencePolicy: "NOT_REQUIRED" };

const navigation: { id: Exclude<View, "service">; index: string; label: string }[] = [
  { id: "state", index: "01", label: "Состояние" },
  { id: "cycles", index: "02", label: "Циклы" },
  { id: "physiology", index: "03", label: "Физиология" },
  { id: "projects", index: "04", label: "Проекты" },
  { id: "observation", index: "05", label: "Наблюдение" },
  { id: "strategy", index: "06", label: "Стратегия" },
];

const cycles = [
  { id: "EP-S-20260830-001", type: "OZON_WEEKLY_SALES_REVIEW", title: "Тест главного изображения Ozon", cls: "SALES", occurrence: 5, state: "OPEN", decision: "READY", outcome: "NONE", parent: "EP-S-20260807-001", result: "Новая главная карточка chi-vintagerosemandala-pine размещена на Ozon. База теста: 350 показов / 0 заказов; контроль chi-ethniclanna-mint — 290 / 0.", step: "Сохранять бустинг 15% и остальные факторы без изменений; наблюдать до недельной проверки 6 сентября.", evidencePolicy: "REQUIRED", evidence: ["EP-EVENT-20260830-002", "EP-EVENT-20260830-003"] },
  { id: "EP-S-20260822-001", type: "OZON_WEEKLY_SALES_REVIEW", title: "Тест эластичного бустинга", cls: "SALES", occurrence: 4, state: "CLOSED", decision: "NEXT_STEP_SELECTED", outcome: "ACHIEVED", parent: "EP-S-20260807-001", result: "1 заказ на 2 900 ₽ при 4 076 показах. Продвигаемые 4 SKU: 898 показов против ≈894 неделей ранее; остальной ассортимент снизился примерно на 13%. Заказов в тестовой группе не было.", step: "Тест закрыт. Следующий эксперимент — конверсия главной карточки chi-vintagerosemandala-pine.", evidence: ["EP-EVENT-20260830-001"] },
  { id: "EP-S-20260814-001", type: "OZON_WEEKLY_SALES_REVIEW", title: "Недельный обзор продаж Ozon", cls: "SALES", occurrence: 3, state: "CLOSED", decision: "READY", outcome: "ACHIEVED", parent: "EP-S-20260807-001", result: "32 SKU, 2 заказа на 5 800 ₽ и 4 999 показов; выбран недельный тест точечного продвижения четырёх SKU.", step: "Цикл закрыт после выбора следующего теста.", evidence: ["EP-EVENT-20260822-001", "EP-EVENT-20260822-002"] },
  { id: "EP-S-20260809-001", type: "OZON_WEEKLY_SALES_REVIEW", title: "Недельный обзор продаж Ozon", cls: "SALES", occurrence: 2, state: "CLOSED", decision: "NO_ACTION", outcome: "ACHIEVED", parent: "EP-S-20260807-001", result: "32 строки, 3 заказа на 8 700 ₽ и 6 108 показов; принято решение NO_ACTION.", step: "Цикл закрыт. Следующий обзор — новая итерация.", evidence: ["EP-EVENT-20260814-001", "EP-EVENT-20260814-002"] },
  { id: "EP-S-20260807-001", type: "SALES_BATCH", title: "Продажа второй партии", cls: "SALES", occurrence: 2, state: "OPEN", decision: "READY", outcome: "NONE", parent: null, result: "Родительский цикл второй партии остаётся открыт; продажи и недельные эксперименты продолжаются.", step: "Продолжать недельные обзоры и эксперименты до достижения критерия закрытия партии.", evidencePolicy: "REQUIRED", evidence: ["EP-EVENT-20260830-001", "EP-EVENT-20260830-003"] },
  { id: "EP-S-20260807-002", type: "OZON_WEEKLY_SALES_REVIEW", title: "Недельный обзор продаж Ozon", cls: "SALES", occurrence: 1, state: "CLOSED", decision: "NO_ACTION", outcome: "ACHIEVED", parent: "EP-S-20260807-001", result: "CSV создан: 33 строки, 2 заказа на 5 800 ₽, 10 249 показов. Отсутствие SKU принято как ограничение данных.", step: "Цикл закрыт. Следующий обзор — новая итерация.", evidence: ["EP-EVENT-20260807-008", "EP-EVENT-20260807-009"] },
  { id: "EP-LI-20260807-001", type: "LOGISTICS_BATCH", title: "Логистика второй партии", cls: "LOGISTIC_IMPORT", occurrence: 2, state: "CLOSED", decision: "READY", outcome: "ACHIEVED", parent: null, result: "75 единиц доставлены в Россию, переданы на Ozon и полностью приняты.", step: "Цикл закрыт после закрытия обязательных дочерних циклов.", evidence: ["EP-EVENT-20260807-004", "EP-EVENT-20260807-005", "EP-EVENT-20260807-006", "EP-EVENT-20260807-007"] },
  { id: "EP-LI-20260807-002", type: "INTERNATIONAL_DELIVERY", title: "Международная доставка", cls: "LOGISTIC_IMPORT", occurrence: 2, state: "CLOSED", decision: "READY", outcome: "ACHIEVED", parent: "EP-LI-20260807-001", result: "75 единиц второй партии доставлены в российский логистический контур.", step: "Закрыто по последующему подтверждённому движению партии.", evidence: ["EP-EVENT-20260807-001", "EP-EVENT-20260807-005"] },
  { id: "EP-LR-20260807-001", type: "OZON_TRANSFER", title: "Передача партии на Ozon", cls: "LOGISTIC_RUSSIA", occurrence: 2, state: "CLOSED", decision: "READY", outcome: "ACHIEVED", parent: "EP-LI-20260807-001", result: "Все 75 единиц переданы и приняты Ozon без неурегулированных расхождений.", step: "Закрыто после полной приёмки.", evidence: ["EP-EVENT-20260807-001", "EP-EVENT-20260807-004"] },
  { id: "EP-LR-20260807-002", type: "OZON_SHIPMENT", title: "Отгрузка на Ozon", cls: "LOGISTIC_RUSSIA", occurrence: 2, state: "CLOSED", decision: "READY", outcome: "ACHIEVED", parent: "EP-LR-20260807-001", result: "Отгружено 75 единиц: 43 в Москву и 32 в Санкт-Петербург.", step: "Закрыто после сверки приёмки.", evidence: ["EP-EVENT-20260807-001", "EP-EVENT-20260807-003"] },
  { id: "EP-LR-20260807-003", type: "OZON_ACCEPTANCE", title: "Приёмка складами Ozon", cls: "LOGISTIC_RUSSIA", occurrence: 2, state: "CLOSED", decision: "READY", outcome: "ACHIEVED", parent: "EP-LR-20260807-001", result: "Принято 75 единиц; баланс 41 + 32 + 2 продажи = 75. Расхождений нет.", step: "Закрыто после сверки остатков.", evidence: ["EP-EVENT-20260807-001", "EP-EVENT-20260807-002"] },
];

const events = [
  { id: "EP-EVENT-20260830-003", date: "30.08.2026", type: "STATE_OBSERVED", title: "Экспериментальная карточка размещена на Ozon", detail: "Новая главная карточка chi-vintagerosemandala-pine опубликована. Эксперимент перешёл из подготовки в недельное наблюдение; контроль — chi-ethniclanna-mint.", cycle: "EP-S-20260830-001", evidence: "OWNER_LPR_ACTION:2026-08-30:CHI_VINTAGEROSEMANDALA_PINE_IMAGE_UPLOADED_TO_OZON" },
  { id: "EP-EVENT-20260830-002", date: "30.08.2026", type: "STATE_OBSERVED", title: "Выбран тест новой главной карточки", detail: "Экспериментальный SKU — chi-vintagerosemandala-pine; контроль — chi-ethniclanna-mint. Бустинг 15% сохраняется неизменным.", cycle: "EP-S-20260830-001", evidence: "OWNER_LPR_DECISION:2026-08-30:TEST_PRODUCT_CARD_IMAGE" },
  { id: "EP-EVENT-20260830-001", date: "30.08.2026", type: "CYCLE_CLOSED", title: "Тест эластичного бустинга завершён", detail: "Продвигаемые SKU сохранили суммарные показы на уровне предыдущей недели на фоне общего падения трафика, но не дали заказов; выбран следующий тест конверсии.", cycle: "EP-S-20260822-001", evidence: "OWNER_LPR_OBSERVATION:2026-08-30:OZON_WEEKLY_ANALYTICS" },
  { id: "EP-EVENT-20260807-009", date: "07.08.2026", type: "CYCLE_CLOSED", title: "Недельный обзор продаж закрыт", detail: "Принято решение NO_ACTION; родительский цикл продаж остаётся OPEN.", cycle: "EP-S-20260807-002", evidence: "OWNER_LPR_DECISION:2026-08-07:NO_ACTION" },
  { id: "EP-EVENT-20260807-008", date: "07.08.2026", type: "STATE_OBSERVED", title: "Статистика Ozon преобразована в CSV", detail: "33 строки; 2 заказа; 5 800 ₽; 10 249 показов. Идентификация товаров ограничена отсутствующими SKU.", cycle: "EP-S-20260807-002", evidence: "OZON_SALES_ANALYTICS_CSV:ozon_sales_week_2026-08-07.csv" },
  { id: "EP-EVENT-20260807-007", date: "07.08.2026", type: "CYCLE_CLOSED", title: "Логистика второй партии закрыта", detail: "Международная доставка и передача на Ozon завершены с outcome ACHIEVED.", cycle: "EP-LI-20260807-001", evidence: "EP-EVENT-20260807-004..006" },
  { id: "EP-EVENT-20260807-006", date: "07.08.2026", type: "STATE_OBSERVED", title: "Зафиксирована иерархия логистических циклов", detail: "Передача на Ozon связана с родительским циклом логистики партии.", cycle: "EP-LR-20260807-001", evidence: "PARENT_RELATION_RECORDED:SECOND_OZON_TRANSFER" },
  { id: "EP-EVENT-20260807-005", date: "07.08.2026", type: "CYCLE_CLOSED", title: "Международная доставка закрыта", detail: "75 единиц доставлены в российский логистический контур.", cycle: "EP-LI-20260807-002", evidence: "EP-EVENT-20260807-001,004" },
  { id: "EP-EVENT-20260807-004", date: "07.08.2026", type: "CYCLE_CLOSED", title: "Передача второй партии на Ozon завершена", detail: "Оба дочерних цикла — отгрузка и приёмка — закрыты.", cycle: "EP-LR-20260807-001", evidence: "EP-EVENT-20260807-001..003" },
  { id: "EP-EVENT-20260807-003", date: "07.08.2026", type: "CYCLE_CLOSED", title: "Отгрузка 75 единиц подтверждена", detail: "43 единицы направлены в Москву, 32 — в Санкт-Петербург.", cycle: "EP-LR-20260807-002", evidence: "EP-EVENT-20260807-001" },
  { id: "EP-EVENT-20260807-002", date: "07.08.2026", type: "CYCLE_CLOSED", title: "Полная приёмка подтверждена", detail: "75 единиц приняты, после двух продаж на складах остаются 73 единицы новой партии.", cycle: "EP-LR-20260807-003", evidence: "EP-EVENT-20260807-001" },
  { id: "EP-EVENT-20260807-001", date: "07.08.2026", type: "STATE_OBSERVED", title: "Поставка и остатки сверены", detail: "Баланс новой партии подтверждён: 74 на складах − 1 старый остаток + 2 продажи = 75.", cycle: "EP-LR-20260807-003", evidence: "OZON_ACCEPTANCE_REPORT:SUPPLY-2000059753725" },
];

const operGroups = [
  { code: "A1–A2", name: "Спрос, ассортимент, каталог", count: 2, color: "orange" },
  { code: "I1–I5", name: "Закупка и импорт", count: 5, color: "orange" },
  { code: "L(I)1–L(I)4", name: "Международная логистика", count: 4, color: "teal" },
  { code: "L(R)1–L(R)7", name: "Логистика в России", count: 7, color: "teal" },
  { code: "S1–S3", name: "Продажи и возвраты", count: 3, color: "yellow" },
  { code: "E1–E4", name: "Экономические gates", count: 4, color: "magenta" },
  { code: "O1–O5", name: "Наблюдение", count: 5, color: "blue" },
  { code: "F1–F2", name: "Feedback", count: 2, color: "green" },
];

const values = [
  ["VAL-01", "Натуральные / целлюлозные материалы"], ["VAL-02", "Яркость"], ["VAL-03", "Стиль"],
  ["VAL-04", "Комфорт"], ["VAL-05", "Дух свободы"], ["VAL-06", "Атмосфера солнечного Таиланда"], ["VAL-07", "Йога, нью-эйдж, вайб"],
];

const projects = [
  { name: "Декларация 3Д", type: "REPAIR", state: "TERMINAL RESULT DEFINED", tone: "repair", purpose: "Восстановить compliance-контур для легального ввоза и торговли.", result: "Декларация получена, зарегистрирована, сохранена как evidence и принята OWNER_LPR.", gate: "Если декларация не активна, заказ новой партии и финансирование импорта со счёта проекта — HOLD.", refs: "EP-DP-DR-039 · EP-DP-DR-043" },
  { name: "Маркировка", type: "REPAIR", state: "ACTIVE_NOT_STABILIZED", tone: "repair", purpose: "Настроить и стабилизировать повторяемый marking workflow.", result: "ПО настроено; полный цикл выполнен без аварийных исправлений; результат принят и передан в L(R)2–L(R)4.", gate: "Кандидат ПО: «МойСклад». Передача в regular process запрещена до test pass.", refs: "EP-DP-DR-040 · EP-DP-DR-041" },
  { name: "Брендирование", type: "GROWTH", state: "PROJECT CARD DEFINED", tone: "growth", purpose: "Собрать целостное визуальное и смысловое представление бренда.", result: "Айдентика, логотип, упаковка, этикетки и карточки товара согласованы и приняты OWNER_LPR.", gate: "Рост уступает ремонту при конфликте ограниченного ресурса.", refs: "EP-DP-DR-042" },
];

function Evidence({ ids }: { ids: string[] | string }) {
  const list = Array.isArray(ids) ? ids : [ids];
  return <div className="evidence">{list.map((id) => <span key={id}>{id}</span>)}</div>;
}

function SectionHead({ index, kicker, title, copy }: { index: string; kicker: string; title: string; copy: string }) {
  return <header className="section-head"><div><p>{index} / {kicker}</p><h1>{title}</h1></div><p>{copy}</p></header>;
}

export default function Home() {
  const [view, setView] = useState<View>("state");
  const [cycleFilter, setCycleFilter] = useState<"ALL" | "OPEN" | "CLOSED">("ALL");
  const [eventFilter, setEventFilter] = useState<"ALL" | "STATE_OBSERVED" | "CYCLE_CLOSED">("ALL");
  const [closingCycle, setClosingCycle] = useState<ClosableCycle | null>(null);
  const [closableCycles, setClosableCycles] = useState<ClosableCycle[]>([]);
  const [closableState, setClosableState] = useState<"loading" | "ready" | "auth" | "unconfigured" | "error">("loading");
  const [closureStatus, setClosureStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [closureMessage, setClosureMessage] = useState("");
  const visibleCycles = useMemo(() => cycleFilter === "ALL" ? cycles : cycles.filter((c) => c.state === cycleFilter), [cycleFilter]);
  const visibleEvents = useMemo(() => eventFilter === "ALL" ? events : events.filter((e) => e.type === eventFilter), [eventFilter]);
  useEffect(() => {
    if (view !== "cycles") return;
    let active = true;
    fetch("/api/cycles/close", { headers: { accept: "application/json" } }).then(async (response) => {
      const body = await response.json().catch(() => ({}));
      if (!active) return;
      if (response.ok) { setClosableCycles(body.cycles || []); setClosableState("ready"); }
      else if (response.status === 401) setClosableState("auth");
      else if (body.error === "INTEGRATION_NOT_CONFIGURED") setClosableState("unconfigured");
      else setClosableState("error");
    });
    return () => { active = false; };
  }, [view]);
  const go = (next: View) => { setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submitClosure = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!closingCycle) return;
    const form = new FormData(event.currentTarget);
    setClosureStatus("submitting");
    setClosureMessage("");
    const response = await fetch("/api/cycles/close", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ cycleId: closingCycle.id, outcome: form.get("outcome"), comment: form.get("comment") }),
    });
    const body = await response.json().catch(() => ({}));
    if (response.status === 401 && body.signIn) { window.location.assign(body.signIn); return; }
    if (!response.ok) {
      const labels: Record<string, string> = {
        INTEGRATION_NOT_CONFIGURED: "Запись в GitHub ещё не активирована.",
        EVIDENCE_REQUIRED: "Этот цикл нельзя закрыть без свидетельства.",
        OPEN_CHILD_CYCLES: "Сначала закройте открытые подциклы.",
        CYCLE_NOT_OPEN: "Цикл уже закрыт или изменён.",
        FORBIDDEN: "У этого аккаунта нет права закрывать циклы.",
      };
      setClosureStatus("error");
      setClosureMessage(labels[body.error] || "GitHub не принял изменение. Обновите страницу и повторите попытку.");
      return;
    }
    setClosureStatus("done");
    setClosureMessage(`Цикл закрыт. Событие ${body.eventId} записано в GitHub.`);
    setClosableCycles((items) => items.filter((item) => item.id !== closingCycle.id));
  };

  return <main>
    <header className="masthead">
      <button className="brand" onClick={() => go("state")} aria-label="На главную Elephant Pants"><span>EP</span><strong>Elephant Pants<small>бизнес-проект и философская машина</small></strong></button>
      <nav aria-label="Основные разделы">{navigation.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => go(item.id)}><i>{item.index}</i>{item.label}</button>)}</nav>
      <div className="version">DATA · 30.08.2026</div>
    </header>

    <div className="page-shell">
      {view === "state" && <section>
        <SectionHead index="01" kicker="SYSTEM STATE" title="Состояние системы" copy="Текущее операционное состояние вычисляется из реестра циклов и событий Observation. Ручного параллельного статуса больше нет." />
        <div className="status-strip">
          <div><span>Система</span><strong>ACTIVE</strong></div><div><span>Физиология</span><strong>INTERNAL_QA</strong></div><div><span>Release</span><strong>NOT_RELEASED</strong></div><div><span>Циклы в интерфейсе</span><strong>2 OPEN · 9 CLOSED</strong></div>
        </div>
        <article className="focus-card">
          <div className="focus-kicker"><span>Текущий эксперимент</span><em>OPEN / RUNNING</em></div>
          <div className="focus-grid"><div><p className="mono">EP-S-20260830-001 · OZON_WEEKLY_SALES_REVIEW · OCCURRENCE 5</p><h2>Тест главного изображения chi-vintagerosemandala-pine</h2><p className="lead">Новая карточка уже размещена на Ozon. Экспериментальный SKU получил на базовой неделе 350 показов и 0 заказов; контрольный <b>chi-ethniclanna-mint</b> — 290 показов и 0 заказов.</p></div><div className="next-action"><span>Следующее обязательное действие</span><strong>Не менять остальные факторы</strong><p>Сохранять эластичный бустинг 15% и проверить показы, заказы и конверсию 6 сентября.</p><button onClick={() => go("cycles")}>Открыть цикл →</button></div></div>
          <Evidence ids={["EP-EVENT-20260830-002", "EP-EVENT-20260830-003"]} />
        </article>
        <aside className="sales-path-card" aria-labelledby="sales-path-title">
          <div>
            <span>Шпаргалка Ozon</span>
            <h2 id="sales-path-title">Где посмотреть статистику продаж за неделю</h2>
          </div>
          <ol aria-label="Путь к аналитике продаж Ozon за последние 7 дней">
            <li>Цены и акции</li>
            <li>Цены</li>
            <li>Аналитика по продажам</li>
            <li>Последние 7 дней</li>
          </ol>
        </aside>
        <div className="two-col">
          <section className="panel"><div className="panel-head"><span>Проектный контур</span><button onClick={() => go("projects")}>Все проекты →</button></div>{projects.map((p) => <div className="mini-row" key={p.name}><b>{p.name}</b><span>{p.type}</span><em>{p.state}</em></div>)}</section>
          <section className="panel"><div className="panel-head"><span>Последние изменения</span><button onClick={() => go("observation")}>Весь журнал →</button></div>{events.slice(0, 4).map((e) => <div className="event-mini" key={e.id}><span>{e.id}</span><b>{e.title}</b><em>{e.type}</em></div>)}</section>
        </div>
      </section>}

      {view === "cycles" && <section>
        <SectionHead index="02" kicker="CYCLE REGISTER" title="Циклы" copy="Одиннадцать операционных экземпляров отображаются в интерфейсе; два открыты. Иерархия, состояние и решение берутся из CYCLE_RECORD." />
        <section className="closure-console">
          <div><span>Закрытие без свидетельств</span><h2>Доступные циклы</h2><p>Показываются только OPEN-циклы с явной политикой NOT_REQUIRED и без открытых подциклов.</p></div>
          <div className="closable-list">
            {closableState === "loading" && <p>Проверяю GitHub…</p>}
            {closableState === "auth" && <a href="/signin-with-chatgpt?return_to=%2F">Войти с ChatGPT для управления →</a>}
            {closableState === "unconfigured" && <p>Запись в GitHub ещё не активирована.</p>}
            {closableState === "error" && <p>Не удалось получить актуальный список.</p>}
            {closableState === "ready" && closableCycles.length === 0 && <p>Сейчас нет циклов, которые разрешено закрыть без свидетельств.</p>}
            {closableCycles.map((cycle) => <article key={cycle.id}><div><span>{cycle.id} · {cycle.type}</span><strong>{cycle.title}</strong></div><button onClick={() => { setClosingCycle(cycle); setClosureStatus("idle"); setClosureMessage(""); }}>Закрыть</button></article>)}
          </div>
        </section>
        <div className="filter-row" role="group" aria-label="Фильтр циклов">{(["ALL", "OPEN", "CLOSED"] as const).map((f) => <button key={f} className={cycleFilter === f ? "selected" : ""} onClick={() => setCycleFilter(f)}>{f === "ALL" ? "Все · 11" : f === "OPEN" ? "Открытые · 2" : "Закрытые · 9"}</button>)}</div>
        <div className="cycle-list">{visibleCycles.map((cycle) => <article className={`cycle-card depth-${cycle.parent ? 1 : 0}`} key={cycle.id}>
          <div className="cycle-line"><span className={`state ${cycle.state.toLowerCase()}`}>{cycle.state}</span><span>{cycle.cls}</span><span>occurrence {cycle.occurrence}</span><span>{cycle.outcome}</span></div>
          <div className="cycle-body"><div><p className="mono">{cycle.id} · {cycle.type}</p><h2>{cycle.title}</h2>{cycle.parent && <p className="parent">↳ parent: {cycle.parent}</p>}</div><div><h3>Фактический результат</h3><p>{cycle.result}</p><h3>Текущий шаг</h3><p>{cycle.step}</p></div></div>
          <div className="decision">transition_decision: <b>{cycle.decision}</b></div><Evidence ids={cycle.evidence} />
          {cycle.state === "OPEN" && <div className="cycle-close-row"><span>Закрытие на сайте: {cycle.evidencePolicy === "NOT_REQUIRED" ? "доступно в панели выше" : "требуется свидетельство"}.</span></div>}
        </article>)}</div>
        <section className="protocol-band"><div><span>Активные протоколы</span><h2>Повторяемая процедура вместо ручного статуса</h2></div><div><b>EP-DP-LOGISTICS-CYCLE-PROTOCOL-1.0</b><p>Регистрация и закрытие логистического дерева.</p><b>EP-DP-OZON-WEEKLY-SALES-REVIEW-PROTOCOL-1.0</b><p>Скриншот → проверка → эксперимент → решение → closure event.</p></div></section>
      </section>}

      {view === "physiology" && <section>
        <SectionHead index="03" kicker="DOMAIN PHYSIOLOGY" title="Физиология" copy="EP-DP v0.2.1 опубликована как рабочий нормативный объект. Это INTERNAL_QA, а не выпущенный канон." />
        <div className="qa-banner"><div><span>EP-DP · 0.2.1</span><strong>INTERNAL_QA</strong></div><div><span>release_status</span><strong>NOT_RELEASED</strong></div><div><span>Oper lifecycle</span><strong>32 × CANDIDATE</strong></div><div><span>OpenItems</span><strong>30 RESOLVED · 4 OPEN</strong></div></div>
        <section className="system-map">
          <div className="system-core"><img src="/machine-diagram-blue.png" alt="Схема регулярного товарного оборота Elephant Pants" /><div className="route"><b>A1/A2</b><i>→</i><b>Import</b><i>→</i><b>Logistic.Import</b><i>→</i><b>Logistic.Russia</b><i>→</i><b>Sales</b></div></div>
          <div className="cross-control"><span>Поперечный орган</span><b>O. Observation</b><small>O1–O5 · классификация, запись, обновление, закрытие, обучение</small></div>
          <div className="economic-control"><span>Контроль</span><b>E1–E4</b><small>launch · price · cashflow · reserve</small></div>
          <div className="project-control"><span>Боковой контур</span><b>Repair / Growth</b><small>нестандартный дефект или новая способность</small></div>
        </section>
        <div className="phys-grid">
          <section><div className="subhead"><span>32 объекта</span><h2>Opers</h2></div><div className="oper-list">{operGroups.map((g) => <article key={g.code} className={`accent-${g.color}`}><strong>{g.code}</strong><b>{g.name}</b><span>{g.count} oper</span><em>CANDIDATE</em></article>)}</div></section>
          <section><div className="subhead"><span>Поперечный маршрут</span><h2>Observation</h2></div><ol className="observation-route"><li><b>O1</b><span>Определить цикл действия</span></li><li><b>O2</b><span>Зарегистрировать новый цикл</span></li><li><b>O3</b><span>Обновить состояние открытого</span></li><li><b>O4</b><span>Зафиксировать closure или reopening</span></li><li><b>O5</b><span>Изменить протокол по значимому evidence</span></li></ol></section>
        </div>
        <section className="values"><div className="subhead"><span>VALUE FILTER</span><h2>Семь ценностей</h2><p>Норматив выбора, а не автоматически подтверждённое свойство товара.</p></div><div>{values.map(([id, name]) => <article key={id}><span>{id}</span><b>{name}</b><em>CANDIDATE</em></article>)}</div></section>
      </section>}

      {view === "projects" && <section>
        <SectionHead index="04" kicker="PROJECT CONTOUR" title="Проекты" copy="Разовые циклы отделены от регулярной торговли. REPAIR получает приоритет над GROWTH при конфликте ограниченного ресурса; лимит WIP — два активных проекта." />
        <div className="project-list">{projects.map((p, index) => <article key={p.name} className={p.tone}><div className="project-no">0{index + 1}</div><div className="project-main"><div className="project-meta"><span>{p.type}</span><em>{p.state}</em></div><h2>{p.name}</h2><p className="lead">{p.purpose}</p><div className="project-grid"><div><h3>Terminal result</h3><p>{p.result}</p></div><div><h3>Gate / handoff</h3><p>{p.gate}</p></div></div><Evidence ids={p.refs} /></div></article>)}</div>
      </section>}

      {view === "observation" && <section>
        <SectionHead index="05" kicker="OBSERVATION LOG" title="Наблюдение" copy="Append-only журнал событий. Публичная проекция показывает описание и идентификатор evidence, но не раскрывает исходные файлы." />
        <div className="filter-row" role="group" aria-label="Фильтр событий">{(["ALL", "STATE_OBSERVED", "CYCLE_CLOSED"] as const).map((f) => <button key={f} className={eventFilter === f ? "selected" : ""} onClick={() => setEventFilter(f)}>{f === "ALL" ? `Все · ${events.length}` : f}</button>)}</div>
        <div className="timeline">{visibleEvents.map((e) => <article key={e.id}><div className="time-mark"><span>{e.date}</span><i /></div><div><div className="event-meta"><span>{e.type}</span><em>{e.cycle}</em></div><p className="mono">{e.id}</p><h2>{e.title}</h2><p>{e.detail}</p><div className="evidence-description"><span>Evidence</span><b>{e.evidence}</b></div></div></article>)}</div>
      </section>}

      {view === "strategy" && <section>
        <SectionHead index="06" kicker="STRATEGY" title="Стратегия" copy="Дорожная карта показывает направление и условия перехода. Текущее операционное состояние остаётся в реестре циклов." />
        <div className="roadmap">
          <article className="current"><span>Сейчас</span><div><em>ACTIVE HORIZON</em><h2>Оптимизация конверсии второй партии</h2><p>После теста эластичного бустинга начат тест главного изображения chi-vintagerosemandala-pine. Продвижение сохраняется неизменным, чтобы изолировать влияние карточки.</p><ul><li>Проверить результат 6 сентября</li><li>Сравнить экспериментальный SKU с контролем chi-ethniclanna-mint</li><li>Сохранять цену и остальные элементы карточки без изменений</li></ul></div></article>
          <article><span>До 6 месяцев</span><div><em>NEXT</em><h2>Рабочие правила повторения</h2><p>Подтвердить цену, ассортимент, маркировку, упаковку и регулярную логистику на сопоставимых данных.</p></div></article>
          <article><span>Около 2 лет</span><div><em>DIRECTION</em><h2>Каналы и устойчивая поставка</h2><p>Развивать каналы продаж и устойчивость поставки после восстановления детального плана и критериев перехода.</p></div></article>
          <article><span>2031–2033</span><div><em>LONG-TERM</em><h2>Федеральная многоканальная система</h2><p>Маркетплейсы, DTC, опт и региональные партнёры: 20 000+ пар в год, 100+ оптовых клиентов и устойчивый бренд категории.</p></div></article>
        </div>
      </section>}

      {view === "service" && <section>
        <SectionHead index="00" kicker="SERVICE" title="Служебный раздел" copy="Метаданные публичной проекции, история версий и состояние связи с источником истины." />
        <div className="service-grid"><article><span>Текущая версия сайта</span><strong>19</strong><p>Актуализированы недельные sales-циклы и текущий эксперимент карточки.</p></article><article><span>Доменная физиология</span><strong>EP-DP v0.2.1</strong><p>INTERNAL_QA / NOT_RELEASED</p></article><article><span>Данные обновлены</span><strong>30 августа 2026</strong><p>Текущий sales-тест запущен на Ozon.</p></article><article><span>Синхронизация</span><strong>IN SYNC</strong><p>Интерфейс актуализирован по каноническим records текущего sales-контура.</p></article></div>
        <div className="history"><h2>История сайта</h2><article><time>30.08.2026</time><div><b>v19 · Sales experiments</b><p>Добавлены результат теста эластичного бустинга и текущий тест новой главной карточки chi-vintagerosemandala-pine.</p></div></article><article><time>08.08.2026</time><div><b>v18 · Доменная миграция</b><p>Состояние, циклы, физиология, проекты и Observation заменили старые ручные страницы и статусы. Страницы «органов» удалены.</p></div></article><article><time>05–07.08.2026</time><div><b>v13–17 · Философская машина</b><p>Добавлена и отредактирована упрощённая схема регулярного товарного оборота.</p></div></article><article><time>22.07.2026</time><div><b>Первая публичная структура</b><p>Дорожная карта, текущий шаг, новости и страницы функциональных областей.</p></div></article></div>
        <a className="repo-link" href="https://github.com/valerol/ep_dashboard" target="_blank" rel="noreferrer">Открыть valerol/ep_dashboard →</a>
      </section>}
    </div>

    {closingCycle && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setClosingCycle(null)}>
      <section className="closure-modal" role="dialog" aria-modal="true" aria-labelledby="closure-title">
        <button className="modal-close" onClick={() => setClosingCycle(null)} aria-label="Закрыть окно">×</button>
        <p className="mono">{closingCycle.id}</p>
        <h2 id="closure-title">Закрыть цикл</h2>
        <p>{closingCycle.title}</p>
        <form onSubmit={submitClosure}>
          <label>Результат<select name="outcome" defaultValue="ACHIEVED" required><option value="ACHIEVED">ACHIEVED</option><option value="PARTIAL">PARTIAL</option><option value="FAILED">FAILED</option><option value="CANCELLED">CANCELLED</option></select></label>
          <label>Комментарий<textarea name="comment" minLength={3} maxLength={1000} required placeholder="Что получено и почему цикл можно закрыть" /></label>
          <button type="submit" disabled={closureStatus === "submitting"}>{closureStatus === "submitting" ? "Записываю…" : "Подтвердить закрытие"}</button>
        </form>
        {closureMessage && <p className={`closure-message ${closureStatus}`}>{closureMessage}</p>}
      </section>
    </div>}

    <footer><div><span>EP</span><p>Elephant Pants · business system</p></div><p>EP-DP v0.2.1 · INTERNAL_QA / NOT_RELEASED</p><button onClick={() => go("service")}>Служебный раздел →</button></footer>
  </main>;
}
