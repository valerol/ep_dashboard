"use client";

import { useMemo, useState } from "react";
import currentStepData from "@/data/current-step.json";
import machineData from "@/data/machine.json";
import navigationData from "@/data/navigation.json";
import newsData from "@/data/news.json";
import organsData from "@/data/organs.json";
import roadmapData from "@/data/roadmap.json";
import siteChangelogData from "@/data/site-changelog.json";
import sourceRegistryData from "@/data/source-registry.json";

type Tab = "roadmap" | "current" | "news" | "machine" | "organ" | "history";
type NewsType = "action" | "oper" | "cycle_closed";
type Organ = { id: string; name: string; role: string };
type RoadmapStage = { id: string; horizon: string; title: string; status: string; confirmation: string; current: boolean; goal: string; results: string[]; transition: string[]; organs: string[]; sourceIds: string[] };
type ProjectTask = { id: string; title: string; status: string; org: string | null; related: string[]; evidence: string; sourceIds: string[] };
type NewsItem = { id: string; date: string; title: string; summary: string; type: NewsType; org: string | null; task?: string; sourceIds: string[] };
type SiteChange = { date: string; category: string; title: string; changes: string[]; note: string; sourceIds: string[] };

const tabs = navigationData as { id: Tab; label: string }[];
const organs = organsData as Organ[];
const stages = roadmapData as RoadmapStage[];
const tasks = currentStepData as ProjectTask[];
const news = newsData as NewsItem[];
const siteChangelog = siteChangelogData as SiteChange[];
const machineOpers = machineData.opers;
const oneOffCycles = machineData.oneOffCycles;
const sourceSummaryGroups = sourceRegistryData.summaryGroups;

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
          <span className="edition">МАКЕТ · 06.08.2026</span>
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
            <div className="opers-table"><div className="opers-row opers-header"><span>Цикл</span><span>Узел</span><span>Opers</span><span>Инструкции</span></div>{machineOpers.map((row) => <div key={`${row.node}-${row.cycle}`} className={`opers-row row-${row.cycle}`}><strong>{row.title}</strong><b>{row.node}</b><div className="oper-pills">{row.opers.map((oper) => <span key={oper}>{oper}</span>)}</div><small>TODO · для каждого oper</small></div>)}</div>
          </section>
          <section className="oneoff-section" id="oneoff-cycles"><div className="machine-section-head"><span>02 / разовые циклы</span><div><h2>Проекты, которые меняют состояние машины</h2><p>В отличие от постоянного оборота Economics, каждый проект имеет конечный результат и закрывается после прохождения своих стадий.</p></div></div><div className="oneoff-grid">{oneOffCycles.map((cycle) => <article key={cycle.id}><span>{cycle.id}</span><h3>{cycle.title}</h3><p>{cycle.description}</p><div><small>цель</small><small>бюджет</small><small>стадии</small><small>отчёт</small><small>результат</small></div></article>)}</div></section>
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
          {siteChangelog.map((entry) => <article className="change-entry" key={`${entry.date}-${entry.title}`}><div><time>{entry.date}</time><span>{entry.category}</span></div><h3>{entry.title}</h3><ul>{entry.changes.map((change) => <li key={change}>{change}</li>)}</ul><p className="change-note">{entry.note}</p></article>)}
          <article className="source-register"><h3>Реестр источников и пробелов</h3><div className="source-grid">{sourceSummaryGroups.map((group) => <div key={group.title}><h4>{group.title}</h4><p>{group.text}</p></div>)}</div></article>
        </div>}
      </section>

      <footer><span>Elephant Pants</span><p>Рабочая история проекта · только подтверждённые сведения</p><button onClick={() => setTab("history")}>Метод и источники</button></footer>
    </main>
  );
}
