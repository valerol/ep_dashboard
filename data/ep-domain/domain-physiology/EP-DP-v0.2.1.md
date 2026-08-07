---
title: "EP-DP: доменная физиология Elephant Pants"
project: "Elephant Pants"
protocol: "BOIS"
version: "0.2.1"
date: "2026-08-07"
status: "INTERNAL_QA"
release_status: "NOT_RELEASED"
derived_from: "EP-DP v0.1 / sha256:d172938068ab715cfc11ef65acb1be9c4829987aed3318902692b0c2d2de6e99"
baseline_state: "IMMUTABLE_CANDIDATE_SNAPSHOT"
working_target: "INTERNAL_QA"
release_target: "DEFERRED"
canonical_repository_artifact: "valerol/ep_dashboard@main:data/ep-domain/domain-physiology/EP-DP-v0.2.1.md"
repository_topology_snapshot_ref: "data/ep-domain/repository-map.yaml"
canon_reference:
  mode: "PINNED_ARTIFACT"
  sha256: "0b1c7b46cd084679ed08c4babd13e35c686250c06d1fd79f1a8d26140685304a"
  supplied_label: "BOIS Base Core 2.44"
  observed_footer: "BOIS 2.43"
  label_resolution: "UNRESOLVED"
sources:
  - "Pinned BOIS Base Core artifact sha256:0b1c7b46cd084679ed08c4babd13e35c686250c06d1fd79f1a8d26140685304a — senior source for BOIS terms and object lifecycles; supplied label 2.44, observed footer 2.43"
  - "Elephant Pants — карта opers по протоколу BOIS, v0.1"
  - "EP-OSU: структура, риски, нормы, v0.2"
  - "Ценности компании, заявлены 2026-08-06"
  - "Орган O. Observation и пять opers, заданы 2026-08-06"
  - "Решения OWNER_LPR EP-DP-DR-001–060, 2026-08-06–2026-08-07"
  - "EP-DP-LOGISTICS-CYCLE-PROTOCOL 1.0, канонизирован 2026-08-07"
  - "Решение OWNER_LPR EP-DP-DR-061 о взаимном восстановлении физиологии и репозитория, 2026-08-07"
---

# EP-DP / ДОМЕННАЯ ФИЗИОЛОГИЯ · V0.2.1 · INTERNAL_QA

## 0 / PROTOCOL

```yaml
object: Elephant_Pants
artifact: DOMAIN_PHYSIOLOGY
analysis_scope:
  - DOMAIN_BOUNDARY
  - VALUES
  - FUNCTIONAL_ORGANS
  - OPERS
  - OBSERVATION
  - FLOWS
  - INTERFACES
  - CONTROL
  - REPAIR
  - GROWTH

entity_types:
  - SYSTEM
  - CYCLE_CLASS
  - CYCLE_INSTANCE
  - ORGAN
  - CONTROL_FUNCTION
  - PROJECT_CONTOUR

knowledge_status: [SOURCE_STATED, INFERRED, REQUIRED]
value_status: [DECLARED]
claim_state: [DRAFT, BLOCKED_PENDING_EVIDENCE, APPROVED]
activation_state: [ACTIVE, INACTIVE]
legacy_oper_status_from_EP_OPERS: [READY, HOLD, TODO]
legacy_transition_status_from_EP_OSU: [READY, HOLD, STOP, REPAIR]
canon_oper_states: [CANDIDATE, OBSERVED, VALIDATED, SUPERSEDED]
canon_physiology_states: [CANDIDATE, INTERNAL_QA, RELEASED, HOLD, SUPERSEDED]
debt_resolution_state: [OPEN, RESOLVED]
transition_decision: [READY, HOLD, STOP]
remediation_state: [NONE, REPAIR_ACTIVE, RECONTROL_PENDING]
project_terminal_state: [CLOSED, TRANSFERRED_TO_REGULAR_PROCESS]
question_resolution_state: [OPEN, RESOLVED]

axioms:
  - NO_EVIDENCE -> NOT_CONFIRMED
  - REQUIRED_PREVIOUS_STATE_NOT_CONFIRMED -> HOLD
  - CRITICAL_DEFECT_DETECTED -> STOP
  - REPAIR_COMPLETED -> RECONTROL
  - IF_RESOURCE_CONFLICT_OR_CRITICAL_REPAIR_OPEN -> REPAIR_FIRST
  - EXTERNAL_FUNCTION != EP_SUBDIVISION
  - FUNCTION != DEPARTMENT
  - VALUE_CLAIM_REQUIRING_FACT -> EVIDENCE_REQUIRED
```

### 0.1 / SOURCE.STATUS

- `SOURCE_STATED` — прямо зафиксировано хотя бы в одном из источников или в явном дополнении пользователя.
- `INFERRED` — следует из соединения источников, но не является их буквальной формулировкой.
- `REQUIRED` — нормативно необходимо по EP-OSU, но ещё не подтверждено как реализованное.
- `DECLARED` — заявленная компанией ценность; это норматив выбора, а не автоматически подтверждённое свойство товара.
- `CANDIDATE` — начальное каноническое lifecycle state объекта `Oper`; переход к `OBSERVED` требует полноты обязательных полей, разрешённых ссылок и авторизованного перехода.
- `OPEN` — локальное состояние незакрытого долга, вопроса или `CYCLE_RECORD`. Оно не является lifecycle state объекта `Oper`, не подменяет канонический `OBJECT-CYCLE` и не должно смешиваться с `transition_decision: HOLD`.

### 0.2 / STATE.NORMALIZATION

`SOURCE_STATED` по pinned BOIS Base Core artifact с SHA-256, указанным в front matter, + нормализация старых EP-документов:

Карта EP-OPERS использует `READY`, `HOLD` и `TODO` в одном поле, но актуальный канон задаёт для объекта `Oper` другой lifecycle:

```yaml
CANON_OPER_LIFECYCLE:
  CANDIDATE -> OBSERVED -> VALIDATED -> SUPERSEDED

CANON_PHYSIOLOGY_TRANSITIONS:
  - CANDIDATE -> INTERNAL_QA
  - INTERNAL_QA -> RELEASED
  - INTERNAL_QA -> HOLD
  - RELEASED -> SUPERSEDED

CANON_TRANSITION_TO_OBSERVED_REQUIRES:
  - required_fields_complete
  - references_resolved
  - transition_authorized

LEGACY_TODO_MAPPING:
  normalization_scope: LOCAL_EP_DP
  oper_lifecycle_state: CANDIDATE
  canon_hold_codes: [HOLD-OBJECT-INCOMPLETE]
  debt_resolution_state: OPEN

transition_decision:
  READY: входы подтверждены; переход разрешён
  HOLD: обязательная предпосылка или внешний результат отсутствует
  STOP: во время или после исполнения обнаружен критический дефект

remediation_state:
  NONE: восстановительное действие не выполняется
  REPAIR_ACTIVE: дефект локализуется и устраняется
  RECONTROL_PENDING: исправление завершено; требуется повторный контроль
```

EP-OSU перечисляет `REPAIR` среди transition statuses. В синтезе `REPAIR` нормализован как отдельное состояние восстановления, чтобы не смешивать решение остановить переход с последующим исправлением.

`HOLD-OBJECT-INCOMPLETE` и `HOLD-OBJECT-REFERENCE-UNRESOLVED` — канонические hold-коды объекта, а не состояния lifecycle `Oper`. Отдельно `transition_decision: HOLD` относится к конкретному доменному исполнению. Состояние `HOLD` в lifecycle объекта `Physiology` — ещё одна, самостоятельная ось.

`TODO` не является каноническим lifecycle status. В старом EP-OPERS это локальная метка незакрытой процедуры или evidence. EP-DP v0.1 ввёл локальную нормализацию как `Oper.lifecycle_state: CANDIDATE`, применимый канонический hold-код `HOLD-OBJECT-INCOMPLETE` и открытый элемент долга; v0.2 сохраняет эту нормализацию и назначает стабильные OpenItem IDs. Pinned BOIS artifact не определяет `TODO` и не задаёт локальную схему долга EP-DP.

`CANDIDATE` относится к состоянию спецификации `Oper` как канонического объекта. Оно не утверждает, что соответствующее хозяйственное действие никогда не выполнялось в реальности; фактическое исполнение и lifecycle спецификации — разные оси.

| Старое поле EP-OPERS | Нормализация EP-DP, введена в v0.1 и сохранена в v0.2 |
|---|---|
| `READY` | Не повышает lifecycle объекта; oper остаётся `CANDIDATE`. Для конкретного исполнения может означать `transition_decision: READY`, если подтверждены входы и полномочие. |
| `HOLD` | Не меняет lifecycle объекта; для конкретного исполнения нормализуется как `transition_decision: HOLD` и соответствующий guard. |
| `TODO` | `Oper.lifecycle_state: CANDIDATE` + `HOLD-OBJECT-INCOMPLETE` + открытый `residue` в локальной нормализации EP-DP. |

### 0.3 / ARTIFACT.BOUNDARY

EP-DP соединяет источники на уровне доменной модели, но не отменяет их детальные реестры. Полные поля `S0`, `Trigger`, `D`, `S1`, `Evidence`, `Next` каждого oper остаются нормативными в EP-OPERS; детальные определения норм и рисков остаются нормативными в EP-OSU. Crosswalk ниже показывает их связи, а не сокращает исходные контракты.

```yaml
SOURCE_PRECEDENCE:
  PINNED_BOIS_BASE_CORE_ARTIFACT:
    sha256: 0b1c7b46cd084679ed08c4babd13e35c686250c06d1fd79f1a8d26140685304a
    senior_for: [TERMS, OBJECT_SCHEMAS, LIFECYCLES, CANONICAL_STATUS]
  EP_OPERS_V0_1:
    senior_for: [DOMAIN_OPER_CONTENT, LEGACY_LOCAL_STATUS]
  EP_OSU_V0_2:
    senior_for: [DOMAIN_ORGANIZATION, DOMAIN_RISKS, DOMAIN_NORMS]
  USER_ADDITIONS:
    senior_for: [COMPANY_VALUES, OBSERVATION_ORGAN_INTENT]
  OWNER_LPR_DECISIONS:
    records: EP-DP-DR-001..EP-DP-DR-060
    senior_for: [EXPLICIT_CURRENT_DOMAIN_DECISIONS_WITHIN_THEIR_RECORDED_SCOPE]
    precedence_over_older_domain_description_if_explicitly_superseded: true
    silent_override: false
```

```yaml
BOIS_CANON_PROVENANCE:
  supplied_filename: 2.44_BOIS_Base_Core_Canon_EN.pdf
  pdf_title_metadata: BOIS-2.44-BASE
  cover_status: EXTERNAL_EDITORIAL_REVIEW_CANDIDATE
  sha256: 0b1c7b46cd084679ed08c4babd13e35c686250c06d1fd79f1a8d26140685304a
  observed_internal_footer: BOIS 2.43
  version_label_resolution: UNRESOLVED
  compatibility_reference_mode: PINNED_ARTIFACT
  compatibility_target: sha256:0b1c7b46cd084679ed08c4babd13e35c686250c06d1fd79f1a8d26140685304a
  named_2_44_compatibility_claim: BLOCKED_UNTIL_LABEL_RESOLVED
  use_in_EP_DP: USER_AUTHORIZED_PINNED_ARTIFACT_WITH_MISMATCH_PRESERVED
```

Имя файла и PDF metadata указывают `2.44`, тогда как футеры проверенных страниц показывают `2.43`. Решением `EP-DP-DR-001` от 2026-08-06 объект совместимости локально закреплён за точным SHA-256 артефакта. Это снимает неоднозначность объекта проверки для входа в `INTERNAL_QA`, но не разрешает конфликт меток и не допускает безусловное утверждение `BOIS 2.44 compatible`.

### 0.4 / CANON.ALIGNMENT

Норма `N-GEN-073 / Natural-language extraction remains candidate` прямо требует оставлять определения, органы, процедуры и tests, извлечённые из естественно-языковой доктрины, кандидатами до снятия неоднозначностей, определения модальности, владельца, scope, конфликтов, tests и repair. Поэтому ни наличие подробного текста, ни прежняя метка `READY` сами по себе не повышают объект до `OBSERVED`.

Канонический объект `Oper` требует:

```yaml
CANON_OPER_REQUIRED_FIELDS:
  - oper_id
  - machine_ref
  - before_state
  - trigger
  - evidence_refs
  - agency_ref
  - value_or_risk_gate
  - transition_ref
  - after_state
  - memory_write_refs
  - cost
  - micro_closure
  - residue
  - lifecycle_state
```

| Canon field | Покрытие в EP-DP v0.2 candidate | Состояние |
|---|---|---|
| `oper_id` | `A*`, `I*`, `L*`, `S*`, `E*`, `O*` | Есть |
| `machine_ref` | `EP-MACHINE-001` назначен всем 32 opers решением `EP-DP-DR-045` | Есть |
| `before_state / after_state` | `S0 / S1` нормализованы как `before_state / after_state` для всех 32 opers решением `EP-DP-DR-046`; множественные условия = `AND` | Есть |
| `trigger` | Есть у 22 source opers, `A1–A2`, `S3`, `F1–F2` и `O1–O5` | Есть |
| `evidence_refs` | Формат устойчивых ссылок определён `EP-DP-DR-048`: GitHub object/path, внешний document/system object либо сохранённое OWNER_LPR confirmation; конкретные refs инстанцируются при исполнении oper | Схема определена; runtime refs появляются по факту |
| `agency_ref` | `EP-ACTOR-OWNER-LPR` назначен всем 32 opers решением `EP-DP-DR-047`; внешние субъекты остаются `external_participant` | Есть |
| `value_or_risk_gate` | `EP-DP-DR-054`: oper-specific mapping на утверждённые gates; если специфический gate неприменим — `N/A`; несколько gates = `ALL_MUST_PASS` | Есть |
| `transition_ref` | Для всех 32 opers назначен typed ref `EP-TR-{OPER_ID}` решением `EP-DP-DR-049`; переход связывает `OPER.S0 → OPER.S1`, локальные `READY/HOLD/STOP` остаются runtime guards oper | Есть |
| `memory_write_refs` | `EP-DP-DR-050`: если oper меняет сохраняемое доменное состояние, `memory_write_refs` указывает на соответствующий entity/event object в GitHub source of truth; если сохраняемого изменения нет — `N/A` | Правило назначено; конкретные instance refs создаются при исполнении |
| `cost` | `EP-DP-DR-051`: прямая стоимость oper = `ESTIMATED` до факта и `ACTUAL` после факта; если отдельной прямой стоимости нет — `N/A`; время `OWNER_LPR` не монетизируется в поле `cost` | Схема определена; runtime amount появляется по факту |
| `micro_closure` | `EP-DP-DR-052`: `S1` достигнуто + evidence принято + required memory write выполнен + blocking deviation отсутствует/исправлен | Схема определена |
| `residue` | `EP-DP-DR-053`: `[]` при отсутствии остатка; любой остаток явно классифицируется и связывается с `OpenItem`, следующим oper или проектом; blocking residue запрещает `micro_closure` | Схема определена; runtime residue создаётся по факту |
| `lifecycle_state` | Для всех 32 opers установлен `CANDIDATE` | Есть |

```yaml
PHYSIOLOGY_OBJECT:
  physiology_id: EP-DP-001
  name: Elephant Pants Domain Physiology
  machine_id: EP-MACHINE-001
  version: 0.2
  generation:
    baseline: EP-DP-v0.1
    current: EP-DP-v0.2
    parent_sha256: d172938068ab715cfc11ef65acb1be9c4829987aed3318902692b0c2d2de6e99
    derivation: OWNER_DECISIONS + NORMALIZATION + OPENITEM_RESOLUTION
  baseline_ref: sha256:d172938068ab715cfc11ef65acb1be9c4829987aed3318902692b0c2d2de6e99
  canon:
    mode: PINNED_ARTIFACT
    sha256: 0b1c7b46cd084679ed08c4babd13e35c686250c06d1fd79f1a8d26140685304a
    supplied_label: BOIS Base Core 2.44
    observed_footer: BOIS 2.43
    label_resolution: UNRESOLVED
  release_status: NOT_RELEASED
  lifecycle_state: INTERNAL_QA
  candidate_to_internal_QA_blocked_by: []
  schemas:
    registry:
      OPER_OBJECT: §0.4
      PHYSIOLOGY_OBJECT: §0.4
      CYCLE_RECORD: §6.2
      INTERFACE: §8
      PROJECT: §10
      OPENITEM: §15
    duplication_policy: REFERENCE_EXISTING_DEFINITION
  compatibility:
    targets:
      - PINNED_BOIS_CANON
      - EP_OPERS_V0_1
      - EP_OSU_V0_2
      - USER_ADDITIONS
    precedence:
      BOIS: SENIOR_FOR_TERMS_SCHEMAS_LIFECYCLE
      DOMAIN_SOURCES: SENIOR_FOR_DOMAIN_CONTENT
    unresolved_conflict: HOLD_OR_OPENITEM
    silent_override: FORBIDDEN
    status: CONFIRMED_FOR_PINNED_ARTIFACT_SCOPE
    verification_ref: EP-DP-QA-001
    named_2_44_compatibility_claim: BLOCKED_UNTIL_CANON_LABEL_RESOLVED
  tests:
    registry:
      - SCHEMA_COMPLETENESS
      - REFERENCE_RESOLUTION
      - INTERFACE_CONTRACT_COMPLETENESS
      - OPER_TRANSITION_CONSISTENCY
      - CYCLE_OBSERVATION_FLOW
      - ECONOMIC_GATES
      - PROJECT_EXIT_HANDOFF
      - COMPATIBILITY
    status: PARTIALLY_EXECUTED
    execution_stage: INTERNAL_QA
    qa_run_ref: EP-DP-QA-001
    static_results: 7_PASS_1_DESIGN_PASS_RUNTIME_PENDING
  known_incomplete_fields: []
  working_target: RELEASE_READINESS
  next_canon_state: RELEASED
```

Канонический объект `Physiology` требует поля `physiology_id`, `name`, `version`, `generation`, `canon`, `organs`, `norms`, `schemas`, `interfaces`, `lifecycle`, `compatibility`, `tests`, `release_status`, `lifecycle_state`. Definition-level объект `EP-DP-001 / v0.2` завершён `EP-DP-DR-059`; переход `CANDIDATE → INTERNAL_QA` отдельно авторизован `OWNER_LPR` в `EP-DP-DR-060`. `EP-DP-QA-001` подтверждает совместимость в scope точного pinned SHA и выполняет статическую часть test registry; runtime/real-batch проверки остаются release blockers.

### 0.5 / BASELINE.AND.WORKING.TARGET

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-001
  decided_at: 2026-08-06
  authority: OWNER_LPR
  decision:
    baseline:
      version: 0.1
      sha256: d172938068ab715cfc11ef65acb1be9c4829987aed3318902692b0c2d2de6e99
      state: IMMUTABLE_CANDIDATE_SNAPSHOT
    working_version:
      version: 0.2
      lifecycle_state: CANDIDATE
      working_target: INTERNAL_QA
      release_target: DEFERRED
    canon_reference:
      mode: PINNED_ARTIFACT
      sha256: 0b1c7b46cd084679ed08c4babd13e35c686250c06d1fd79f1a8d26140685304a
      label_conflict: 2.44_METADATA_VS_2.43_FOOTER
      conflict_state: PRESERVED_UNRESOLVED
    transition_rule:
      debt_resolution_does_not_auto_promote_oper: true
      every_lifecycle_transition_requires_separate_authorization: true
  authorizes:
    - CREATE_EP_DP_V0_2_WORKING_CANDIDATE
    - CREATE_STABLE_OPENITEM_REGISTER
    - USE_PINNED_CANON_ARTIFACT_AS_QA_TARGET
  does_not_authorize:
    - PHYSIOLOGY_CANDIDATE_TO_INTERNAL_QA
    - OPER_CANDIDATE_TO_OBSERVED
    - OPER_OBSERVED_TO_VALIDATED
    - PHYSIOLOGY_INTERNAL_QA_TO_RELEASED
```

`EP-DP-DR-001` закрывает выбор baseline, рабочей версии, ближней цели и объекта проверки. Он не подтверждает полноту `v0.2`, прохождение QA, фактическое исполнение opers или release.

### 0.6 / CATALOG.BOUNDARY.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-002
  decided_at: 2026-08-06
  authority: OWNER_LPR
  resolves: EPDP-OI-001
  external_inputs:
    SUPPLIER_OFFER:
      meaning: каталог, наличие, модели, принты и условия ChinRada
    MARKET_DEMAND_SIGNALS:
      meaning: продажи, поисковый спрос, отзывы, возвраты и наблюдения рынка
  internal_transformation:
    owner: OWNER_LPR
    action: FORM_EP_ASSORTMENT_DECISION_FROM_EXTERNAL_INPUTS
    applicable_gate_concepts: [VALUE_GATES, ECONOMIC_GATES]
    gate_definition_and_activation: OUT_OF_SCOPE_AND_OPEN_IN_EPDP_OI_006_TO_009
  internal_controlled_entity:
    EP_ASSORTMENT_REGISTER:
      meaning: утверждённый состав ассортимента Elephant Pants
      source_of_truth: TO_BE_ASSIGNED_IN_EPDP_OI_019
  external_publication_interface:
    OZON_CATALOG:
      platform_owner: OZON
      content_and_assortment_decision_owner: OWNER_LPR
      meaning: опубликованная проекция EP_ASSORTMENT_REGISTER
  boundary_invariants:
    - SUPPLIER_OFFER != EP_ASSORTMENT_REGISTER
    - EP_ASSORTMENT_REGISTER != OZON_CATALOG
    - OZON_PLATFORM_OWNERSHIP != EP_CONTENT_DECISION_OWNERSHIP
  closure_evidence_refs:
    - EP-DP-DR-002
    - EP-DP_v0.2_§3.4
    - EP-DP_v0.2_§7.3
  does_not_resolve_scope: ALL_OTHER_OPENITEMS
  does_not_resolve_examples:
    - EPDP-OI-002
    - EPDP-OI-006
    - EPDP-OI-007
    - EPDP-OI-008
    - EPDP-OI-009
    - EPDP-OI-019
```

Решение определяет границу объектов и полномочия, но не создаёт opers формирования ассортимента и карточек, не активирует value gates и не назначает технический source of truth.

### 0.7 / TRADE.CLASSIFICATION.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-003
  decided_at: 2026-08-06
  authority: OWNER_LPR
  resolves: EPDP-OI-005
  TRADE_CLASSIFICATION:
    scope: EP_DOMAIN_PHYSIOLOGY_FUNCTIONAL_MODEL
    SYSTEM_ACTIVITY: TRADE
    PRODUCTION_MODEL: EXTERNAL_INDEPENDENT_MANUFACTURING
    EP_ROLE: ASSORTMENT_BRAND_AND_COMMERCE_OPERATOR
    OWN_PRODUCTION: false
    PRODUCING_SELLING:
      term_status: REJECTED_AS_AMBIGUOUS
      replacement_terms: [TRADE, EXTERNAL_INDEPENDENT_MANUFACTURING]
    LEGAL_IMPORTER_STATUS: NOT_DEFINED_BY_THIS_DECISION
  invariants:
    - INDEPENDENT_FACTORY != OWN_PRODUCTION
    - EP_ROLE != MANUFACTURER_ROLE
    - FUNCTIONAL_CLASSIFICATION != LEGAL_STATUS
  closure_evidence_refs:
    - EP-DP-DR-003
    - EP-DP_v0.2_§3.3
  does_not_resolve_scope: ALL_OTHER_OPENITEMS
  does_not_determine:
    - LEGAL_IMPORTER_STATUS
    - CUSTOMS_STATUS
    - OKVED_OR_STATISTICAL_CLASSIFICATION
    - TAX_REGIME
    - COMPLIANCE_EVIDENCE
  lifecycle_effect: NONE
```

Решение классифицирует функциональную модель домена: Elephant Pants управляет ассортиментом, брендом и торговлей, а production function исполняет внешняя независимая фабрика. Оно не устанавливает юридический статус и не повышает lifecycle физиологии или opers.

### 0.8 / RESPONSIBILITY.AND.AUTHORITY.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-004
  decided_at: 2026-08-06
  authority: OWNER_LPR
  resolves: EPDP-OI-011
  scope: CURRENT_SINGLE_NODE_RESPONSIBILITY_AND_AUTHORITY
  role_semantics:
    RESPONSIBLE: несёт внутреннюю ответственность за terminal result oper
    INTERNAL_EXECUTOR: выполняет внутреннюю часть oper и интегрирует внешний результат
    CONTROL_OWNER: принимает решение CONFIRM_OR_HOLD_OR_STOP по результату и evidence
  current_assignment:
    applies_to: [I1-I5, L(I)1-L(I)4, L(R)1-L(R)7, S1-S2, E1-E4, O1-O5]
    RESPONSIBLE: OWNER_LPR
    INTERNAL_EXECUTOR: OWNER_LPR
    CONTROL_OWNER: OWNER_LPR
  marking_execution:
    L(R)2: OWNER_LPR
    L(R)3: OWNER_LPR
    L(R)4: OWNER_LPR
    EXT-04_role: EXTERNAL_INFRASTRUCTURE_PARTICIPANT
  observation_assignment:
    O1-O5_executor: OWNER_LPR
    O5_protocol_change_authority: OWNER_LPR
    protocol_change_without_OWNER_LPR_or_explicit_delegation: DENY
  delegation_state:
    active_delegations: []
    OPERATION_EXECUTOR: INACTIVE
  external_function_rule:
    external_functions_are: SERVICE_OR_INTERFACE_PARTICIPANTS
    external_functions_are_not: [EP_RESPONSIBLE, EP_CONTROL_OWNER, EP_SUBDIVISION]
    OWNER_LPR_duties: [SET_TASK_OR_REQUEST, ACCEPT_TERMINAL_RESULT, RECORD_EVIDENCE, DECIDE_CONFIRM_HOLD_STOP]
  control_boundary:
    CONTROL_OWNER_ASSIGNED: true
    INDEPENDENT_CONTROL_SATISFIED: false
    independent_checker_or_time_separation: UNSPECIFIED
    openitem: EPDP-OI-012
  closure_evidence_refs:
    - EP-DP-DR-004
    - EP-DP_v0.2_§4.2
    - EP-DP_v0.2_§6.1
    - EP-DP_v0.2_§6.7
  does_not_resolve_scope: ALL_OTHER_OPENITEMS
  does_not_resolve_examples: [EPDP-OI-004, EPDP-OI-018, EPDP-OI-020]
  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

Роли ответственности, исполнения и контроля остаются различимыми, даже когда все они назначены одному субъекту. Решение `EP-DP-DR-004` само по себе не доказывало независимость контроля; этот долг позднее закрыт `EP-DP-DR-012`, который задаёт адаптивный выбор между разнесённой по времени самопроверкой, изолированным LLM-review и внешним специалистом.

### 0.9 / OWNER.RESOURCE.AND.WIP.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-005
  decided_at: 2026-08-06
  authority: OWNER_LPR
  resolves: EPDP-OI-022
  OWNER_RESOURCE_MODEL:
    scope: EP_DOMAIN_ONLY
    resource_unit: OWNER_LPR_HOUR
    planning_horizon:
      type: ROLLING_WINDOW
      duration_days: 7
    declared_capacity:
      value: DECLARED_AVAILABLE_OWNER_LPR_HOURS
      authority: OWNER_LPR
      cadence: AT_LEAST_ONCE_PER_7_DAYS
      redeclare_if: MATERIAL_CAPACITY_CHANGE_OR_OVERLOAD
      boundary: HOURS_REALISTICALLY_AVAILABLE_TO_EP_AFTER_NON_EP_OBLIGATIONS
    formulas:
      OWNER_TIME_RESERVE_HOURS: DECLARED_AVAILABLE_OWNER_LPR_HOURS * 0.20
      MAXIMUM_PLANNED_COMMITMENT_HOURS: DECLARED_AVAILABLE_OWNER_LPR_HOURS * 0.80
      PLANNED_LOAD_HOURS: SUM_UNIQUE_EP_WORK_ITEM_PLANNED_OWNER_LPR_HOURS
    planned_load_accounting:
      work_item_identity: EP_WORK_ITEM_ID
      categories: [REGULAR_TRADE, EP_EXTERNAL_COMMITMENT, PROJECT_CYCLE]
      category_semantics: PRIORITY_AND_TRACEABILITY_TAGS_NOT_ADDITIVE_BUCKETS
      invariant: EACH_PLANNED_OWNER_LPR_HOUR_COUNTED_ONCE
    reserve:
      percent: 20
      purpose: UNPLANNED_REPAIR_AND_EXTERNAL_DEVIATIONS
      reserve_type: OWNER_TIME_CAPACITY_NOT_FINANCIAL_RESERVE
    commitment_limit:
      percent_of_declared_capacity: 80
      overload_if: PLANNED_LOAD_HOURS > MAXIMUM_PLANNED_COMMITMENT_HOURS
  WIP_POLICY:
    counted_objects: PROJECT_CYCLES_SATISFYING_CURRENT_ACTIVE_IF
    project_types: [REPAIR, GROWTH]
    excludes: [REGULAR_TRADE_CYCLES, PRE_START_HOLD_PROJECTS, PAUSED_NONTERMINAL_PROJECTS]
    current_active_if:
      WIP_local_work_state: ACTIVE
      current_owner_time_allocation: ALLOCATED
      terminal_condition: TERMINAL_NOT_REACHED
    history_rule: STARTED_HISTORY_ALONE_DOES_NOT_MAKE_A_PAUSED_PROJECT_ACTIVE_WIP
    active_project_limit: 2
    new_project_hold_if: ACTIVE_PROJECT_COUNT >= 2
    limit_breach_if: ACTIVE_PROJECT_COUNT > 2
  overload_if:
    - PLANNED_LOAD_HOURS > MAXIMUM_PLANNED_COMMITMENT_HOURS
    - ACTIVE_PROJECT_COUNT > 2
    - CRITICAL_REPAIR_OPEN
  overload_action:
    - HOLD_NEW_GROWTH
    - PAUSE_LOWEST_PRIORITY_ACTIVE_PROJECT_AS_NEEDED_TO_RESTORE_WIP_AND_HOUR_LIMITS
    - REPLAN_CURRENT_7_DAY_WINDOW
  overload_resolution:
    postconditions:
      - ACTIVE_PROJECT_COUNT <= 2
      - PLANNED_LOAD_HOURS <= MAXIMUM_PLANNED_COMMITMENT_HOURS
    no_pausable_active_project:
      overload_state: REMAINS_ACTIVE
      action: HOLD_NEW_GROWTH_AND_REPLAN_UNTIL_HOUR_LIMIT_RESTORED
  pause_semantics:
    project_not_started: HOLD
    project_already_active:
      WIP_local_work_state: PAUSED_RESOURCE_OVERLOAD
      current_owner_time_allocation: RELEASED
      counted_in_ACTIVE_PROJECT_COUNT: false
      paused_project_hours_in_current_planned_load: REMOVED_ON_REPLAN
      required_record: [PAUSE_REASON, RESUME_CONDITION, REPLANNED_7_DAY_WINDOW]
      terminal_state_created: false
      canonical_project_lifecycle_mapping: TO_BE_DEFINED_IN_EPDP_OI_021
  priority_admission:
    applies_to: [CRITICAL_REPAIR, OWNER_LPR_CLASSIFIED_COMPLIANCE]
    rule: PREEMPT_LOWEST_PRIORITY_PROJECT_BEFORE_WORK_IF_NEEDED
    postcondition: ACTIVE_PROJECT_COUNT <= 2
    compliance_gate_definition: OUT_OF_SCOPE_EPDP_OI_020_REMAINS_OPEN
  priority_order:
    - CRITICAL_REPAIR_OR_COMPLIANCE
    - EP_CURRENT_EXTERNAL_COMMITMENTS
    - REGULAR_TRADE_CYCLE
    - GROWTH
  priority_invariant: ANY_REPAIR_PRECEDES_GROWTH_WHEN_RESOURCE_CONFLICT
  measurement_state:
    ACTUAL_AVAILABLE_CAPACITY_HOURS: NOT_MEASURED
    ACTUAL_PLANNED_LOAD_HOURS: NOT_MEASURED
    ACTUAL_ACTIVE_PROJECT_COUNT: NOT_MEASURED
    measurement_gate: INTERNAL_QA_OR_RUNTIME
  source_of_truth: TO_BE_ASSIGNED_IN_EPDP_OI_019
  closure_evidence_refs:
    - EP-DP-DR-005
    - EP-DP_v0.2_§4.3
    - EP-DP_v0.2_§10
  does_not_resolve_scope: ALL_OTHER_OPENITEMS
  does_not_resolve_examples: [EPDP-OI-008, EPDP-OI-019, EPDP-OI-020, EPDP-OI-021, EPDP-OI-032]
  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

Резерв `20%` — это резерв времени `OWNER_LPR`, а не денежный резерв `E4 / EPDP-OI-008`. Решение задаёт вычислимую модель; фактические часы, загрузка и WIP этим шагом не утверждаются и должны быть измерены в QA/runtime.

### 0.10 / OBSERVATION.CYCLE.IDENTITY.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-006
  decided_at: 2026-08-06
  authority: OWNER_LPR
  resolves: EPDP-OI-023
  scope: OBSERVATION_CYCLE_IDENTITY_AND_EVENT_MEMBERSHIP
  domain_membership:
    local_domain_label: ELEPHANT_PANTS
    rule: ALL_CYCLE_CLASSES_BELONG_TO_EP_DOMAIN_WITHOUT_BECOMING_ORGANS
  contour_membership_by_class:
    ECONOMICS: ECONOMICS.SYSTEM
    IMPORT: ECONOMICS.SYSTEM
    LOGISTIC_IMPORT: ECONOMICS.SYSTEM
    LOGISTIC_RUSSIA: ECONOMICS.SYSTEM
    SALES: ECONOMICS.SYSTEM
    REPAIR_PROJECT: PROJECT_REPAIR_GROWTH
    GROWTH_PROJECT: PROJECT_REPAIR_GROWTH
  project_contour_rule:
    automatic_ECONOMICS_SYSTEM_membership: false
    economics_relation_if_factually_affected: EVENT_CYCLE_MEMBERSHIP_RELATED_LINK
  CYCLE_CLASS_DICTIONARY:
    allowed_tokens:
      - ECONOMICS
      - IMPORT
      - LOGISTIC_IMPORT
      - LOGISTIC_RUSSIA
      - SALES
      - REPAIR_PROJECT
      - GROWTH_PROJECT
    boundary_crosswalk:
      ECONOMICS:
        boundary_ref: EP-DP_v0.2_§1.1_ECONOMICS.SYSTEM_AND_E1-E4
        meaning: ECONOMIC_OR_END_TO_END_SYSTEM_CONTEXT
      IMPORT:
        boundary_ref: EP-DP_v0.2_I1-I5
        meaning: PROCUREMENT_AND_IMPORT_PREPARATION
      LOGISTIC_IMPORT:
        boundary_ref: EP-DP_v0.2_L(I)1-L(I)4
        meaning: PHYSICAL_AND_DOCUMENTARY_INTERNATIONAL_ROUTE
      LOGISTIC_RUSSIA:
        boundary_ref: EP-DP_v0.2_L(R)1-L(R)7
        meaning: DOMESTIC_ACCEPTANCE_PREPARATION_AND_OZON_HANDOFF
      SALES:
        boundary_ref: EP-DP_v0.2_S1-S2
        meaning: CATALOG_SALE_AND_PAYOUT_CONTEXT
      REPAIR_PROJECT:
        boundary_ref: EP-DP_v0.2_§10_PROJECT_TYPE_REPAIR
        meaning: ONE_OFF_REPAIR_PROJECT_CONTEXT
      GROWTH_PROJECT:
        boundary_ref: EP-DP_v0.2_§10_PROJECT_TYPE_GROWTH
        meaning: ONE_OFF_GROWTH_PROJECT_CONTEXT
    token_rule: ONLY_UNDERSCORE_TOKENS_ABOVE_ARE_VALID_IN_MEMBERSHIP_AND_ID
    silent_extension: DENY
    unknown_class: NEW_CYCLE_CLASS_PROPOSAL_AND_HOLD_FOR_OWNER_LPR
  CYCLE_RECORD_IDENTITY:
    one_cycle_instance_id_maps_to: EXACTLY_ONE_CYCLE_RECORD
    required:
      cycle_class: ONE_OF_CYCLE_CLASS_DICTIONARY
      cycle_instance_id: IMMUTABLE_AND_NON_REUSABLE
      scope:
        class_boundary_ref: REQUIRED_FROM_DICTIONARY
        instance_subject_ref: REQUIRED_NONEMPTY_STABLE_DOMAIN_REFERENCE
    scope_semantics:
      class_boundary_ref: WHICH_EP_PROCESS_BOUNDARY_APPLIES
      instance_subject_ref: WHICH_CONCRETE_BATCH_PERIOD_PROJECT_OR_OTHER_DOMAIN_OBJECT_IS_OBSERVED
    identity_change_after_commit: DENY
    correction_or_reclassification_governance: UNSPECIFIED_EPDP_OI_024
  CYCLE_INSTANCE_ID_RULE:
    format: EP-{CLASS}-{YYYYMMDD}-{NNN}
    regex: '^EP-(ECONOMICS|IMPORT|LOGISTIC_IMPORT|LOGISTIC_RUSSIA|SALES|REPAIR_PROJECT|GROWTH_PROJECT)-[0-9]{8}-[0-9]{3}$'
    assigned_by_oper: O2
    YYYYMMDD_source: LOCAL_DATE_COMPONENT_OF_O2_CREATED_AT
    created_at_requirement: ISO_8601_TIMESTAMP_WITH_OFFSET
    sequence_scope: [CYCLE_CLASS, YYYYMMDD]
    NNN_rule: NEXT_UNUSED_ZERO_PADDED_INTEGER_001_TO_999
    collision_or_reuse: HOLD_AND_SELECT_NEXT_UNUSED
    sequence_exhausted: HOLD_FOR_OWNER_LPR_FORMAT_DECISION
    immutable_after_registration: true
    applies_to: CYCLE_INSTANCE_ID_ONLY
    does_not_apply_to: OBSERVATION_EVENT_ID
  EVENT_CYCLE_MEMBERSHIP:
    entity_separation: EVENT_MEMBERSHIP_IS_NOT_CYCLE_RECORD_IDENTITY
    committed_primary:
      cardinality: EXACTLY_ONE
      required_fields: [cycle_class, cycle_instance_id, classification_basis_ref]
    related:
      cardinality: ZERO_TO_MANY
      each_requires: [cycle_class, cycle_instance_id, relation_basis_ref]
    invariants:
      - PRIMARY_PAIR_NOT_REPEATED_IN_RELATED
      - RELATED_PAIRS_UNIQUE
      - CLASS_MATCHES_REFERENCED_CYCLE_RECORD
      - MULTIPLE_MEMBERSHIP_DOES_NOT_MERGE_CYCLE_STATES
      - CLOSURE_OF_ONE_CYCLE_DOES_NOT_CLOSE_RELATED_CYCLES
      - ONE_OBSERVATION_EVENT_PAYLOAD_IS_NOT_CLONED_PER_MEMBERSHIP
    primary_selection: CYCLE_INSTANCE_WHOSE_GOAL_STEP_OR_RESULT_IS_MOST_DIRECTLY_CHANGED
  AMBIGUITY_RULE:
    ambiguous_if:
      - PRIMARY_CYCLE_CLASS_NOT_UNIQUE
      - PRIMARY_CYCLE_INSTANCE_NOT_UNIQUE
      - EXISTING_VS_NEW_CYCLE_NOT_RESOLVED
    transition_decision: HOLD
    committed_membership_while_ambiguous: NONE
    permitted_pending_data: CANDIDATE_CLASS_AND_INSTANCE_LINKS
    forbidden_while_ambiguous: [CREATE_CYCLE_UPDATE, UPDATE_CYCLE_STATE, CLOSE_CYCLE]
    resolution_authority: OWNER_LPR
    resolution_evidence_required: [SELECTED_PRIMARY, CLASSIFICATION_BASIS, RESOLVED_BY, RESOLVED_AT]
  physical_registry_and_source_of_truth: UNSPECIFIED_EPDP_OI_019
  closure_evidence_refs:
    - EP-DP-DR-006
    - EP-DP_v0.2_§6.2
    - EP-DP_v0.2_§6.3
    - EP-DP_v0.2_§6.4
  does_not_resolve_scope: ALL_OTHER_OPENITEMS
  does_not_resolve_examples: [EPDP-OI-019, EPDP-OI-020, EPDP-OI-021, EPDP-OI-024, EPDP-OI-025, EPDP-OI-026, EPDP-OI-028, EPDP-OI-029, EPDP-OI-032]
  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
    O1_transition: NONE
    O2_transition: NONE
```

`EP-DP-DR-006` определяет только логическую идентичность и классификацию. Closure/reopen определены последующим решением `EP-DP-DR-007`, а SLA записи — решением `EP-DP-DR-008`; физическое место хранения, общая event/change schema и QA остаются отдельными открытыми долгами. `HOLD` при неоднозначности — решение по конкретному наблюдению, а не lifecycle-переход `Oper` или `Physiology`.

### 0.11 / OBSERVATION.CLOSURE.AND.REOPEN.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-007
  decided_at: 2026-08-06
  authority: OWNER_LPR
  resolves: EPDP-OI-025
  scope: LOCAL_CYCLE_RECORD_CLOSURE_REOPEN_AND_POST_CLOSURE_CONTINUATION
  CLOSURE_AUTHORITY:
    current_authority: OWNER_LPR_ONLY
    current_delegation: NONE
    future_delegation_requires: SEPARATE_EXPLICIT_DECISION
    assignment_does_not_prove_runtime_closure: true
  CLOSE_ALLOWED_IF:
    - CYCLE_RECORD_STATE_IS_OPEN
    - CYCLE_IDENTITY_AND_COMMITTED_MEMBERSHIP_CONFIRMED
    - EXPECTED_RESULT_NONEMPTY
    - ACTUAL_RESULT_NONEMPTY_OR_EXPLICIT_NO_FINAL_RESULT_FOR_TERMINATED
    - ACTUAL_VS_EXPECTED_COMPARISON_NONEMPTY
    - EXACTLY_ONE_CLOSURE_OUTCOME_SELECTED
    - CLOSURE_BASIS_NONEMPTY
    - CLOSURE_EVIDENCE_REFS_NONEMPTY_AND_ACCEPTED_BY_OWNER_LPR
    - OWNER_LPR_CLOSURE_DECISION_RECORDED
    - CLOSED_AT_ISO_8601_WITH_OFFSET
  CLOSURE_OUTCOMES:
    allowed: [ACHIEVED, PARTIAL, NOT_ACHIEVED, TERMINATED]
    cardinality: EXACTLY_ONE
    semantics:
      ACHIEVED: ALL_APPLICABLE_EXPECTED_RESULT_ACCEPTANCE_CRITERIA_SATISFIED
      PARTIAL: AT_LEAST_ONE_ACCEPTED_PART_AND_AT_LEAST_ONE_UNMET_PART_WITH_OWNER_ACCEPTED_RESIDUE_DISPOSITION
      NOT_ACHIEVED: NORMAL_TERMINAL_BOUNDARY_REACHED_WITH_EXPECTED_RESULT_NOT_ACCEPTED
      TERMINATED: OWNER_LPR_ENDED_EXECUTION_BEFORE_NORMAL_TERMINAL_BOUNDARY_WITH_REASON
    precedence_rule: EARLY_AUTHORIZED_END_IS_TERMINATED_NOT_NOT_ACHIEVED
    closed_does_not_mean_achieved: true
    invariants:
      - PARTIAL_DENY_IF_SAME_INSTANCE_CONTINUES_ACTIVE_WORK
      - TERMINATED_DOES_NOT_IMPLY_ACHIEVEMENT
      - OUTCOME_DOES_NOT_REPLACE_ACTUAL_VS_EXPECTED_COMPARISON
  RESIDUE_DISPOSITION:
    allowed: [NONE, NOT_CONTINUED_BY_OWNER_DECISION, NEW_LINKED_CYCLE_REQUIRED, OUT_OF_SCOPE]
    ACHIEVED_default: NONE
    PARTIAL_NOT_ACHIEVED_OR_TERMINATED:
      required: true
      allowed_non_none: [NOT_CONTINUED_BY_OWNER_DECISION, NEW_LINKED_CYCLE_REQUIRED, OUT_OF_SCOPE]
  LOGICAL_CLOSURE_RECORD_MINIMUM:
    required_fields:
      - closure_event_id
      - cycle_instance_id
      - outcome
      - expected_result_ref
      - actual_result_or_NO_FINAL_RESULT
      - actual_vs_expected_comparison
      - closure_basis
      - closure_evidence_refs
      - residue_disposition
      - decided_by
      - authority_ref
      - decided_at
      - closed_at
    write_semantics: APPEND_ONLY_LOGICAL_EVENT
  CURRENT_CLOSURE_PROJECTION:
    when_cycle_state_CLOSED:
      current_closed_at: TIMESTAMP_OF_LATEST_EFFECTIVE_CLOSURE_EVENT
      current_closure_outcome: OUTCOME_OF_LATEST_EFFECTIVE_CLOSURE_EVENT
      current_closure_event_ref: LATEST_EFFECTIVE_CLOSURE_EVENT_ID
    when_cycle_state_OPEN:
      current_closed_at: null
      current_closure_outcome: NONE
      current_closure_event_ref: NONE
    reopen_effect: CLEAR_CURRENT_PROJECTION_ONLY
    closure_history: IMMUTABLE_APPEND_ONLY_WITH_ALL_PRIOR_CLOSED_AT_OUTCOMES_AND_REFS
    reclose_effect: APPEND_NEW_CLOSURE_EVENT_AND_DERIVE_NEW_CURRENT_PROJECTION
  CLOSE_EFFECT:
    cycle_record_state: CLOSED
    current_closure_projection: DERIVED_FROM_NEW_CLOSURE_EVENT
    prior_cycle_identity_and_scope: UNCHANGED
    related_cycle_states: UNCHANGED
    cycle_instance_id_reuse: DENY
  REOPEN_SAME_CYCLE_ALLOWED_IF:
    - CURRENT_CYCLE_RECORD_STATE_IS_CLOSED
    - REFERENCED_PRIOR_CLOSURE_EVENT_ID_PRESENT
    - EVIDENCE_SHOWS_CLOSURE_CRITERIA_WERE_NOT_ACTUALLY_SATISFIED_AT_CLOSED_AT
    - REOPEN_REASON_NONEMPTY
    - REOPEN_EVIDENCE_REFS_NONEMPTY
    - OWNER_LPR_REOPEN_DECISION_RECORDED
    - REOPENED_AT_ISO_8601_WITH_OFFSET
  REOPEN_SAME_CYCLE_EFFECT:
    cycle_instance_id: SAME
    cycle_class_and_scope: UNCHANGED
    cycle_record_state: OPEN
    current_closed_at: null
    current_closure_outcome: NONE
    current_closure_event_ref: NONE
    reopen_event: APPEND_ONLY
    prior_closure_event_outcome_and_dates: PRESERVED_IN_HISTORY
    prior_closure_decision_status: REVOKED_AS_ERRONEOUS_WITHOUT_OVERWRITE
    silent_delete_or_rewrite: DENY
  REOPEN_NOT_ALLOWED_FOR:
    - NEW_GOAL
    - NEW_WORK_AFTER_VALID_CLOSURE
    - CHANGED_PRIORITY_ONLY
    - LATER_EVENT_THAT_DID_NOT_INVALIDATE_ORIGINAL_CLOSURE
  VALID_CLOSURE_NEW_WORK_ROUTE:
    predecessor_cycle_state: REMAINS_CLOSED
    action: O1_AUTHORIZED_NEW_WORK_AFTER_VALID_CLOSURE_THEN_O2_CREATE_NEW_LINKED_CYCLE
    O4_route_decision_ref: REQUIRED
    O1_return_to_O4_for_same_event: DENY
    new_cycle_instance_id: REQUIRED_BY_EP_DP_DR_006
    required_link_fields: [predecessor_cycle_instance_id, continuation_reason, trigger_evidence_ref]
    initiating_event_membership: COMMITTED_TO_NEW_CYCLE_UNDER_EP_DP_DR_006
    predecessor_related_membership:
      required: true
      applies_to: VALID_CLOSURE_NEW_WORK_ROUTE
      relation_basis_ref: TRIGGER_EVIDENCE_REF_OR_CONTINUATION_REASON_REF
  POST_CLOSURE_EVIDENCE_ROUTE:
    late_arrival_time_alone_decides_route: false
    route_basis: WHETHER_FACT_INVALIDATED_CLOSURE_AT_CLOSED_AT_OR_AROSE_AFTER_VALID_CLOSURE
    membership_rule:
      confirms_corrects_or_reopens_same_cycle: REFERENCED_CYCLE_IS_EVENT_PRIMARY
      valid_closure_plus_new_work: NEW_CYCLE_IS_PRIMARY_AND_PREDECESSOR_IS_RELATED
      primary_commit_before_route_decision: DENY
    evidence_proves_original_closure_erroneous:
      result: REOPEN_PROPOSAL
      state_until_owner_decision: CLOSED
    evidence_creates_new_work_after_valid_closure:
      result: NEW_LINKED_CYCLE_PROPOSAL
      predecessor_state: CLOSED
    evidence_only_confirms_or_clarifies_without_outcome_change:
      result: APPEND_EVIDENCE_REF
      state: CLOSED
    clerical_correction_without_outcome_change:
      result: APPEND_CORRECTION_EVENT_WITHOUT_OVERWRITE
      state: CLOSED
    significant_for_protocol:
      additional_route: O5
      cycle_reopen_or_outcome_mutation: NOT_AUTOMATIC
  PROJECT_BOUNDARY:
    local_observation_cycle_closed_does_not_assert: [PROJECT_CLOSED, TRANSFERRED_TO_REGULAR_PROCESS, PROJECT_HANDOFF_ACCEPTED]
    project_exit_contract: UNSPECIFIED_EPDP_OI_021
  physical_register_and_atomic_write: UNSPECIFIED_EPDP_OI_019
  general_event_change_correction_schema_and_retention: UNSPECIFIED_EPDP_OI_024
  recording_SLA:
    scope_in_EP_DP_DR_007: OUT_OF_SCOPE
    current_rule_ref: EP-DP-DR-008
  closure_evidence_refs:
    - EP-DP-DR-007
    - EP-DP_v0.2_§6.2
    - EP-DP_v0.2_§6.6
    - EP-DP_v0.2_§6.8
  does_not_resolve_scope: ALL_OTHER_OPENITEMS
  does_not_resolve_examples: [EPDP-OI-012, EPDP-OI-019, EPDP-OI-020, EPDP-OI-021, EPDP-OI-024, EPDP-OI-026, EPDP-OI-028, EPDP-OI-029, EPDP-OI-032]
  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
    O4_transition: NONE
    O5_transition: NONE
```

`EP-DP-DR-007` определяет локальное состояние `CYCLE_RECORD`, а не lifecycle `Oper`, `Physiology` или проекта. Reopen сохраняет тот же ID только при доказанной ошибочности прежнего закрытия и добавляет новую запись в историю; корректно закрытый цикл не переоткрывается ради новой работы.

### 0.12 / OBSERVATION.RECORDING.SLA.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-008
  decided_at: 2026-08-06
  authority: OWNER_LPR
  resolves: EPDP-OI-026
  resolution_scope: LOGICAL_O3_O4_RECORDING_SLA_CONTRACT_DEFINED
  runtime_activation: PATHS_DEFINED_BY_EP_DP_DR_009_WRITER_AND_RUNTIME_BEHAVIOR_NOT_YET_VERIFIED
  scope: LOCAL_OBSERVATION_O3_O4_RECORDING_SLA_ONLY
  TIME_SEMANTICS:
    duration_basis: CONTINUOUS_ELAPSED_TIME_24X7
    timestamp_format: ISO_8601_WITH_OFFSET
    comparison_basis: NORMALIZED_INSTANT
    critical_limit: PT4H
    critical_limit_minutes: 240
    ordinary_limit: PT24H
    ordinary_limit_minutes: 1440
    closure_or_reopen_limit: PT24H
    closure_or_reopen_limit_minutes: 1440
    deadline_formula: SLA_DEADLINE_AT = SLA_STARTED_AT + CLASS_LIMIT
    deadline_inclusive: true
    on_time_if: ACTUAL_RECORDED_AT <= SLA_DEADLINE_AT
    actual_recorded_at_semantics: ACTUAL_SUCCESSFUL_COMPLETION_APPEND_TIME_OF_REQUIRED_O3_OR_O4_RECORD
    SLA_tracking_envelope_creation_does_not_equal_actual_recorded_at: true
    actual_recorded_at_backdating: DENY
    timestamp_order_invalid_if: SLA_STARTED_AT > ACTUAL_RECORDED_AT
  SLA_CLASSES:
    allowed: [CRITICAL_EVENT, ORDINARY_OBSERVATION, CLOSURE_OR_REOPEN_DECISION]
    cardinality_per_recording_obligation: EXACTLY_ONE
    CRITICAL_EVENT:
      applies_if_any:
        - CRITICAL_DEFECT_DETECTED
        - EXISTING_AUTHORIZED_RULE_REQUIRES_TRANSITION_DECISION_STOP
        - EXISTING_AUTHORIZED_RULE_CLASSIFIES_CRITICAL_REPAIR
        - OWNER_LPR_EXPLICITLY_CLASSIFIES_CRITICAL_WITH_BASIS_REF
      limit: PT4H
      starts_at: AVAILABLE_FOR_RECORDING_AT
      anchor_semantics: EARLIEST_SUPPORTED_AVAILABILITY_TO_OWNER_LPR_OR_CURRENT_OBSERVATION_EXECUTOR_WITH_SOURCE_REF_SUFFICIENT_FOR_PENDING_RECORD
      criticality_basis_ref: REQUIRED
      default_classification_resolution_state: FINAL
      ambiguity_override: PROVISIONAL_PER_CLASSIFICATION_PRECEDENCE
      late_classification_does_not_reset_anchor: true
    ORDINARY_OBSERVATION:
      applies_to:
        - O3_NONCRITICAL_CONFIRMED_STATE_CHANGE
        - O4_NONCRITICAL_POST_CLOSE_CONFIRMATION_OR_CLARIFICATION
        - O4_NONCRITICAL_CLERICAL_CORRECTION
        - O4_NONCRITICAL_NEW_WORK_ROUTE_DECISION
      limit: PT24H
      classification_resolution_state: FINAL
      starts_at_by_record_type:
        O3_STATE_CHANGE: AVAILABLE_FOR_RECORDING_AT
        O4_POST_CLOSE_CONFIRMATION_OR_CORRECTION: AVAILABLE_FOR_RECORDING_AT
        O4_NEW_WORK_ROUTE_DECISION: OWNER_LPR_ROUTE_DECIDED_AT
    CLOSURE_OR_REOPEN_DECISION:
      applies_to: [O4_CLOSURE_DECISION, O4_REOPEN_DECISION]
      limit: PT24H
      starts_at: OWNER_LPR_DECIDED_AT
      classification_resolution_state: FINAL
    CLASSIFICATION_PRECEDENCE:
      closure_or_reopen_decision_obligation:
        sla_class: CLOSURE_OR_REOPEN_DECISION
        anchor: OWNER_LPR_DECIDED_AT
        critical_underlying_event_is_separate_obligation: true
      nondecision_event_obligation:
        - CRITICAL_EVENT_OVERRIDES_ORDINARY_OBSERVATION
      ambiguity_until_owner_resolution:
        sla_class: CRITICAL_EVENT
        classification_resolution_state: PROVISIONAL
        classification_basis_ref: AMBIGUITY_DECISION_OR_BASIS_REF_REQUIRED
        limit: PT4H
        anchor: AVAILABLE_FOR_RECORDING_AT_UNCHANGED
        owner_resolution: APPEND_ONLY_CLASSIFICATION_DECISION
        later_ordinary_resolution_does_not_rewrite_deadline_or_LATE: true
      final_classification:
        classification_resolution_state: FINAL
        final_domain_criticality: CRITICAL | ORDINARY
        effective_sla_class_for_original_obligation: PRESERVE_PROVISIONAL_CRITICAL_EVENT
        prior_provisional_classification_history: IMMUTABLE
      underlying_event_and_later_owner_decision:
        decision_types: [CLOSURE, REOPEN, NEW_WORK_ROUTE]
        semantics: DISTINCT_REFERENCED_RECORDING_OBLIGATIONS
        shared_evidence_ref: ALLOW
        payload_cloning: DENY
        each_has_own_anchor_deadline_and_status: true
      new_work_route_decision_obligation:
        sla_class: ORDINARY_OBSERVATION
        classification_resolution_state: FINAL
        anchor: OWNER_LPR_ROUTE_DECIDED_AT
      constitutive_obligation_rule:
        applies_to: [CLOSURE_DECISION_FOR_CLOSED, REOPEN_DECISION_FOR_REOPENED, NEW_WORK_ROUTE_DECISION_FOR_LINKED_ROUTE]
        must_be_logically_appended_before_branch_outcome: true
        overdue_tracking_accounts_for_breach_but_does_not_substitute_required_record: true
        if_overdue_unrecorded: HOLD_CURRENT_DEPENDENT_BRANCH
        after_late_append: REQUIRE_OWNER_LPR_ACCEPTANCE_AND_PREREQUISITE_RECHECK
        overdue_tracking_may_stand_without_branch_hold_only_for_nondependent_obligation: true
      later_decision_does_not_reset_critical_event_clock: true
      event_payload_cloning: DENY
    COVERAGE_NORMALIZATION:
      approved_ordinary_state_change: O3_NONCRITICAL_STATE_CHANGE_PT24H
      O4_nonstate_post_close_records: CONSERVATIVELY_USE_SAME_PT24H_ORDINARY_ENVELOPE
      O4_records_are_not_reclassified_as_state_changes: true
      purpose: NO_O4_RECORDING_BRANCH_LEFT_WITHOUT_SLA
  TIMESTAMP_SEPARATION:
    occurred_at_if_known: FACTUAL_DOMAIN_EVENT_TIME_NOT_SLA_ANCHOR
    occurred_at_unknown: PRESERVE_UNKNOWN_DO_NOT_FABRICATE
    available_for_recording_at: EARLIEST_SUPPORTED_OWNER_OR_EXECUTOR_AVAILABILITY_WITH_SOURCE_REF_FOR_PENDING_RECORD
    available_at_basis_ref: REQUIRED_WHEN_AVAILABLE_FOR_RECORDING_AT_IS_SLA_ANCHOR
    critical_detected_or_classified_at: DOES_NOT_RESET_AVAILABLE_FOR_RECORDING_AT
    O1_classification_or_membership_resolution_time: DOES_NOT_RESET_OR_PAUSE_SLA
    owner_LPR_decided_at: CLOSURE_OR_REOPEN_DECISION_ANCHOR
    actual_recorded_at: REQUIRED_O3_OR_O4_RECORD_COMPLETION_APPEND_TIME_NOT_SLA_TRACKING_ENVELOPE_TIME
    updated_at_closed_at_reopened_at_do_not_substitute_actual_recorded_at: true
  RECORDING_STATUS:
    allowed: [PENDING, ON_TIME, LATE, UNVERIFIABLE]
    status_precedence: [UNVERIFIABLE, LATE, ON_TIME, PENDING]
    PENDING_IF: ACTUAL_RECORDED_AT_ABSENT_AND_EVALUATED_AT_NOT_AFTER_DEADLINE
    ON_TIME_IF: ACTUAL_RECORDED_AT_PRESENT_AND_NOT_AFTER_INCLUSIVE_DEADLINE
    LATE_IF:
      - ACTUAL_RECORDED_AT_PRESENT_AND_AFTER_DEADLINE
      - ACTUAL_RECORDED_AT_ABSENT_AND_EVALUATED_AT_AFTER_DEADLINE
    OVERDUE_UNRECORDED:
      condition: ACTUAL_RECORDED_AT_ABSENT_AND_EVALUATED_AT_AFTER_DEADLINE
      recording_sla_status: LATE
      late_flag: true
      actual_recorded_at: null
      completion_requires: [ACTUAL_RECORDED_AT, LATE_REASON]
    UNVERIFIABLE:
      condition: REQUIRED_SLA_START_OR_BASIS_TIMESTAMP_MISSING_OR_INVALID
      sla_started_at: null
      sla_deadline_at: null
      late_flag: UNKNOWN
      on_time_claim: DENY
      dependent_transition: HOLD
      nondependent_transition: NO_AUTOMATIC_HOLD
    late_flag_when_LATE: true
    late_status_persists_after_completion: true
    late_record_is_still_appended_and_does_not_suppress_fact: true
  LOGICAL_SLA_ENVELOPE_MINIMUM:
    pending_envelope_semantics: SLA_OBLIGATION_MAY_BE_TRACKED_BEFORE_REQUIRED_O3_OR_O4_RECORD_IS_COMPLETE
    required_fields:
      - observation_event_or_decision_ref
      - cycle_instance_id_or_pending_membership
      - oper_id
      - record_type
      - sla_class
      - classification_resolution_state
      - classification_basis_ref
      - recording_sla_status
      - evaluated_at
    conditional_fields:
      calculable_status: [sla_started_at, sla_deadline_at]
      factual_event:
        required: [available_for_recording_at, available_at_basis_ref]
        optional_when_factually_known: [occurred_at_if_known]
      closure_or_reopen_decision: [owner_LPR_decided_at, decision_ref]
      new_work_route_decision: [owner_LPR_route_decided_at, decision_ref]
      logical_append_succeeded: [actual_recorded_at, recorded_by, logical_commit_ref]
      logical_append_succeeded_and_calculable: [elapsed_minutes]
      late_completed: [late_reason, actual_recorded_at, escalation_ref]
      unverifiable: [unverifiable_reason]
      dependent_transition: [dependent_transition_refs]
    full_event_change_schema_claim: DENY_EPDP_OI_024
  LATE_ESCALATION:
    escalation_target: OWNER_LPR_CONTROL_OWNER
    independent_control_satisfied: false
    when_LATE:
      - KEEP_LATE_FLAG_TRUE
      - REQUIRE_NONEMPTY_LATE_REASON
      - COMPLETE_APPEND_WITH_ACTUAL_RECORDED_AT
      - RECORD_ESCALATION_REF
      - RECHECK_DEPENDENT_TRANSITION_PREREQUISITES
    HOLD_IF: RECORD_IS_REQUIRED_FOR_NEXT_TRANSITION_AND_RECORD_OR_LATE_METADATA_NOT_COMPLETE_AND_ACCEPTED
    HOLD_SCOPE: NEXT_DEPENDENT_TRANSITION_ONLY
    RESUME_IF:
      - REQUIRED_RECORD_LOGICALLY_APPENDED
      - ACTUAL_RECORDED_AT_PRESENT
      - LATE_REASON_PRESENT
      - OWNER_LPR_ACCEPTED_RECORD_FOR_TRANSITION
      - DEPENDENT_PREREQUISITES_RECHECKED
    after_resume: LATE_FLAG_REMAINS_TRUE
    nondependent_transition: NO_AUTOMATIC_HOLD
    IF_DEPENDENT_TRANSITION_ALREADY_OCCURRED:
      retroactive_HOLD: DENY
      actions: [RECORD_CONTROL_DEFECT, HOLD_NEXT_AFFECTED_TRANSITION, ASSESS_REPAIR, RECONTROL_IF_REQUIRED]
    no_automatic_effect: [STOP, REPAIR, REOPEN, CLOSURE_OUTCOME_CHANGE, OPER_LIFECYCLE_CHANGE, PHYSIOLOGY_LIFECYCLE_CHANGE]
  ROUTING_BOUNDARY:
    O1_membership_ambiguity_does_not_pause_or_reset_SLA: true
    O5_does_not_reset_SLA_or_substitute_initial_O3_O4_record: true
    O5_cannot_remove_LATE_or_dependent_HOLD: true
    closure_or_reopen_PT24H_is_recording_deadline_after_decision_not_deadline_for_making_decision: true
  DEPENDENCY_BOUNDARY:
    EPDP_OI_023: RESOLVED_PREREQUISITE
    EPDP_OI_019: REMAINING_IMPLEMENTATION_AND_RUNTIME_DEPENDENCY
    specification_resolution_allowed_without_physical_register: true
    physical_location_clock_atomic_write_and_enforcement: UNSPECIFIED_EPDP_OI_019
    general_event_change_source_authority_retention_and_rollback_schema: UNSPECIFIED_EPDP_OI_024
    QA_fixtures_and_measured_SLA_compliance: UNSPECIFIED_EPDP_OI_032
  runtime_measurement_state: NOT_EXECUTED
  closure_evidence_refs:
    - EP-DP-DR-008
    - EP-DP_v0.2_§6.2
    - EP-DP_v0.2_§6.5
    - EP-DP_v0.2_§6.6
  does_not_resolve_scope: ALL_OTHER_OPENITEMS
  does_not_resolve_examples: [EPDP-OI-012, EPDP-OI-019, EPDP-OI-024, EPDP-OI-032]
  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
    O3_transition: NONE
    O4_transition: NONE
```

`EP-DP-DR-008` закрывает долг определения SLA, но не подтверждает, что записи уже создаются вовремя. Четыре и двадцать четыре часа — календарные elapsed-hours; дедлайн включителен. Для критического и обычного события отсчёт идёт от самого раннего подтверждаемого момента, когда событие или evidence стало доступно `OWNER_LPR` либо назначенному исполнителю с source ref, достаточной для pending-записи; время последующей классификации часы не перезапускает. Известное фактическое время самого события хранится отдельно и не переписывается. Просрочка остаётся видимой после исправления; `HOLD` затрагивает только зависимый переход и снимается после завершения late-записи, принятия `OWNER_LPR` и повторной проверки предпосылок.

---

### 0.13 / SOURCE.OF.TRUTH.AND.MEMORY.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-009
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-019
  repository:
    provider: GitHub
    repository_full_name: valerol/ep_dashboard
    canonical_branch: main
    repository_role: EP_DOMAIN_SOURCE_OF_TRUTH
  storage_contract:
    base_path: data/ep-domain
    canonical_format: YAML_UTF8
    event_format: YAML_UTF8_ONE_EVENT_PER_FILE
    evidence_storage_mode: REFERENCE_FIRST
    git_commit_history: IMMUTABLE_AUDIT_TRAIL
    destructive_history_rewrite: DENY
  physiology_register:
    current_version_path: data/ep-domain/domain-physiology/EP-DP-v0.2.1.md
    current_pointer_path: data/ep-domain/domain-physiology/CURRENT.md
    repository_topology_manifest_path: data/ep-domain/repository-map.yaml
    embedded_topology_ref: EP-DP_v0.2.1_§14.1
    synchronization_rule_ref: EP-DP-DR-061
  observation_registers:
    CYCLE_REGISTER:
      path: data/ep-domain/observation/cycles/<cycle_instance_id>.yaml
      key: cycle_instance_id
    CYCLE_EVENT_LOG:
      path: data/ep-domain/observation/events/<YYYY>/<MM>/<observation_event_id>.yaml
      key: observation_event_id
      append_semantics: NEW_FILE_PER_EVENT
    PROTOCOL_VERSION_REGISTER:
      path: data/ep-domain/observation/protocol/<protocol_or_instruction_id>/<version_id>.yaml
      key: [protocol_or_instruction_id, version_id]
  entity_registers:
    SKU_PATTERN: data/ep-domain/entities/sku/<sku_id>.yaml
    SUPPLIER: data/ep-domain/entities/suppliers/<supplier_id>.yaml
    BATCH: data/ep-domain/entities/batches/<batch_id>.yaml
    FULL_COST: data/ep-domain/entities/costs/<cost_record_id>.yaml
    STOCK: data/ep-domain/entities/stock/<stock_record_id>.yaml
    DOCUMENT: data/ep-domain/entities/documents/<document_record_id>.yaml
    PRICE: data/ep-domain/entities/prices/<price_record_id>.yaml
    SALE_PAYOUT: data/ep-domain/entities/sales/<sale_payout_record_id>.yaml
    INCIDENT: data/ep-domain/entities/incidents/<incident_id>.yaml
    PROJECT: data/ep-domain/entities/projects/<project_id>.yaml
    DECISION: data/ep-domain/entities/decisions/<decision_id>.yaml
    VALUE_CRITERIA: data/ep-domain/entities/value_criteria/<value_id>.yaml
  common_record_contract:
    required_metadata:
      - record_id
      - record_type
      - schema_version
      - created_at
      - updated_at
      - data_owner
      - source_refs
    data_owner: OWNER_LPR
    canonical_write_authority: OWNER_LPR
    delegated_or_agent_write:
      allowed_if: EXPLICIT_OWNER_LPR_AUTHORIZATION_FOR_THE_WRITE
      canonical_effect: COMMIT_TO_MAIN_OR_OWNER_APPROVED_MERGE_TO_MAIN
    update_trigger: DOMAIN_EVENT_OR_AUTHORIZED_DECISION_REQUIRING_STATE_CHANGE
    retention: ALL_VERSIONS_RETAINED_IN_GIT_HISTORY
    deletion_rule: NO_SILENT_DELETE; SUPERSEDE_OR_TOMBSTONE_WITH_REASON_AND_COMMIT
  branch_semantics:
    main: CANONICAL_CURRENT_STATE
    non_main_branch: DRAFT_OR_PENDING_CHANGE_NOT_CANONICAL
  evidence_rule:
    primary_evidence_may_live_outside_repository: true
    repository_record_must_store: [evidence_ref, source_system_or_location, observed_or_received_at]
    copy_primary_evidence_into_repo: OPTIONAL_UNLESS_REQUIRED_BY_SPECIFIC_OPER
    absence_of_external_evidence: NOT_CONFIRMED
  observation_runtime_activation:
    EPDP_OI_026_design_contract: DEFINED
    physical_register_paths: DEFINED
    runtime_writer_implementation: NOT_YET_VERIFIED
    existing_register_files_created: NOT_ASSERTED
  closure_evidence_refs:
    - EP-DP-DR-009
    - GITHUB_REPOSITORY:valerol/ep_dashboard@main
    - EP-DP_v0.2_§14
  does_not_resolve_scope: ALL_OTHER_OPENITEMS
  does_not_resolve_examples: [EPDP-OI-024, EPDP-OI-028, EPDP-OI-029, EPDP-OI-032]
  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

Решение назначает физический source of truth и файловый контракт. `main` является каноническим состоянием; ветки и локальные файлы до merge не являются источником истины. Git history сохраняет историю изменений, но сама реализация автоматического writer и фактическое наличие каждого register file проверяются в QA и не считаются доказанными этим решением.

### 0.14 / OBSERVATION.CHANGE.RETENTION.AND.ROLLBACK.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-010
  decided_at: 2026-08-07
  authority: OWNER_LPR
  applies_to: EPDP-OI-024
  resolution_scope: PARTIAL
  resolves_parts:
    - CHANGE_HISTORY_RETENTION
    - ERRONEOUS_CHANGE_ROLLBACK_MECHANISM
  change_history:
    source_of_truth: GITHUB_REPOSITORY:valerol/ep_dashboard@main
    retention: ALL_VERSIONS_RETAINED_IN_GIT_HISTORY
    destructive_history_rewrite: DENY
  rollback:
    mechanism: STANDARD_GIT_OR_GITHUB_VERSION_CONTROL_PROCESS
    required_properties:
      - PREVIOUS_VERSION_REMAINS_IN_HISTORY
      - ROLLBACK_IS_TRACEABLE_BY_COMMIT_OR_EQUIVALENT_GIT_HISTORY
      - CURRENT_CANONICAL_STATE_IS_MAIN_AFTER_ACCEPTED_ROLLBACK
    protocol_specific_parallel_rollback_registry: NOT_REQUIRED
  unresolved_part:
    - SIGNIFICANT_EVIDENCE_DECISION_RULE
  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

Все версии изменяемых инструкций и протоколов сохраняются средствами Git/GitHub. Отдельный срок хранения для protocol history не устанавливается. Ошибочное изменение отменяется штатным процессом Git/GitHub с сохранением трассируемой истории; специальный параллельный механизм rollback внутри EP-DP не создаётся. `EPDP-OI-024` закрыт решением `EP-DP-DR-011`; retention/rollback ранее определены `EP-DP-DR-010`, source of truth — `EP-DP-DR-009`.

### 0.15 / OBSERVATION.SIGNIFICANT.EVIDENCE.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-011
  decided_at: 2026-08-07
  authority: OWNER_LPR
  applies_to: EPDP-OI-024
  resolution_scope: COMPLETE
  significant_evidence_rule:
    closed_type_whitelist: NONE
    automatic_sufficiency_by_media_type: DENY
    automatic_protocol_change: DENY
    decision_authority: OWNER_LPR
    decision_basis: EVIDENCE_IMPACT_ON_A_SPECIFIC_RULE_OR_INSTRUCTION
    minimum_record:
      - evidence_ref
      - affected_rule_or_instruction_ref
      - significance_decision
      - decision_basis
      - decided_by
      - decided_at
    candidate_significance_indicators:
      - CURRENT_RULE_PROVEN_FALSE
      - CURRENT_RULE_PROVEN_INCOMPLETE
      - NEW_CONSTRAINT_APPEARED
      - KNOWN_RISK_OR_CONTROL_CHANGED
      - REPEATED_EVENT_JUSTIFIES_GENERAL_RULE
    single_event:
      may_be_sufficient: true
      automatic_generalization: false
  change_governance:
    protocol_change_requires:
      - CONFIRMED_EVIDENCE
      - OWNER_LPR_SIGNIFICANCE_DECISION
      - IDENTIFIED_AFFECTED_RULE_OR_INSTRUCTION
      - IMPACT_MAP
      - VERSIONED_CHANGE
    history_retention: EP-DP-DR-010
    rollback_mechanism: EP-DP-DR-010
    source_of_truth: EP-DP-DR-009
  resolution_result:
    EPDP-OI-024: RESOLVED
  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

Тип носителя evidence — документ, письмо, акт, фото, видео, отчёт, статистика или иной источник — сам по себе не определяет достаточность. `OWNER_LPR` принимает контекстное решение о значимости относительно конкретного правила или инструкции и фиксирует основание. Единичное evidence может быть достаточным, если его доказательная сила достаточна для конкретного изменения, но не обобщается автоматически в новую норму. Протокол не меняется автоматически: даже подтверждённое evidence требует решения `OWNER_LPR`, impact map и версионированного изменения. Вместе с `EP-DP-DR-009` и `EP-DP-DR-010` это полностью закрывает `EPDP-OI-024`.


### 0.16 / INDEPENDENT.CONTROL.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-012
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-012
  scope: INDEPENDENT_CONTROL_METHOD_SELECTION
  principle: CONTROL_METHOD_DEPENDS_ON_ACTION_CHARACTERISTICS
  allowed_modes:
    TIME_SEPARATED_SELF_RECHECK:
      use_if:
        - ACTION_IS_INTERNALLY_VERIFIABLE
        - ERROR_COST_IS_ACCEPTABLE
        - SPECIALIST_AUTHORITY_NOT_REQUIRED
      separation_requirement:
        - SEPARATE_CONTROL_ACT
        - SEPARATE_TIMESTAMP
        - SEPARATE_CONTROL_EVIDENCE
      fixed_time_gap: NOT_REQUIRED
    ISOLATED_LLM_REVIEW:
      use_if:
        - TASK_IS_ANALYTICAL_OR_COMPARATIVE
        - SOURCE_DATA_AND_CONTROL_CRITERIA_CAN_BE_SUPPLIED_INDEPENDENTLY
        - PROFESSIONAL_AUTHORITY_IS_NOT_REQUIRED
      isolation_requirement:
        - REVIEW_CONTEXT_DOES_NOT_MERELY_CONTINUE_EXECUTION_REASONING
        - SOURCE_DATA_AND_CONTROL_CRITERIA_ARE_SUPPLIED_TO_REVIEW
        - REVIEW_RESULT_IS_RECORDED_SEPARATELY
      authority_limit: ADVISORY_CONTROL_EVIDENCE_ONLY
    EXTERNAL_SPECIALIST_REVIEW:
      use_if:
        - SPECIALIZED_PROFESSIONAL_JUDGMENT_REQUIRED
        - ERROR_HAS_HIGH_EXTERNAL_OR_LEGAL_COST
        - OWNER_LPR_CANNOT_INDEPENDENTLY_VERIFY_RESULT
      authority_limit: ADVISORY_UNLESS_EXPLICIT_AUTHORITY_IS_REQUIRED_OR_DELEGATED
  selection_factors:
    - ERROR_COST
    - REVERSIBILITY
    - INTERNAL_VERIFIABILITY
    - SPECIALIZED_KNOWLEDGE_REQUIRED
    - EXTERNAL_OR_LEGAL_CONSEQUENCE
  stronger_control_rule: IF_MULTIPLE_FACTORS_CONFLICT -> SELECT_STRONGER_APPLICABLE_MODE
  decision_authority:
    control_method_selection: OWNER_LPR
    final_control_decision: OWNER_LPR
    final_control_decision_values: [CONFIRM, HOLD, STOP]
  invariants:
    - CONTROL_REVIEW != ORIGINAL_EXECUTION
    - CONTROL_EVIDENCE != ORIGINAL_EXECUTION_EVIDENCE_ONLY
    - LLM_REVIEW_DOES_NOT_REPLACE_REQUIRED_PROFESSIONAL_AUTHORITY
    - EXTERNAL_REVIEW_DOES_NOT_TRANSFER_OWNER_LPR_DECISION_AUTHORITY_WITHOUT_EXPLICIT_DELEGATION
  runtime_verification:
    control_method_execution: NOT_YET_TESTED
    evidence_recording: INTERNAL_QA_REQUIRED
  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

Независимость контроля определяется не постоянным вторым контролёром, а отделением контрольного акта от исходного исполнения и выбором метода по характеристикам действия. Для внутренне проверяемых и обратимых действий допустима разнесённая по времени самопроверка; для аналитической проверки — изолированный LLM-review; для задач, требующих специальной квалификации или имеющих высокую внешнюю/юридическую цену ошибки, — внешний специалист. LLM и специалист формируют контрольное evidence, но не подменяют решение `OWNER_LPR`, если отдельное полномочие явно не установлено. Фактическая эффективность режимов проверяется в Internal QA/runtime и не входит в closure scope `EPDP-OI-012`.

### 0.17 / E2.MIN.PRICE.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-013
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-007
  scope: E2_MIN_PRICE_GATE
  baseline_calculation_date: 2026-07-16
  target_profit_per_unit: 500 RUB
  repeatable_unit_cost: 510.17 RUB
  required_net_receipt: 1010.17 RUB
  ozon_net_share: 34.94 PERCENT
  calculated_customer_price_source_record: 2891.48 RUB
  recomputed_from_displayed_rounded_inputs: 2891.16 RUB
  rounding_difference: 0.32 RUB
  minimum_customer_price_after_ozon_discounts: 2900 RUB
  practical_operating_price: 2990 RUB
  conservative_loss_scenario:
    assumption: REPEAT_LOSS_RATE_4_OF_30
    minimum_customer_price_after_ozon_discounts: 3120 RUB
    practical_operating_price: 3190 RUB
  violation_rule:
    condition: ACTUAL_CUSTOMER_PRICE_AFTER_OZON_DISCOUNTS < 2900_RUB
    result: MIN_PRICE_RULE_FAILED
    next: REPAIR
  source_of_truth_ref: EP-DP-DR-009
  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

`2900 RUB` — базовый E2 minimum gate. `2990 RUB` — операционная цена, не отдельный минимум. Сценарий `3120/3190 RUB` применяется только при допущении повторения потерь `4/30`. Изменение исходных затрат, доли удержаний Ozon или целевой прибыли требует нового расчёта E2; это не изменяет настоящий baseline задним числом.


### 0.18 / E4.RESERVE.PARTIAL.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-014
  decided_at: 2026-08-07
  authority: OWNER_LPR
  partially_resolves: EPDP-OI-008
  scope: E4_MINIMUM_CASH_RESERVE
  reserve:
    basis: CONFIRMED_SALES_REVENUE_AFTER_RETURNS
    rate: 10 PERCENT
    formula: RESERVE_AMOUNT = 0.10 * CONFIRMED_SALES_REVENUE_AFTER_RETURNS
    calculation_period: EACH_SETTLEMENT_PERIOD
    allocation_priority: BEFORE_REINVESTMENT
    release_authority: OWNER_LPR
  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

`EP-DP-DR-014` определил резервную часть `E4`. Полное закрытие `EPDP-OI-008` оформлено последующим `EP-DP-DR-015`.

### 0.19 / E4.ALLOCATION.AND.RESERVE.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-015
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-008
  scope: E4_ALLOCATION_AND_RESERVE

  reserve:
    basis: CONFIRMED_SALES_REVENUE_AFTER_RETURNS
    rate: 10 PERCENT
    formula: RESERVE_AMOUNT = 0.10 * CONFIRMED_SALES_REVENUE_AFTER_RETURNS
    calculation_period: EACH_SETTLEMENT_PERIOD
    allocation_priority: BEFORE_REINVESTMENT
    release_authority: OWNER_LPR

  allocation_order:
    - MANDATORY_OBLIGATIONS
    - RESERVE_10_PERCENT
    - CRITICAL_REPAIR_OR_COMPLIANCE
    - NEXT_BATCH_REPLENISHMENT
    - GROWTH

  distributable_envelope:
    formula: max(0, ACTUAL_LIQUID_CASH - COMMITTED_LIABILITIES - RESERVE_AMOUNT)
    downstream_rule: EACH_LOWER_PRIORITY_ALLOCATION_USES_ONLY_REMAINDER_AFTER_HIGHER_PRIORITY_REQUIREMENTS
    shortage_rule: IF_ENVELOPE_EXHAUSTED -> LOWER_PRIORITY_ALLOCATION = 0_OR_PARTIAL

  priority_invariants:
    - MANDATORY_OBLIGATIONS_BEFORE_DISCRETIONARY_USE
    - RESERVE_BEFORE_REINVESTMENT
    - CRITICAL_REPAIR_OR_COMPLIANCE_BEFORE_NEXT_BATCH
    - NEXT_BATCH_REPLENISHMENT_BEFORE_GROWTH
    - GROWTH_USES_ONLY_FINAL_REMAINDER

  control_example:
    type: TEST_FIXTURE_NOT_BUSINESS_FACT
    CONFIRMED_SALES_REVENUE_AFTER_RETURNS: 100000 RUB
    ACTUAL_LIQUID_CASH: 100000 RUB
    COMMITTED_LIABILITIES: 20000 RUB
    RESERVE_AMOUNT: 10000 RUB
    ENVELOPE_AFTER_OBLIGATIONS_AND_RESERVE: 70000 RUB
    CRITICAL_REPAIR_OR_COMPLIANCE_REQUIREMENT: 15000 RUB
    ENVELOPE_AFTER_REPAIR_OR_COMPLIANCE: 55000 RUB
    NEXT_BATCH_REPLENISHMENT_REQUIREMENT: 40000 RUB
    ENVELOPE_AFTER_NEXT_BATCH: 15000 RUB
    GROWTH_ALLOCATION: 15000 RUB
    CHECK_SUM: 100000 RUB

  source_of_truth_ref: EP-DP-DR-009
  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

`E4` теперь определяет минимальный денежный резерв, порядок распределения и доступный envelope. Фактические суммы каждого периода являются runtime data и не входят в design closure `EPDP-OI-008`.

### 0.20 / E1.BATCH.LAUNCH.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-016
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-006
  scope: E1_BATCH_LAUNCH_GATE

  required_preconditions:
    - E2_MIN_PRICE_GATE_PASSED
    - NO_BLOCKING_COMPLIANCE_DEFECT
    - NO_CRITICAL_REPAIR_THAT_FORBIDS_BATCH_LAUNCH
    - FULL_KNOWN_BATCH_COST_CALCULATED

  funding_rule:
    available_funding_formula: AVAILABLE_CASH_AFTER_E4 + CONFIRMED_INVESTMENT_CAPITAL_ALLOCATED_TO_BATCH
    launch_if: AVAILABLE_FUNDING >= FULL_KNOWN_BATCH_COST
    deny_or_hold_if: AVAILABLE_FUNDING < FULL_KNOWN_BATCH_COST

  investment_continuity_exception:
    purpose: PREVENT_ECONOMIC_CYCLE_STOP_DUE_TO_STOCKOUT
    trigger: INTERNAL_CASH_INSUFFICIENT_AND_STOCKOUT_RISK_PRESENT
    action: SEEK_INVESTMENT_CAPITAL
    purchase_status_until_funding_confirmed: HOLD
    investment_counts_as_available_only_if:
      - AMOUNT_CONFIRMED
      - FUNDS_COMMITTED_OR_AVAILABLE
      - TERMS_AND_ASSOCIATED_OBLIGATIONS_RECORDED
      - OWNER_LPR_ACCEPTED
    after_confirmation: ADD_TO_AVAILABLE_FUNDING_AND_RECHECK_E1

  invariants:
    - INVESTMENT_DOES_NOT_BYPASS_E2
    - INVESTMENT_DOES_NOT_BYPASS_COMPLIANCE
    - INVESTMENT_DOES_NOT_CONSUME_E4_RESERVE_BY_DEFAULT
    - STOCKOUT_RISK_MAY_TRIGGER_FINANCING_BUT_NOT_UNFUNDED_PURCHASE

  evidence:
    - batch_cost_calculation
    - E2_gate_result
    - E4_available_cash_result
    - investment_confirmation_if_used
    - launch_decision

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

`E1` разрешает запуск партии при полном покрытии известной стоимости собственным доступным cash после `E4` и/или подтверждённым инвестиционным капиталом. Риск отсутствия товара может инициировать привлечение инвестиций, но до подтверждения финансирования закупка остаётся `HOLD`.

### 0.21 / I3.CONSUMABLES.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-017
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-013
  scope: I3_CONSUMABLES_MINIMUM_AND_SHORTAGE_RULE

  check_point:
    initial: AFTER_I2_BATCH_COMPOSITION_AND_VOLUME_CONFIRMED
    final_gate: BEFORE_LR4_PRODUCT_PREPARATION

  minimum_stock:
    basis: PLANNED_CONSUMABLE_NEED_FOR_NEXT_BATCH
    safety_buffer: 10 PERCENT
    formula_per_consumable: REQUIRED_QTY = CEIL(PLANNED_NEXT_BATCH_NEED * 1.10)
    unit: NATIVE_CONSUMABLE_UNIT

  evidence_contract:
    sufficient_if_any_applicable:
      - PHYSICAL_STOCK_COUNT_WITH_TIMESTAMP
      - PURCHASE_OR_REPLENISHMENT_RECORD
    lr4_ready_requires: PHYSICAL_AVAILABLE_QTY >= REQUIRED_QTY

  shortage_rule:
    condition: PHYSICAL_AVAILABLE_QTY < REQUIRED_QTY
    action: REPLENISH
    lr4_transition: HOLD_UNTIL_PHYSICAL_AVAILABLE_QTY >= REQUIRED_QTY

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

`I3` проверяется после фиксации состава и объёма партии в `I2`. Для каждого расходника требуется плановая потребность следующей партии плюс `10%` safety buffer с округлением вверх до целой применимой единицы. Заявка на пополнение подтверждает действие по устранению дефицита, но не открывает `L(R)4`: перед `L(R)4` требуемое количество должно быть физически доступно.

### 0.22 / I5.SUPPLIER.TO.CARRIER.HANDOFF.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-018
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-014
  scope: I5_SUPPLIER_TO_CARRIER_HANDOFF

  current_observed_workflow:
    supplier_action: DELIVER_PARCEL_TO_INTERNATIONAL_CARRIER
    owner_pickup_request: NOT_USED
    owner_receives_from_supplier:
      - SUPPLIER_TRACKING_NUMBER
      - PARCEL_PHOTO

  I5_complete_if:
    - SUPPLIER_DISPATCH_CONFIRMED
    - SUPPLIER_TRACKING_NUMBER_RECORDED
    - PARCEL_PHOTO_RECORDED

  alternate_workflow: NOT_OBSERVED

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

### 0.23 / LI2.CARRIER.PAYMENT.AND.TRACKING.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-019
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-015
  scope: LI2_CARRIER_PAYMENT_AND_INTERNATIONAL_TRACKING

  precondition:
    - PARCEL_AT_INTERNATIONAL_CARRIER_CONFIRMED
    - RECEIPT_POINT_AGREED

  required_sequence:
    1: CARRIER_ISSUES_INVOICE
    2: OWNER_LPR_PAYS_INVOICE
    3: CARRIER_PROVIDES_INTERNATIONAL_TRACKING_NUMBER

  complete_if:
    - CARRIER_INVOICE_RECEIVED
    - PAYMENT_CONFIRMED
    - INTERNATIONAL_TRACKING_NUMBER_RECEIVED

  evidence:
    - CARRIER_INVOICE
    - PAYMENT_CONFIRMATION
    - INTERNATIONAL_TRACKING_NUMBER

  incomplete_rule:
    if_any_required_element_missing: HOLD

  alternate_workflow: NOT_OBSERVED

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

`L(I)2` считается завершённым только после получения счёта перевозчика, подтверждённой оплаты и получения международного tracking number. До выполнения всех трёх условий переход остаётся `HOLD`.

### 0.24 / LR1.RECOUNT.AND.DEVIATION.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-020
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-016
  scope: LR1_RECOUNT_AND_DEVIATION

  recount:
    all_received_units: true
    sku_identification: VISIBLE_COLOR_PATTERN_MATCHED_TO_ORDER_SKU_BY_OWNER_MEMORY

  original_garment_packaging:
    default: KEEP_SEALED
    open_if:
      - PHOTO_REQUIRED
      - ORIGINAL_PACKAGING_DAMAGED

  garment_damage_check:
    if_original_packaging_intact: NOT_INSPECTED
    if_original_packaging_damaged: OPEN_AND_INSPECT_GARMENT

  deviation_policy:
    tolerance: NOT_APPLICABLE
    use_actual_received_goods_as_working_input: true
    any_quantity_or_assortment_deviation:
      - RECORD_INCIDENT
      - DISCUSS_WITH_SUPPLIER
    shortage_escalation:
      - CONTACT_SUPPLIER
      - IF_UNRESOLVED_CONTACT_CARRIER
    extra_unit:
      - INFORM_SUPPLIER

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

`L(R)1` не использует порог допустимого расхождения. Фактически полученный товар становится рабочим входом следующего контура; любое количественное или ассортиментное расхождение фиксируется как инцидент и обсуждается с поставщиком. При повреждённой оригинальной упаковке товар вскрывается и проверяется; при целой упаковке повреждение одежды не проверяется.

### 0.25 / LR2.MARKING.ACCEPTANCE.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-021
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-017
  scope: LR2_MARKING_ACCEPTANCE

  system: CHESTNY_ZNAK
  acceptance_object: PRODUCT_UNIT
  acceptance_status: "В ОБОРОТЕ"

  complete_if:
    - PRODUCT_UNIT_STATUS_IN_CHESTNY_ZNAK == "В ОБОРОТЕ"

  otherwise:
    transition_decision: HOLD

  evidence:
    source: CHESTNY_ZNAK
    required:
      - PRODUCT_UNIT_IDENTIFIER
      - OBSERVED_STATUS
      - CHECKED_AT

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

`L(R)2` считается принятым системой только когда соответствующая товарная единица имеет статус `«в обороте»` в системе «Честный Знак». Иной или неподтверждённый статус означает `HOLD`.

### 0.26 / EXTERNAL.HOLD.TIMEOUT.ESCALATION.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-022
  decided_at: 2026-08-07
  authority: OWNER_LPR
  partially_resolves: EPDP-OI-018
  scope: EXTERNAL_WAIT_TIMEOUT_ESCALATION_AND_FALLBACK_DEFAULT

  universal_fixed_timeout: NONE
  timeout_authority: OWNER_LPR
  timeout_basis: CASE_SPECIFIC

  on_expected_external_result_missing:
    transition_decision: HOLD
    sequence:
      - OWNER_LPR_DEFINES_CASE_SPECIFIC_DEADLINE
      - WAIT_UNTIL_DEADLINE
      - IF_DEADLINE_EXCEEDED_REPEAT_REQUEST
      - IF_STILL_UNRESOLVED_USE_FALLBACK_OR_ALTERNATIVE_EXECUTOR_IF_AVAILABLE

  fallback_absent:
    effect: HOLD_REMAINS
    next_action: OWNER_LPR_DECISION

  evidence:
    - EXPECTED_RESULT
    - CASE_SPECIFIC_DEADLINE
    - REQUEST_OR_FOLLOWUP_REF
    - RESPONSE_OR_NO_RESPONSE_STATE
    - FALLBACK_ACTION_IF_USED

  unresolved_within_EPDP_OI_018:
    - COMPLETE_ALL_12_INTERFACE_CARDS
    - ASSIGN_ACCEPTANCE_OWNER_PER_INTERFACE
    - ASSIGN_DEADLINE_OR_DEADLINE_RULE_PER_INTERFACE
    - ASSIGN_COST_OR_NA_PER_INTERFACE
    - ASSIGN_DEVIATION_ACTION_PER_INTERFACE
    - ASSIGN_FALLBACK_PER_INTERFACE

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

Общий фиксированный таймаут для внешних функций не вводится. Допустимый срок задаётся `OWNER_LPR` по конкретной ситуации. После превышения срока выполняется повторный запрос; затем используется fallback или альтернативный исполнитель, если он существует. При отсутствии fallback сохраняется `HOLD` до решения `OWNER_LPR`.


### 0.27 / DEPENDENT.INTERNAL.INTERFACE.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-023
  decided_at: 2026-08-07
  authority: OWNER_LPR
  partially_resolves: EPDP-OI-018
  scope: DEPENDENT_INTERNAL_INTERFACE_DEFAULT

  applies_if:
    - CONSUMER_OPER_REQUIRES_PRODUCER_OPER_RESULT

  does_not_apply_if:
    - OPER_BRANCHES_ARE_INDEPENDENT
    - PARALLEL_EXECUTION_IS_EXPLICITLY_ALLOWED

  acceptance_owner: OWNER_LPR
  deadline_rule: BEFORE_CONSUMER_OPER_START
  cost_or_na: N/A

  invalid_or_missing_required_result:
    transition_decision: HOLD
    deviation_action: RETURN_TO_PRODUCER_OPER_FOR_CORRECTION
    fallback: PRODUCER_OPER_CORRECTION_OR_OWNER_LPR_CASE_DECISION

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

Правило применяется только при фактической зависимости следующего oper от результата предыдущего. Независимая или явно разрешённая параллельная ветвь не блокируется этим default.

### 0.28 / SHIPPING.COST.ESTIMATION.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-024
  decided_at: 2026-08-07
  authority: OWNER_LPR
  partially_resolves: EPDP-OI-018
  scope: SHIPPING_INTERFACE_COST_ESTIMATION

  observed_batches:
    - quantity_units: 30
      supplier_to_carrier_shipping_thb: 100
      international_carrier_thb: 2630
      total_shipping_thb: 2730
      total_shipping_per_unit_thb: 91
    - quantity_units: 75
      supplier_to_carrier_shipping_thb: 190
      international_carrier_thb: 6260
      total_shipping_thb: 6450
      total_shipping_per_unit_thb: 86

  empirical_model:
    validity: ESTIMATE_FROM_TWO_OBSERVED_BATCHES
    predictor: BATCH_QUANTITY_UNITS
    observed_range_units: [30, 75]
    supplier_to_carrier_shipping_thb: 40 + 2 * Q
    international_carrier_thb: 210 + 80.6667 * Q
    total_shipping_thb: 250 + 82.6667 * Q

  use_if:
    - SHIPPING_METHOD_UNCHANGED
    - SAME_ROUTE_AND_SERVICE_CLASS
    - NO_KNOWN_EXCEPTIONAL_SURCHARGE

  cost_state_before_invoice: ESTIMATED
  cost_state_after_invoice: ACTUAL
  actual_invoice_supersedes_estimate_for_accounting: true
  preserve_estimate_and_forecast_error: true

  outside_observed_range_or_method_changed:
    state: PROVISIONAL_ESTIMATE_OR_PENDING
    authority: OWNER_LPR

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

По двум фактическим партиям стоимость доставки масштабируется с объёмом партии. Для неизменного способа перевозки неизвестная будущая стоимость не маркируется автоматически как `PENDING`: до счёта используется `ESTIMATED`, после счёта — `ACTUAL`. Модель является эмпирической по двум наблюдениям и не объявляется тарифом перевозчика.

### 0.29 / INTERFACE.ACCEPTANCE.AUTHORITY.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-025
  decided_at: 2026-08-07
  authority: OWNER_LPR
  partially_resolves: EPDP-OI-018
  scope: ALL_12_INTERFACE_ACCEPTANCE_AUTHORITY

  acceptance_owner: OWNER_LPR
  external_status_or_document_role: EVIDENCE
  external_result_auto_acceptance: false
  acceptance_effect:
    CONFIRM: RESULT_ACCEPTED_FOR_NEXT_ALLOWED_DEPENDENT_TRANSITION
    HOLD: RESULT_NOT_YET_ACCEPTED_OR_INSUFFICIENT
    STOP: CRITICAL_DEFECT_DETECTED

  delegation:
    allowed_only_if: EXPLICIT_OWNER_LPR_DELEGATION
    current_state: NONE

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

Для всех двенадцати интерфейсов внешняя система или подрядчик формирует результат и evidence, но решение о достаточности результата принимает `OWNER_LPR`. Это правило не заполняет остальные поля карточек (`evidence`, `deadline`, `cost_or_na`, `deviation_action`, `fallback`).

### 0.30 / INTERFACE.EVIDENCE.SELECTION.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-026
  decided_at: 2026-08-07
  authority: OWNER_LPR
  partially_resolves: EPDP-OI-018
  scope: ALL_12_INTERFACE_EVIDENCE_SELECTION

  evidence_rule:
    preferred: DOCUMENTARY_OR_SYSTEM_EVIDENCE_WHEN_AVAILABLE
    fallback_if_documentary_evidence_objectively_unavailable: OWNER_LPR_CONFIRMATION
    exact_evidence_type: OPER_OR_INTERFACE_SPECIFIC
    universal_evidence_list: NONE

  owner_confirmation:
    role: FALLBACK_EVIDENCE
    condition: DOCUMENTARY_OR_SYSTEM_EVIDENCE_NOT_REASONABLY_AVAILABLE
    must_identify: [OPER_OR_INTERFACE, RESULT_CONFIRMED, CONFIRMED_AT]

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

Общее правило не назначает одинаковое evidence всем opers. Для каждого oper/interface его evidence определяется отдельно. При наличии документального или системного подтверждения используется оно; при объективном отсутствии такого подтверждения допустимо явное подтверждение `OWNER_LPR`.


### 0.31 / INTERFACE.DEVIATION.ACTION.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-027
  decided_at: 2026-08-07
  authority: OWNER_LPR
  partially_resolves: EPDP-OI-018
  scope: ALL_12_INTERFACE_DEVIATION_ACTIONS

  deviation_default:
    if_result_incomplete_or_wrong:
      - HOLD
      - CORRECT_OR_REDO
      - RECHECK
    exact_corrective_action: OPER_OR_INTERFACE_SPECIFIC

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

Общий deviation route един для всех интерфейсов: неполный или ошибочный результат блокирует зависимый переход; результат исправляется или формируется повторно и затем проходит повторную проверку. Конкретное восстановительное действие определяется соответствующим oper/interface.

### 0.32 / INTERFACE.FALLBACK.AND.CONTRACT.COMPLETION.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-028
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-018
  scope: ALL_12_INTERFACE_CONTRACTS

  fallback_default:
    normal_route_failed:
      if_real_approved_alternative_exists: USE_ALTERNATIVE_ROUTE_OR_EXECUTOR
      otherwise:
        - HOLD_DEPENDENT_TRANSITION
        - OWNER_LPR_DECISION
    invented_or_unobserved_fallback: DENY

  inherited_defaults:
    acceptance_owner: EP-DP-DR-025 / OWNER_LPR
    evidence_selection: EP-DP-DR-026
    deviation_route: EP-DP-DR-027
    dependent_internal_deadline: EP-DP-DR-023 / BEFORE_CONSUMER_OPER_START
    external_wait: EP-DP-DR-022 / OWNER_LPR_CASE_SPECIFIC
    shipping_cost_estimation: EP-DP-DR-024

  interface_contracts:
    IF-01:
      producer_consumer: E1_TO_I1
      evidence: [BATCH_COST_CALCULATION, E2_GATE_RESULT, E4_AVAILABLE_CASH_RESULT, INVESTMENT_CONFIRMATION_IF_USED, LAUNCH_DECISION]
      deadline: BEFORE_I1_START
      cost_or_na: N/A
      deviation_action: HOLD_THEN_CORRECT_E1_INPUTS_OR_FUNDING_THEN_RECHECK
      fallback: SEEK_CONFIRMED_INVESTMENT_IF_INTERNAL_CASH_INSUFFICIENT_AND_STOCKOUT_RISK_ELSE_HOLD_OWNER_LPR_DECISION
    IF-02A:
      producer_consumer: I2_TO_I3
      evidence: [FINAL_APPLICATION_OR_ORDER_LIST, CONFIRMED_BATCH_QUANTITY]
      deadline: BEFORE_I3_DEPENDENT_CHECK
      cost_or_na: N/A
      deviation_action: HOLD_DEPENDENT_I3_THEN_CORRECT_I2_QUANTITY_OR_COMPOSITION_THEN_RECHECK
      fallback: NONE_OBSERVED__HOLD_OWNER_LPR_DECISION
    IF-02B:
      producer_consumer: I2_TO_I4
      evidence: [FINAL_APPLICATION, SUPPLIER_INVOICE]
      deadline: BEFORE_I4_PAYMENT
      cost_or_na: N/A
      deviation_action: HOLD_I4_THEN_RECONCILE_OR_REQUEST_CORRECTED_INVOICE_THEN_RECHECK
      fallback: NONE_OBSERVED__HOLD_OWNER_LPR_DECISION
    IF-03:
      producer_consumer: I5_TO_LI1
      evidence: [SUPPLIER_TRACKING_NUMBER, PARCEL_PHOTO]
      deadline: BEFORE_LI1_ARRIVAL_COORDINATION
      cost_or_na: SHIPPING_COST_REF_EP-DP-DR-024_ESTIMATED_TO_ACTUAL
      deviation_action: HOLD_DEPENDENT_ROUTE_THEN_REQUEST_MISSING_OR_CORRECTED_SUPPLIER_EVIDENCE_THEN_RECHECK
      fallback: NONE_OBSERVED__HOLD_OWNER_LPR_DECISION
    IF-04:
      producer_consumer: LI4_TO_LR1
      evidence: [RUSSIAN_RECEIPT_OR_TRANSPORT_DOCUMENT, PHYSICAL_RECEIPT_CONFIRMATION]
      deadline: BEFORE_LR1_RECOUNT
      cost_or_na: N/A_INTERFACE_HANDOFF
      deviation_action: HOLD_LR1_IF_RECEIPT_NOT_CONFIRMED_THEN_CORRECT_OR_RECONCILE_RECEIPT_EVIDENCE_THEN_RECHECK
      fallback: REAL_ALTERNATIVE_IF_EXISTS_ELSE_HOLD_OWNER_LPR_DECISION
    IF-05:
      producer_consumer: LR1_TO_LR2
      evidence: [OWNER_LPR_RECOUNT_RESULT, ORDER_LIST, INCIDENT_REF_IF_DEVIATION]
      deadline: BEFORE_LR2_MARKING_OF_AFFECTED_UNITS
      cost_or_na: N/A
      deviation_action: HOLD_AFFECTED_MARKING_THEN_COMPLETE_RECOUNT_OR_INCIDENT_RECORD_THEN_RECHECK
      fallback: WORK_WITH_ACTUAL_RECEIVED_GOODS_AFTER_RECOUNT_AND_INCIDENT_RECORD
    IF-06:
      producer_consumer: LR3_TO_LR4
      evidence: [PRINT_FILE_OR_LABEL_SET, CONTROL_SAMPLE_OR_OWNER_LPR_CONFIRMATION]
      deadline: BEFORE_LR4_APPLICATION_TO_AFFECTED_UNITS
      cost_or_na: N/A_INTERFACE_HANDOFF
      deviation_action: HOLD_LR4_THEN_REGENERATE_OR_REPRINT_LABELS_THEN_RECHECK
      fallback: NONE_OBSERVED__HOLD_OWNER_LPR_DECISION
    IF-07:
      producer_consumer: LR7_TO_S1
      evidence: [OZON_ACCEPTANCE_ACT_OR_SYSTEM_STATUS, OZON_STOCK_STATE]
      deadline: BEFORE_AFFECTED_BATCH_OR_SKU_IS_TREATED_AS_AVAILABLE_IN_S1
      cost_or_na: N/A_INTERFACE_HANDOFF
      deviation_action: HOLD_AFFECTED_BATCH_OR_SKU_THEN_RECONCILE_OZON_ACCEPTANCE_OR_STOCK_THEN_RECHECK
      fallback: OTHER_CONFIRMED_STOCK_MAY_CONTINUE__AFFECTED_BATCH_REMAINS_HOLD
    IF-08:
      producer_consumer: S2_TO_E3
      evidence: [OZON_ACT_OR_FINANCIAL_REPORT, BANK_RECEIPT_OR_PAYOUT_CONFIRMATION]
      deadline: BEFORE_FINAL_E3_CLOSURE
      cost_or_na: N/A_INTERFACE_HANDOFF
      deviation_action: HOLD_FINAL_E3_CLOSURE_THEN_OBTAIN_OR_RECONCILE_MISSING_FINANCIAL_DATA_THEN_RECHECK
      fallback: PARTIAL_E3_ANALYSIS_ALLOWED_WITHOUT_FINAL_CLOSURE
    IF-09:
      producer_consumer: E4_TO_E1
      evidence: [ALLOCATION_DECISION, AVAILABLE_RESOURCE_ENVELOPE]
      deadline: BEFORE_NEXT_E1_LAUNCH_DECISION
      cost_or_na: N/A
      deviation_action: HOLD_E1_THEN_REVISE_E4_ALLOCATION_OR_ENVELOPE_THEN_RECHECK
      fallback: NONE__HOLD_OWNER_LPR_DECISION
    IF-O1:
      producer_consumer: ANY_OPER_OR_PROJECT_TO_O1
      evidence: [ACTION_OR_EVENT_REF, SOURCE_REF_WHEN_AVAILABLE, OWNER_LPR_CONFIRMATION_IF_DOCUMENTARY_OR_SYSTEM_EVIDENCE_UNAVAILABLE, EVENT_TIME_IF_KNOWN]
      deadline: BEFORE_COMMITTED_O1_CLASSIFICATION_AND_DEPENDENT_OBSERVATION_ROUTE
      cost_or_na: N/A
      deviation_action: HOLD_CLASSIFICATION_IF_INPUT_OR_BASIS_INSUFFICIENT_THEN_COMPLETE_OR_CORRECT_INPUT_THEN_RECHECK
      fallback: OWNER_LPR_CONFIRMATION_IF_DOCUMENTARY_OR_SYSTEM_EVIDENCE_OBJECTIVELY_UNAVAILABLE
    IF-O5:
      producer_consumer: O5_TO_AFFECTED_PROTOCOL_OR_INSTRUCTION
      evidence: [EVIDENCE_REF, CHANGE_CARD, IMPACT_MAP, VERSION_DIFF, OWNER_LPR_APPROVAL]
      deadline: BEFORE_NEW_PROTOCOL_OR_INSTRUCTION_VERSION_BECOMES_CANONICAL_IN_MAIN
      cost_or_na: N/A
      deviation_action: HOLD_ACTIVATION_THEN_CORRECT_CHANGE_PACKAGE_THEN_RECHECK
      fallback: PREVIOUS_CANONICAL_VERSION_REMAINS_ACTIVE

  closure_result:
    EPDP-OI-018: RESOLVED
    all_12_cards_have: [ACCEPTANCE_OWNER, EVIDENCE, DEADLINE, COST_OR_NA, DEVIATION_ACTION, FALLBACK]

  lifecycle_effect:
    physiology_transition: NONE
    oper_transitions: NONE
```

Общий fallback не требует искусственного резервного маршрута. Если фактически существует подтверждённая альтернатива, она может быть выбрана `OWNER_LPR`; если альтернативы нет, зависимый переход остаётся `HOLD`. Все 12 интерфейсных карточек инстанцируют ранее утверждённые defaults и oper-specific evidence; interface cost не смешивается с cost самого oper, а shipping interfaces ссылаются на эмпирическую модель `EP-DP-DR-024`.


### 0.33 / DEMAND.ASSORTMENT.CATALOG.OPERS.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-029
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-002
  source: OWNER_LPR_CONFIRMATION_OF_ACTUAL_PROCESS

  A1:
    oper_id: A1
    name: FORM_EP_ASSORTMENT
    lifecycle_state: CANDIDATE
    before_state:
      - MARKET_DEMAND_SIGNALS_AVAILABLE
      - SUPPLIER_OFFER_AVAILABLE
    trigger:
      - ASSORTMENT_REVIEW
      - REPLENISHMENT_NEED
      - NEW_SUPPLIER_OFFER
      - MATERIAL_MARKET_SIGNAL
    agency_ref: OWNER_LPR
    action:
      - COMPARE_MARKET_DEMAND_SIGNALS_WITH_SUPPLIER_OFFER
      - SELECT_ITEMS_FOR_EP_ASSORTMENT
      - WRITE_OR_UPDATE_EP_ASSORTMENT_REGISTER
    after_state:
      - EP_ASSORTMENT_REGISTER_CURRENT
    evidence_contract:
      preferred: DOCUMENTARY_OR_SYSTEM_EVIDENCE
      fallback: OWNER_LPR_CONFIRMATION
      minimum:
        - ASSORTMENT_DECISION
        - SUPPLIER_OFFER_REF_IF_AVAILABLE
        - MARKET_SIGNAL_REF_IF_AVAILABLE
    value_or_risk_gate:
      VALUE_FILTER: INACTIVE_PENDING_EPDP_OI_009
      FACTUAL_CLAIMS: EVIDENCE_REQUIRED
    transition_refs:
      - A1_TO_E1
      - A1_TO_A2_WHEN_PRODUCT_DATA_AVAILABLE
    memory_write_refs:
      - data/ep-domain/entities/sku/
      - data/ep-domain/entities/decisions/
    cost: N/A
    micro_closure:
      - EP_ASSORTMENT_REGISTER_UPDATED
      - OWNER_LPR_ACCEPTED

  A2:
    oper_id: A2
    name: CREATE_OR_UPDATE_OZON_PRODUCT_CARD
    lifecycle_state: CANDIDATE
    before_state:
      - ITEM_PRESENT_IN_EP_ASSORTMENT_REGISTER
      - REQUIRED_PRODUCT_DATA_AVAILABLE
    trigger:
      - SELECTED_ITEM_HAS_NO_CURRENT_OZON_CARD
      - PRODUCT_DATA_OR_CONTENT_CHANGED
    agency_ref: OWNER_LPR
    action:
      - CREATE_OR_UPDATE_PRODUCT_CARD
      - PUBLISH_OR_UPDATE_OZON_CATALOG_PROJECTION
    after_state:
      - REQUIRED_OZON_PRODUCT_CARD_CURRENT
    evidence_contract:
      preferred:
        - OZON_SYSTEM_STATUS
        - PRODUCT_CARD_REF
        - DOCUMENTARY_OR_SYSTEM_EVIDENCE
      fallback: OWNER_LPR_CONFIRMATION
    value_or_risk_gate:
      FACTUAL_CLAIMS: EVIDENCE_REQUIRED
      VALUE_FILTER: INACTIVE_PENDING_EPDP_OI_009
    transition_refs:
      - A2_TO_S1
    runtime_gate:
      S1_HOLD_IF: REQUIRED_PRODUCT_CARD_MISSING_OR_NOT_CURRENT
    execution_relation:
      may_run_parallel_with: [PROCUREMENT, LOGISTICS]
      must_complete_before: S1_FOR_AFFECTED_SKU
    memory_write_refs:
      - data/ep-domain/entities/sku/
      - data/ep-domain/entities/decisions/
    cost: N/A
    micro_closure:
      - OZON_PRODUCT_CARD_CURRENT
      - OWNER_LPR_ACCEPTED

  invariants:
    - A1_SELECTION != SUPPLIER_OFFER
    - A2_PUBLICATION != A1_ASSORTMENT_DECISION
    - VALUE_CRITERIA_DEFINITION_REMAINS_EPDP_OI_009
    - NEW_OPERS_DO_NOT_PROMOTE_LIFECYCLE_AUTOMATICALLY

  lifecycle_effect:
    A1: CANDIDATE
    A2: CANDIDATE
    PHYSIOLOGY: CANDIDATE
```

`A1` фиксирует внутреннее решение «что продавать». `A2` фиксирует отдельное действие «создать или обновить карточку выбранного товара на Ozon». `A2` не обязан ждать завершения всей закупочно-логистической цепочки, но карточка соответствующего SKU должна быть актуальна до запуска продаж `S1`. Критерии ценностного отбора не определяются этим решением и остаются в `EPDP-OI-009`.

### 0.34 / RETURNS.OPER.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-030
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-003
  source: OWNER_LPR_CONFIRMATION_PLUS_OZON_EXTERNAL_STATUS_MODEL

  S3:
    oper_id: S3
    name: PROCESS_OZON_RETURN
    lifecycle_state: CANDIDATE
    before_state:
      - CUSTOMER_RETURN_REGISTERED_BY_OZON
      - RETURN_PHYSICALLY_ROUTED_TO_OZON_WAREHOUSE
    trigger: CUSTOMER_RETURN
    agency_ref: OWNER_LPR
    external_participant: EXT-05
    external_classification_owner: OZON
    external_internal_inspection_method: UNKNOWN
    action:
      - OBSERVE_OZON_RETURN_STATUS
      - OBSERVE_RESULTING_STOCK_OR_DISPOSITION_STATUS
      - IF_SALEABLE_RETURN_TO_OZON_STOCK_AND_AVAILABLE_FOR_SALE
      - IF_UNSALEABLE_FOLLOW_OZON_REPORTED_DISPOSITION
      - IF_RETURNED_TO_SELLER_OWNER_LPR_PHYSICALLY_INSPECTS_RETURNED_ITEM
      - OBSERVE_FINANCIAL_EFFECT_IN_OZON_REPORTING
    unsaleable_disposition_observed_model:
      - RETURN_TO_SELLER
      - WRITE_OFF_OR_DISPOSAL
    financial_accounting:
      executor: OZON
      ep_action: OBSERVE_OZON_REPORTS
    after_state:
      - RETURN_STATUS_CLASSIFIED_BY_OZON
      - STOCK_OR_DISPOSITION_STATE_RECORDED
      - FINANCIAL_EFFECT_REFLECTED_IN_OZON_REPORTING
    evidence_contract:
      preferred:
        - OZON_RETURN_STATUS
        - OZON_STOCK_OR_DISPOSITION_STATUS
        - OZON_FINANCIAL_REPORT
      conditional:
        RETURNED_TO_SELLER: OWNER_LPR_PHYSICAL_INSPECTION_RESULT
      fallback: OWNER_LPR_CONFIRMATION_IF_DOCUMENTARY_OR_SYSTEM_EVIDENCE_OBJECTIVELY_UNAVAILABLE
    transition_refs:
      - S3_TO_S1_IF_SALEABLE_AND_RESTOCKED
      - S3_TO_INCIDENT_OR_DISPOSITION_IF_UNSALEABLE
      - S3_TO_E3_FINANCIAL_RECONCILIATION
    memory_write_refs:
      - data/ep-domain/entities/stock/
      - data/ep-domain/entities/sales/
      - data/ep-domain/entities/incidents/
    cost: OZON_REPORT_DERIVED_OR_NA
    micro_closure:
      - RETURN_STATUS_RECORDED
      - RESULTING_STOCK_OR_DISPOSITION_RECORDED
      - FINANCIAL_EFFECT_AVAILABLE_FOR_E3
      - OWNER_LPR_ACCEPTED

  invariants:
    - OZON_CLASSIFICATION_METHOD_UNKNOWN_IS_NOT_REPLACED_BY_INFERENCE
    - SELLER_PHYSICAL_INSPECTION_NOT_REQUIRED_WHILE_ITEM_REMAINS_INSIDE_OZON_WAREHOUSE_CONTOUR
    - RETURN_DOES_NOT_REQUIRE_MANUAL_FINANCIAL_RECALCULATION_OUTSIDE_OZON_REPORTS
    - NEW_OPER_DOES_NOT_PROMOTE_LIFECYCLE_AUTOMATICALLY

  lifecycle_effect:
    S3: CANDIDATE
    PHYSIOLOGY: CANDIDATE
```

`S3` фиксирует фактическую для EP ветку возврата: товар возвращается на склад Ozon; классификация пригодности выполняется Ozon, но внутренний метод проверки не утверждается как известный. При пригодности товар возвращается в доступный остаток; при непригодности используется фактический disposition Ozon. Финансовое отражение ведёт Ozon, `OWNER_LPR` принимает системный результат и использует отчёты в `E3`.

### 0.35 / FEEDBACK.OPERS.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-031
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-004
  source: OWNER_LPR_CONFIRMATION

  F1:
    oper_id: F1
    name: OPERATIONAL_REVIEW
    lifecycle_state: CANDIDATE
    cadence: WEEKLY
    trigger: WEEKLY_REVIEW_DUE
    agency_ref: OWNER_LPR
    inputs:
      - SALES
      - STOCK
      - RETURNS
      - INCIDENTS
      - ECONOMICS
    action:
      - REVIEW_CURRENT_OPERATIONAL_STATE
      - IDENTIFY_DEVIATIONS_OR_RESOURCE_CONFLICTS
      - SELECT_REQUIRED_OPERATIONAL_ACTION
    output:
      - OPERATIONAL_REVIEW_RECORD
      - ACTION_DECISION_OR_NO_CHANGE
    decision_gate:
      critical_deviation: ROUTE_TO_APPLICABLE_HOLD_STOP_REPAIR_CONTROL
      no_critical_deviation: CONTINUE_REGULAR_CYCLE
    evidence_contract:
      preferred: DOCUMENTARY_OR_SYSTEM_EVIDENCE
      fallback: OWNER_LPR_CONFIRMATION
      exact_refs: INPUT_SPECIFIC
    memory_write_refs:
      - data/ep-domain/entities/decisions/
      - data/ep-domain/observation/events/
    cost: N/A
    micro_closure:
      - REVIEW_COMPLETED
      - DECISION_OR_NO_CHANGE_RECORDED

  F2:
    oper_id: F2
    name: STRATEGIC_REVIEW
    lifecycle_state: CANDIDATE
    cadence: QUARTERLY
    trigger: QUARTERLY_REVIEW_DUE
    agency_ref: OWNER_LPR
    inputs:
      - OPERATIONAL_REVIEW_HISTORY
      - ASSORTMENT
      - SUPPLIER_PERFORMANCE
      - BRAND
      - ECONOMICS
      - PROJECTS
      - GROWTH_STATE
    action:
      - REVIEW_BUSINESS_MODEL_AND_DIRECTION
      - IDENTIFY_REQUIRED_STRATEGIC_CHANGE_OR_NO_CHANGE
      - AUTHORIZE_NEXT_ACTION
    output:
      - STRATEGIC_REVIEW_RECORD
      - STRATEGIC_DECISION_OR_NO_CHANGE
    decision_gate:
      assortment_change: ROUTE_TO_A1
      project_change: ROUTE_TO_PROJECT_CONTOUR
      protocol_change: ROUTE_TO_O5
      no_change: WAIT_UNTIL_NEXT_QUARTERLY_REVIEW
    evidence_contract:
      preferred: DOCUMENTARY_OR_SYSTEM_EVIDENCE
      fallback: OWNER_LPR_CONFIRMATION
      exact_refs: INPUT_SPECIFIC
    memory_write_refs:
      - data/ep-domain/entities/decisions/
      - data/ep-domain/observation/events/
    cost: N/A
    micro_closure:
      - REVIEW_COMPLETED
      - DECISION_OR_NO_CHANGE_RECORDED

  invariants:
    - CRITICAL_OPERATIONAL_SIGNAL_DOES_NOT_WAIT_FOR_WEEKLY_REVIEW
    - WEEKLY_REVIEW != QUARTERLY_STRATEGIC_REVIEW
    - STRATEGIC_CHANGE_DOES_NOT_AUTO_ACTIVATE_WITHOUT_ITS_TARGET_OPER_OR_O5_ROUTE
    - NEW_OPERS_DO_NOT_PROMOTE_LIFECYCLE_AUTOMATICALLY

  lifecycle_effect:
    F1: CANDIDATE
    F2: CANDIDATE
    PHYSIOLOGY: CANDIDATE
```

`F1` — еженедельный контроль текущей работы. `F2` — квартальный пересмотр модели и направления. Критические события обрабатываются немедленно по соответствующему control/repair route и не ждут недельного обзора.


### 0.36 / VAL-01.PRELIMINARY.NORMALIZATION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-032
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolution_effect: PARTIAL_ONLY
  affects:
    - EPDP-OI-009
    - EPDP-OI-010

  VAL_01:
    original_declared_value: ORGANIC_MATERIALS
    preliminary_operational_form: NATURAL_OR_CELLULOSIC_MATERIALS
    status: CANDIDATE_PENDING_SUPPLY_CHAIN_EVIDENCE

  CURRENT_PRODUCT_EVIDENCE:
    ChinRada_material_statement: RAYON
    cellulosic_material_class: SUPPORTED_AT_GENERAL_MATERIAL_LEVEL
    ChinRada_to_material_manufacturer_link: NOT_CONFIRMED
    organic_property_of_ChinRada_material: NOT_CONFIRMED

  TODO_EVIDENCE:
    requirement:
      - CONFIRM_CHINRADA_SUPPLY_CHAIN_LINK_TO_THAI_RAYON_OR_OTHER_MATERIAL_MANUFACTURER
      - OBTAIN_MANUFACTURER_OR_SUPPLIER_EVIDENCE_SUFFICIENT_TO_SUPPORT_MATERIAL_ORIGIN_AND_ORGANICITY_CLAIM
    acceptable_source_examples:
      - CHINRADA_WRITTEN_CONFIRMATION
      - MATERIAL_MANUFACTURER_DOCUMENT
      - TRACEABLE_SUPPLY_CHAIN_DOCUMENT
      - CERTIFICATION_OR_EQUIVALENT_PRIMARY_EVIDENCE
    closure_target: EPDP-OI-010

  claim_rule:
    ORGANIC_CLAIM: BLOCKED_PENDING_EVIDENCE
    NATURAL_OR_CELLULOSIC_POSITIONING: CANDIDATE
    PUBLIC_FACTUAL_CLAIM_REQUIRES_SEPARATE_EVIDENCE_ACCEPTANCE: true

  lifecycle_effect: NONE
```

Решение предварительно нормализует `VAL-01` для операционной модели. Исходная заявленная ценность «Органические материалы» сохраняется в истории; публичное утверждение об органичности не разрешается без отдельного evidence. `EPDP-OI-009` и `EPDP-OI-010` остаются `OPEN`.


### 0.37 / VAL-02.BRIGHTNESS.CRITERION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-033
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolution_effect: PARTIAL_ONLY
  affects:
    - EPDP-OI-009

  VAL_02:
    declared_value: BRIGHTNESS
    criterion: OWNER_LPR_VISUAL_JUDGMENT
    pass_if: OWNER_LPR_ASSESSES_PRINT_OR_COLOR_AS_BRIGHT_AND_EXPRESSIVE
    colorimetric_metric_required: false
    external_measurement_required: false
    decision_evidence:
      - OWNER_LPR_ASSORTMENT_DECISION
      - PRODUCT_IMAGE_OR_SAMPLE_WHEN_AVAILABLE

  lifecycle_effect: NONE
```

`VAL-02` не требует формальной цветометрии. Решение о соответствии принимает `OWNER_LPR` на уровне ассортиментного выбора. `EPDP-OI-009` остаётся `OPEN` до определения `VAL-03–07`.


### 0.38 / VAL-03.STYLE.CRITERION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-034
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolution_effect: PARTIAL_ONLY
  affects:
    - EPDP-OI-009

  VAL_03:
    declared_value: STYLE
    criterion: OWNER_LPR_VISUAL_JUDGMENT
    pass_if: OWNER_LPR_ASSESSES_PRODUCT_OR_PRESENTATION_AS_CONSISTENT_WITH_ELEPHANT_PANTS_BRAND_STYLE
    formal_external_style_standard_required: false
    decision_evidence:
      - OWNER_LPR_ASSORTMENT_OR_PRESENTATION_DECISION
      - PRODUCT_IMAGE_OR_SAMPLE_WHEN_AVAILABLE

  lifecycle_effect: NONE
```

`VAL-03` не требует формального внешнего стилевого стандарта. Решение о соответствии стилю бренда принимает `OWNER_LPR`. `EPDP-OI-009` остаётся `OPEN` до определения `VAL-04–07`.


### 0.39 / VAL-04.COMFORT.CRITERION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-035
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolution_effect: PARTIAL_ONLY
  affects:
    - EPDP-OI-009

  VAL_04:
    declared_value: COMFORT
    criterion:
      - OWNER_LPR_SAMPLE_OR_WEAR_ASSESSMENT
      - MARKET_FEEDBACK
    pass_if:
      - OWNER_LPR_ASSESSES_FIT_AND_MATERIAL_AS_COMFORTABLE
      - NO_STABLE_PATTERN_OF_COMFORT_RELATED_COMPLAINTS_OR_RETURNS
    current_evidence:
      owner_assessment: ACCEPTED_BY_OWNER_LPR
      positive_customer_reviews_exist: SOURCE_STATED_BY_OWNER_LPR
      review_refs: UNASSIGNED
    formal_metric_required: false

  lifecycle_effect: NONE
```

`VAL-04` допускает качественную оценку комфорта. Положительные отзывы покупателей уже существуют по подтверждению `OWNER_LPR`; конкретные refs могут быть привязаны позднее как evidence instances. `EPDP-OI-009` остаётся `OPEN` до определения `VAL-05–07`.

### 0.40 / VAL-05.FREEDOM.SPIRIT.CRITERION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-036
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolution_effect: PARTIAL_ONLY
  affects:
    - EPDP-OI-009

  VAL_05:
    declared_value: FREEDOM_SPIRIT
    criterion: OWNER_LPR_BRAND_JUDGMENT
    pass_if: OWNER_LPR_ASSESSES_PRODUCT_OR_COMMUNICATION_AS_SUPPORTING_FREEDOM_INFORMALITY_AND_NONRESTRICTIVE_LIFESTYLE
    formal_metric_required: false
    decision_evidence:
      - OWNER_LPR_BRAND_OR_ASSORTMENT_DECISION
      - PRODUCT_OR_COMMUNICATION_ARTIFACT_WHEN_AVAILABLE

  lifecycle_effect: NONE
```

`VAL-05` не требует формальной внешней метрики. Соответствие ценности «Дух свободы» определяет `OWNER_LPR` на уровне продукта и коммуникации бренда. `EPDP-OI-009` остаётся `OPEN` до определения `VAL-06–07`.

### 0.41 / VAL-06.THAI.ATMOSPHERE.AND.ORIGIN.CRITERION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-037
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolution_effect: PARTIAL_ONLY
  affects:
    - EPDP-OI-009

  VAL_06:
    declared_value: THAI_SUNNY_ATMOSPHERE_AT_HOME

    atmosphere:
      criterion: OWNER_LPR_BRAND_JUDGMENT
      pass_if: OWNER_LPR_ASSESSES_PRODUCT_OR_COMMUNICATION_AS_CONVEYING_THAI_SUNNY_ATMOSPHERE
      formal_metric_required: false

    thai_origin:
      current_evidence:
        - THAI_BRAND_LOGO
      future_stronger_evidence:
        - DECLARATION
      evidence_policy:
        current_operational_acceptance: OWNER_LPR_ACCEPTED
        documentary_strengthening_planned: true

  lifecycle_effect: NONE
```

`VAL-06` разделяет субъективную атмосферу бренда и factual claim происхождения. Атмосферу оценивает `OWNER_LPR`. Для текущей операционной модели логотип тайского бренда принимается владельцем как текущее evidence тайского происхождения; впоследствии evidence усиливается декларацией. Это решение не подтверждает происхождение сырья, которое остаётся отдельным `EPDP-OI-010`.

### 0.42 / VAL-07.COMMUNITY.AND.MARKETING.ROUTE

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-038
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-009

  VAL_07:
    declared_value: COMMUNITY_YOGA_NEW_AGE_VIBE
    criterion: OWNER_LPR_BRAND_JUDGMENT
    pass_if: OWNER_LPR_ASSESSES_PRODUCT_CONTENT_PARTNERSHIP_OR_COMMUNITY_ACTION_AS_FITTING_YOGA_NEW_AGE_SOCIAL_VIBE
    formal_metric_required: false
    strategic_role: PERSPECTIVE_MARKETING_ROUTE
    route_scope:
      - AUDIENCE_TARGETING
      - CONTENT
      - COMMUNITY
      - PARTNERSHIPS
      - GROWTH_EXPERIMENTS

  VALUE_GATE_CONTRACT:
    decision_owner: OWNER_LPR
    applies_to:
      - A1_ASSORTMENT_SELECTION
      - A2_PRODUCT_CONTENT_WHEN_VALUE_RELEVANT
      - F2_STRATEGIC_REVIEW
      - BRAND_AND_MARKETING_GROWTH_TASKS
    applicable_values_only: true
    all_seven_values_required_for_every_action: false
    factual_claims_require_evidence: true
    subjective_brand_values_use_owner_judgment: true

  lifecycle_effect: NONE
```

`VAL-07` не задаёт обязательный текущий канал продаж. Он фиксирует перспективный маршрут маркетинговых задач. `EPDP-OI-009` закрыт на уровне design/specification; `EPDP-OI-010` остаётся отдельным evidence TODO для происхождения/органичности материала.


### 0.43 / DECLARATION.3D.PROJECT.TERMINAL.RESULT

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-039
  decided_at: 2026-08-07
  authority: OWNER_LPR
  partially_resolves: EPDP-OI-020

  PROJECT:
    name: DECLARATION_3D
    type: REPAIR
    purpose: COMPLIANCE_ENABLEMENT

    terminal_result:
      - REQUIRED_DECLARATION_OBTAINED
      - DECLARATION_REGISTERED
      - DECLARATION_DOCUMENT_STORED_AS_EVIDENCE
      - RESULT_ACCEPTED_BY_OWNER_LPR

    dependent_compliance_transition_before_terminal_result: HOLD
    project_terminal_state_after_acceptance: CLOSED

  remaining_EPDP_OI_020_scope:
    - MARKING_PROJECT_CARD
    - BRANDING_PROJECT_CARD
    - EXACT_COMPLIANCE_GATE_SCOPE

  lifecycle_effect: NONE
```

`EP-DP-DR-039` определил terminal result проекта «Декларация 3Д»; на момент этого решения `EPDP-OI-020` оставался `OPEN`. Текущий closure — `EP-DP-DR-043`.

### 0.44 / MARKING.PROJECT.CURRENT.STATE

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-040
  decided_at: 2026-08-07
  authority: OWNER_LPR
  partially_resolves: EPDP-OI-020

  PROJECT:
    name: MARKING
    type: REPAIR
    current_state: ACTIVE_NOT_STABILIZED
    transferred_to_regular_process: false

    current_gap:
      - MARKING_SOFTWARE_NOT_CONFIGURED_AND_VALIDATED

    candidate_software:
      - MOYSKLAD
    candidate_status: NOT_YET_CONFIRMED_AS_FINAL_TOOL

    terminal_result:
      - MARKING_SOFTWARE_CONFIGURED
      - SOFTWARE_SUCCESSFULLY_EXECUTES_REQUIRED_MARKING_WORKFLOW
      - RESULT_VERIFIED_BY_OWNER_LPR
      - WORKFLOW_STABLE_ENOUGH_FOR_REPEATABLE_USE
      - HANDOFF_TO_REGULAR_OPERS_LR2_LR3_LR4_AUTHORIZED_BY_OWNER_LPR

    terminal_state_after_acceptance: TRANSFERRED_TO_REGULAR_PROCESS

  remaining_EPDP_OI_020_scope:
    - MARKING_SUCCESS_TEST_ACCEPTANCE_CRITERIA
    - BRANDING_PROJECT_CARD
    - EXACT_COMPLIANCE_GATE_SCOPE

  lifecycle_effect: NONE
```

Проект «Маркировка» не считается завершённым только потому, что `L(R)2–L(R)4` уже описаны как regular opers. До передачи в regular process требуется настроить ПО (предварительный кандидат — «МойСклад»), провести успешную проверку полного marking workflow и получить явную приёмку `OWNER_LPR`.

### 0.45 / MARKING.PROJECT.TEST.ACCEPTANCE

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-041
  decided_at: 2026-08-07
  authority: OWNER_LPR
  partially_resolves: EPDP-OI-020

  MARKING_TEST:
    pass_if:
      - PRODUCT_UNITS_LOADED_IN_SOFTWARE
      - MARKING_CODES_RECEIVED_OR_LINKED
      - LABELS_GENERATED_CORRECTLY
      - LABELS_PRINTED
      - CODE_MATCHED_TO_CORRECT_SKU
      - CHESTNY_ZNAK_PRODUCT_UNIT_STATUS_IS_IN_CIRCULATION
      - FULL_CYCLE_REPEATED_WITHOUT_MANUAL_EMERGENCY_CORRECTION

  lifecycle_effect: NONE
```

### 0.46 / BRANDING.PROJECT.CARD

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-042
  decided_at: 2026-08-07
  authority: OWNER_LPR
  partially_resolves: EPDP-OI-020

  PROJECT:
    name: BRANDING
    type: GROWTH
    owner: OWNER_LPR
    terminal_result:
      - BRAND_VISUALLY_DEFINED
      - LOGO_AND_IDENTITY_READY
      - PACKAGING_AND_LABELS_ALIGNED_WITH_BRAND
      - PRODUCT_CARDS_USE_COHERENT_BRAND_STYLE
      - RESULT_ACCEPTED_BY_OWNER_LPR
    terminal_state_after_acceptance: CLOSED

  remaining_EPDP_OI_020_scope:
    - EXACT_COMPLIANCE_GATE_SCOPE

  lifecycle_effect: NONE
```


### 0.47 / DECLARATION.3D.COMPLIANCE.GATE

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-043
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-020

  COMPLIANCE_GATE:
    object: DECLARATION_3D
    gate_position: BEFORE_SUPPLIER_BATCH_ORDER
    affected_oper: I1
    effective_constraint_date: 2026-10-01

    IF_REQUIRED_DECLARATION_NOT_ACTIVE:
      supplier_batch_order: HOLD
      project_account_import_financing: HOLD

    rationale:
      - MARKETPLACE_SALES_WITHOUT_REQUIRED_DECLARATION_NOT_AVAILABLE_TO_PROJECT_FROM_2026_10_01
      - IMPORT_FINANCED_FROM_PROJECT_ACCOUNT_MUST_NOT_CONTINUE_WHEN_SALE_ROUTE_IS_BLOCKED

    funding_exception:
      investment_funding_does_not_override_compliance_gate: true

    release_if:
      - REQUIRED_DECLARATION_OBTAINED
      - DECLARATION_REGISTERED
      - DECLARATION_DOCUMENT_STORED_AS_EVIDENCE
      - RESULT_ACCEPTED_BY_OWNER_LPR

  lifecycle_effect: NONE
```

`EP-DP-DR-043` задаёт внутренний gate проекта раньше юридически минимально возможного момента: если требуемая декларация не активна, новый заказ партии у поставщика и финансирование импорта со счёта проекта приостанавливаются до восстановления возможности законной продажи через маркетплейсы. Это operator policy `OWNER_LPR`; она не утверждает, что импорт как физическое действие сам по себе юридически запрещён.


### 0.48 / PROJECT.EXIT.AND.HANDOFF

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-044
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-021

  PROJECT_EXIT:
    CLOSED:
      condition:
        - TERMINAL_RESULT_ACHIEVED
        - RESULT_ACCEPTED_BY_OWNER_LPR
      effect:
        - PROJECT_CLOSED
        - RESOURCE_RELEASED

    TRANSFERRED_TO_REGULAR_PROCESS:
      condition:
        - PROJECT_RESULT_INTENDED_AS_REPEATABLE_CAPABILITY
        - CORRESPONDING_OPER_OR_RULE_OR_SOURCE_OF_TRUTH_FORMALIZED
        - HANDOFF_RESULT_TESTED
        - HANDOFF_ACCEPTED_BY_OWNER_LPR
      effect:
        - REGULAR_PROCESS_BECOMES_AUTHORIZED_DESTINATION
        - PROJECT_CAN_TERMINATE_AS_TRANSFERRED_TO_REGULAR_PROCESS

  guard:
    PROJECT_WITH_REPEATABLE_RESULT_NOT_HANDED_OFF:
      project_terminal_state: NOT_REACHED
      effect: HOLD

  distinction:
    PRE_START_MISSING_GATE: HOLD
    ACTIVE_PROJECT_CRITICAL_DEFECT: STOP_OR_REPAIR_ROUTE
    RESOURCE_OVERLOAD_PAUSE: NON_TERMINAL

  lifecycle_effect: NONE
```

`EP-DP-DR-044` отделяет разовое закрытие проекта от передачи результата в регулярную физиологию. Проект с повторяемым результатом не считается завершённым до формализации целевого `oper / rule / source_of_truth`, проверки handoff и принятия `OWNER_LPR`.

### 0.49 / MACHINE.IDENTITY

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-045
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: [EPDP-OI-028, EPDP-OI-029]

  MACHINE:
    machine_id: EP-MACHINE-001
    name: Elephant Pants

  OPER_INHERITANCE:
    applies_to: ALL_DOMAIN_OPERS
    oper_count: 32
    machine_ref: EP-MACHINE-001

  lifecycle_effect: NONE
```

`EP-DP-DR-045` назначает устойчивый идентификатор доменной машине и общий `machine_ref` всем 32 текущим opers. Это закрывает только поле `machine_ref`; `EPDP-OI-028` остаётся `OPEN` до заполнения остальных обязательных полей и typed refs.

### 0.50 / OPER.STATE.MAPPING

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-046
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: EPDP-OI-028

  OPER_STATE_MAPPING:
    applies_to: ALL_DOMAIN_OPERS
    oper_count: 32
    before_state: OPER.S0
    after_state: OPER.S1
    multiple_conditions_semantics: AND
    separate_state_object_required: false

  lifecycle_effect: NONE
```

`EP-DP-DR-046` нормализует уже описанные `S0 / S1` как канонические `before_state / after_state`. Если `S0` или `S1` содержит несколько обязательных условий, все они должны быть истинны одновременно (`AND`). Новые состояния этим решением не изобретаются. `EPDP-OI-028` остаётся `OPEN` до закрытия остальных обязательных полей и typed refs.



### 0.51 / OPER.AGENCY.MAPPING

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-047
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: EPDP-OI-028

  ACTOR:
    actor_id: EP-ACTOR-OWNER-LPR
    role: OWNER_LPR

  OPER_AGENCY_MAPPING:
    applies_to: ALL_DOMAIN_OPERS
    oper_count: 32
    agency_ref: EP-ACTOR-OWNER-LPR

  EXTERNAL_PARTICIPANTS:
    agency_ref: false
    representation: external_participant

  lifecycle_effect: NONE
```

`EP-DP-DR-047` назначает `EP-ACTOR-OWNER-LPR` каноническим `agency_ref` всех 32 текущих opers. Поставщик, перевозчик, Ozon, системы и специалисты остаются внешними участниками конкретных opers и не подменяют `agency_ref`.

### 0.52 / OPER.EVIDENCE.REFS

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-048
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: EPDP-OI-028

  EVIDENCE_REF_RULE:
    requirement: STABLE_REFERENCE
    allowed_targets:
      - GITHUB_PATH_OR_OBJECT
      - EXTERNAL_DOCUMENT_OR_SYSTEM_OBJECT
      - OWNER_LPR_CONFIRMATION_RECORD

  OWNER_LPR_CONFIRMATION_RECORD:
    use_if: DOCUMENTARY_OR_SYSTEM_EVIDENCE_OBJECTIVELY_UNAVAILABLE
    persistence: GITHUB_SOURCE_OF_TRUTH

  invariant:
    - EVIDENCE_TYPE_WITHOUT_CONCRETE_REFERENCE_IS_INCOMPLETE
    - PRIMARY_DOCUMENT_OR_SYSTEM_EVIDENCE_PREFERRED_WHEN_AVAILABLE

  lifecycle_effect: NONE
```

`EP-DP-DR-048` требует от каждого oper ссылаться на конкретное свидетельство: файл/объект в GitHub, внешний документ/системный объект либо сохранённое подтверждение `OWNER_LPR`, если документальное или системное evidence объективно недоступно. Абстрактное указание типа evidence без устойчивой ссылки не закрывает поле `evidence_refs`.

### 0.53 / OPER.TRANSITION.REFS

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-049
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: EPDP-OI-028

  TRANSITION_REF_RULE:
    applies_to: ALL_DOMAIN_OPERS
    oper_count: 32
    format: EP-TR-{OPER_ID}
    from: OPER.S0
    to: OPER.S1

  runtime_guards:
    source: OPER_SPECIFIC
    values: [READY, HOLD, STOP]
    relation_to_transition_ref: DO_NOT_REPLACE_TYPED_REF

  lifecycle_effect: NONE
```

`EP-DP-DR-049` назначает каждому oper отдельный устойчивый `transition_ref`. Он идентифицирует переход из канонического `before_state = S0` в `after_state = S1`; runtime guards `READY / HOLD / STOP` остаются частью конкретного oper и не создают отдельные transition IDs.

### 0.54 / OPER.MEMORY.WRITE.REFS

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-050
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: EPDP-OI-028

  MEMORY_WRITE_REF_RULE:
    applies_to: ALL_DOMAIN_OPERS
    oper_count: 32
    source_of_truth: valerol/ep_dashboard@main
    base_path: data/ep-domain/

    if_oper_changes_persisted_domain_state:
      memory_write_refs: ENTITY_OR_EVENT_OBJECT_REF
    else:
      memory_write_refs: N/A

    mapping_principle:
      - BATCH_CHANGE -> BATCH_OBJECT
      - PRICE_CHANGE -> PRICE_OBJECT
      - STOCK_CHANGE -> STOCK_OBJECT
      - DECISION -> DECISION_OBJECT
      - CYCLE_EVENT -> OBSERVATION_EVENT_OBJECT
      - PROTOCOL_CHANGE -> PROTOCOL_VERSION_OBJECT
      - OTHER_PERSISTED_STATE -> CORRESPONDING_ENTITY_OBJECT

  runtime_instance_refs:
    created_when: OPER_EXECUTION_CREATES_OR_CHANGES_PERSISTED_STATE
    requirement: STABLE_GITHUB_OBJECT_OR_PATH_REF

  lifecycle_effect: NONE
```

`EP-DP-DR-050` задаёт типизированное правило `memory_write_refs`: oper с сохраняемым изменением состояния обязан ссылаться на соответствующий объект source of truth; oper без такого изменения использует `N/A`. Конкретный instance ref создаётся при фактическом исполнении, поэтому отсутствие будущего runtime path не считается незакрытой спецификацией.

### 0.55 / OPER.COST

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-051
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: EPDP-OI-028

  OPER_COST_RULE:
    applies_to: ALL_DOMAIN_OPERS
    oper_count: 32

    if_separate_direct_cost_exists:
      before_fact:
        cost_state: ESTIMATED
        amount: OPER_SPECIFIC_ESTIMATE
      after_fact:
        cost_state: ACTUAL
        amount: OPER_SPECIFIC_ACTUAL_AMOUNT
        actual_supersedes_estimate_for_accounting: true
        estimate_preserved_for_forecast_error: true

    if_no_separate_direct_cost:
      cost: N/A

    owner_lpr_time:
      monetized_in_oper_cost: false
      capacity_accounting_ref: OWNER_RESOURCE_AND_WIP

  lifecycle_effect: NONE
```

`EP-DP-DR-051` типизирует поле `cost` для всех 32 текущих opers. В `cost` учитывается только отдельная прямая денежная стоимость oper. Если прямой стоимости нет, используется `N/A`. Время `OWNER_LPR` контролируется как ограниченный ресурс мощности, но не переводится в денежную стоимость oper. Конкретные суммы остаются instance-level данными и появляются при планировании/исполнении.

### 0.56 / OPER.MICRO.CLOSURE

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-052
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: EPDP-OI-028

  MICRO_CLOSURE_RULE:
    applies_to: ALL_DOMAIN_OPERS
    oper_count: 32

    complete_if:
      - S1_REACHED
      - REQUIRED_EVIDENCE_RECEIVED_AND_ACCEPTED_BY_OWNER_LPR
      - REQUIRED_MEMORY_WRITE_COMPLETED_IF_APPLICABLE
      - NO_BLOCKING_DEVIATION_OR_DEVIATION_REPAIRED_AND_RECHECKED

    action_only_without_confirmed_result:
      status: NOT_COMPLETE

  lifecycle_effect: NONE
```

`EP-DP-DR-052` нормализует `micro_closure` для всех 32 текущих opers. Завершение действия само по себе не закрывает oper: должен быть подтверждён `S1`, принято обязательное evidence, выполнена обязательная запись состояния и отсутствовать незакрытое блокирующее отклонение.


### 0.57 / OPER.RESIDUE

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-053
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: EPDP-OI-028

  RESIDUE_RULE:
    applies_to: ALL_DOMAIN_OPERS
    oper_count: 32

    if_no_remaining_issue:
      residue: []

    if_remaining_issue_exists:
      requirements:
        - RECORD_EXPLICITLY
        - CLASSIFY_BLOCKING_OR_NON_BLOCKING
        - LINK_TO_OPENITEM_OR_NEXT_OPER_OR_PROJECT

    blocking_residue:
      micro_closure_allowed: false

    non_blocking_residue:
      micro_closure_allowed: true
      followup_ref_required: true

  lifecycle_effect: NONE
```

`EP-DP-DR-053` нормализует поле `residue`: отсутствие остатка записывается как пустой список; любой оставшийся вопрос должен быть явно зафиксирован и связан с `OpenItem`, следующим oper или проектом. Блокирующий residue запрещает `micro_closure`; неблокирующий допускает закрытие oper при наличии отдельной follow-up ссылки.

### 0.58 / OPER.VALUE.OR.RISK.GATE + OBJECT.COMPLETENESS

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-054
  decided_at: 2026-08-07
  authority: OWNER_LPR
  resolves: EPDP-OI-028

  VALUE_OR_RISK_GATE_RULE:
    applies_to: ALL_DOMAIN_OPERS
    oper_count: 32
    selection: OPER_SPECIFIC
    if_no_specific_value_or_risk_gate_applies: N/A
    if_multiple_gates_apply: ALL_MUST_PASS
    blocking_gate_failure:
      effect: HOLD_OR_STOP_AS_DEFINED_BY_GATE

  OPER_GATE_ASSIGNMENT:
    A1: [EP-DP-DR-032, EP-DP-DR-033, EP-DP-DR-034, EP-DP-DR-035, EP-DP-DR-036, EP-DP-DR-037, EP-DP-DR-038]
    A2: [VALUE_CLAIM_GATE, EP-DP-DR-032, EP-DP-DR-033, EP-DP-DR-034, EP-DP-DR-035, EP-DP-DR-036, EP-DP-DR-037, EP-DP-DR-038]
    I1: [EP-DP-DR-016, EP-DP-DR-043]
    I2: N/A
    I3: [EP-DP-DR-017]
    I4: N/A
    I5: [EP-DP-DR-018]
    "L(I)1": [EP-DP-DR-018]
    "L(I)2": [EP-DP-DR-019]
    "L(I)3": N/A
    "L(I)4": N/A
    "L(R)1": [EP-DP-DR-020]
    "L(R)2": [EP-DP-DR-021]
    "L(R)3": N/A
    "L(R)4": [EP-DP-DR-017]
    "L(R)5": N/A
    "L(R)6": N/A
    "L(R)7": N/A
    S1: [EP-DP-DR-013, EP-DP-DR-029, VALUE_CLAIM_GATE]
    S2: N/A
    S3: [EP-DP-DR-030]
    E1: [EP-DP-DR-016, EP-DP-DR-043]
    E2: [EP-DP-DR-013]
    E3: N/A
    E4: [EP-DP-DR-014, EP-DP-DR-015]
    F1: N/A
    F2: N/A
    O1: [EP-DP-DR-006]
    O2: [EP-DP-DR-006]
    O3: [EP-DP-DR-006, EP-DP-DR-008]
    O4: [EP-DP-DR-007, EP-DP-DR-008]
    O5: [EP-DP-DR-011]

  OBJECT_LEVEL_COMPLETENESS_AUDIT:
    scope: ALL_32_OPER_DEFINITIONS
    required_fields_checked:
      - oper_id
      - machine_ref
      - before_state
      - trigger
      - evidence_refs
      - agency_ref
      - value_or_risk_gate
      - transition_ref
      - after_state
      - memory_write_refs
      - cost
      - micro_closure
      - residue
      - lifecycle_state
    incomplete_definition_fields: 0
    unresolved_definition_references: 0
    runtime_instance_values_not_yet_created:
      - concrete_evidence_refs
      - concrete_memory_write_refs
      - actual_cost_amounts
      - runtime_residue
    runtime_instance_values_are_definition_debt: false
    result: PASS

  oper_object_hold_codes_after_audit:
    HOLD-OBJECT-INCOMPLETE: CLEARED
    HOLD-OBJECT-REFERENCE-UNRESOLVED: CLEARED

  lifecycle_effect:
    oper_state: CANDIDATE
    reason: TRANSITION_TO_OBSERVED_NOT_AUTHORIZED
```

`EP-DP-DR-054` завершает schema-level object completeness всех 32 текущих opers. Поля, возникающие только при конкретном исполнении (`evidence_refs`, `memory_write_refs`, фактическая стоимость и runtime residue), не считаются незаполненными полями определения, если их формат и правило создания заданы. Переход `CANDIDATE → OBSERVED` этим решением не авторизован.

### 0.59 / PHYSIOLOGY.GENERATION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-055
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: EPDP-OI-029

  generation:
    baseline: EP-DP-v0.1
    current: EP-DP-v0.2
    parent_sha256: d172938068ab715cfc11ef65acb1be9c4829987aed3318902692b0c2d2de6e99
    derivation:
      - OWNER_DECISIONS
      - NORMALIZATION
      - OPENITEM_RESOLUTION

  baseline_mutation: FORBIDDEN
  lifecycle_effect: NONE
```

`EP-DP-DR-055` заполняет поле `generation` объекта `Physiology`. Решение не закрывает `EPDP-OI-029` и не авторизует переход в `INTERNAL_QA`.

### 0.60 / PHYSIOLOGY.SCHEMA.REGISTRY

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-056
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: EPDP-OI-029

  schemas:
    OPER_OBJECT: §0.4
    PHYSIOLOGY_OBJECT: §0.4
    CYCLE_RECORD: §6.2
    INTERFACE: §8
    PROJECT: §10
    OPENITEM: §15

  duplication_policy: REFERENCE_EXISTING_DEFINITION
  lifecycle_effect: NONE
```

`EP-DP-DR-056` заполняет поле `schemas` объекта `Physiology` единым registry ссылок на уже определённые структуры. Схемы не копируются повторно. Решение не закрывает `EPDP-OI-029` и не авторизует переход в `INTERNAL_QA`.

### 0.61 / PHYSIOLOGY.COMPATIBILITY

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-057
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: EPDP-OI-029

  compatibility:
    targets:
      - PINNED_BOIS_CANON
      - EP_OPERS_V0_1
      - EP_OSU_V0_2
      - USER_ADDITIONS

    precedence:
      BOIS: SENIOR_FOR_TERMS_SCHEMAS_LIFECYCLE
      DOMAIN_SOURCES: SENIOR_FOR_DOMAIN_CONTENT

    conflict_rule:
      unresolved_conflict: HOLD_OR_OPENITEM
      silent_override: FORBIDDEN

    status: DRAFT_UNTIL_INTERNAL_QA
    named_2_44_compatibility_claim: BLOCKED_UNTIL_CANON_LABEL_RESOLVED

  lifecycle_effect: NONE
```

`EP-DP-DR-057` заполняет поле `compatibility` объекта `Physiology`. Контракт совместимости определён, но совместимость ещё не подтверждена: проверка выполняется в `INTERNAL_QA`. Расхождение меток `2.44 / 2.43` сохраняется и блокирует именованное утверждение `BOIS 2.44 compatible`. Решение не закрывает `EPDP-OI-029` и не авторизует lifecycle transition.

### 0.62 / PHYSIOLOGY.TEST.REGISTRY

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-058
  decided_at: 2026-08-07
  authority: OWNER_LPR
  contributes_to: EPDP-OI-029

  tests:
    - SCHEMA_COMPLETENESS
    - REFERENCE_RESOLUTION
    - INTERFACE_CONTRACT_COMPLETENESS
    - OPER_TRANSITION_CONSISTENCY
    - CYCLE_OBSERVATION_FLOW
    - ECONOMIC_GATES
    - PROJECT_EXIT_HANDOFF
    - COMPATIBILITY

  status: DEFINED_NOT_EXECUTED
  execution_stage: INTERNAL_QA
  lifecycle_effect: NONE
```

`EP-DP-DR-058` заполняет поле `tests` объекта `Physiology`. Тесты определены, но не выполнены; их исполнение и результаты относятся к `INTERNAL_QA`. Решение не закрывает `EPDP-OI-029` и не авторизует lifecycle transition.

### 0.59 / EP-DP-DR-059 / FORMAL.PHYSIOLOGY.LIFECYCLE.RECORD

```yaml
EP-DP-DR-059:
  decision: FORMAL_LIFECYCLE_RECORD_DEFINED
  authority: OWNER_LPR
  object: EP-DP-001
  current_state: CANDIDATE
  automatic_transition: FORBIDDEN

  history:
    - version: 0.1
      state: CANDIDATE
      role: IMMUTABLE_BASELINE
    - version: 0.2
      state: CANDIDATE
      role: WORKING_CANDIDATE

  next_allowed_state: INTERNAL_QA
  transition_authority: OWNER_LPR
  transition_record_requires:
    - from
    - to
    - authority
    - timestamp
    - evidence_refs
    - decision_ref

  closes: EPDP-OI-029
  lifecycle_effect: NONE
```

`EP-DP-DR-059` завершает definition-level объект `Physiology`: generation, schemas, compatibility contract, test registry и formal lifecycle record определены. `EPDP-OI-029` закрыт. Переход `CANDIDATE → INTERNAL_QA` этим решением не авторизован автоматически; отдельная авторизация выполнена позднее в `EP-DP-DR-060`.

### EP-DP-DR-060 / INTERNAL_QA.ENTRY.AUTHORIZATION

```yaml
decision_id: EP-DP-DR-060
decision: AUTHORIZE_PHYSIOLOGY_LIFECYCLE_TRANSITION
object: EP-DP-001
version: 0.2
from: CANDIDATE
to: INTERNAL_QA
authority: OWNER_LPR
authorized_at: "2026-08-07T12:49:00+10:00"
automatic_transition: false
result: APPLIED
```

`EPDP-OI-030` закрыт. Переход относится только к объекту `Physiology`; 32 объекта `Oper` остаются `CANDIDATE` до собственных авторизованных lifecycle transitions.

### 0.64 / EP-DP-QA-001 / INTERNAL.QA.STATIC.RUN

```yaml
QA_RUN:
  qa_run_id: EP-DP-QA-001
  object: EP-DP-001
  version: 0.2
  lifecycle_state: INTERNAL_QA
  executed_at: 2026-08-07
  executor: CHATGPT_ASSISTIVE_ANALYZER
  independent_control_mode: NOT_EXECUTED_IN_THIS_RUN
  scope: STATIC_DEFINITION_AND_COMPATIBILITY_CHECKS

  TEST_RESULTS:
    SCHEMA_COMPLETENESS:
      status: PASS_AFTER_REPAIR
      evidence:
        - EP-DP-DR-054
        - EP-DP-DR-059
      repairs:
        - CURRENT_PHYSIOLOGY_STATE_SYNCHRONIZED_TO_INTERNAL_QA
        - STALE_MATRIX_COUNTERS_30_TO_32_CORRECTED
        - STALE_REGULAR_OPER_HOLD_COUNTERS_CLEARED

    REFERENCE_RESOLUTION:
      status: PASS_DEFINITION_SCOPE
      definition_unresolved_refs: 0
      runtime_instance_refs: CREATED_ON_EXECUTION

    INTERFACE_CONTRACT_COMPLETENESS:
      status: PASS
      interface_count: 12
      evidence: EP-DP-DR-028

    OPER_TRANSITION_CONSISTENCY:
      status: PASS_AFTER_REPAIR
      oper_count: 32
      transition_rule: EP-TR-{OPER_ID}
      oper_lifecycle_transition_authorized: false

    CYCLE_OBSERVATION_FLOW:
      status: PASS_RUNTIME
      static_route: O1_TO_O2_O3_O4_O5_COHERENT
      runtime_register_write_test: PASS
      runtime_qa_ref: GITHUB:valerol/ep_dashboard@qa/ep-dp-v0.2-observation:data/ep-domain/qa/EP-DP-v0.2/OI-032-observation-runtime.yaml
      openitem: EPDP-OI-032_RESOLVED

    ECONOMIC_GATES:
      status: PASS_WITH_ROUNDING_NOTE
      E1: EP-DP-DR-016
      E2: EP-DP-DR-013
      E4: EP-DP-DR-015
      repair:
        source_record_price: 2891.48_RUB
        recomputed_from_displayed_rounded_inputs: 2891.16_RUB
        gate_2900_RUB_affected: false

    PROJECT_EXIT_HANDOFF:
      status: PASS_DESIGN
      evidence: EP-DP-DR-044
      marking_project_runtime_state: ACTIVE_NOT_STABILIZED

    COMPATIBILITY:
      status: PASS_PINNED_ARTIFACT_SCOPE
      closes: EPDP-OI-031
      named_BOIS_2_44_claim: BLOCKED
      label_mismatch_ref: EPDP-OI-027

  COMPATIBILITY_MATRIX:
    PINNED_BOIS_CANON:
      result: PASS
      basis:
        - PHYSIOLOGY_REQUIRED_FIELDS_PRESENT
        - CANDIDATE_TO_INTERNAL_QA_TRANSITION_AUTHORIZED
        - OPER_LIFECYCLE_REMAINS_SEPARATE
    EP_OPERS_V0_1:
      result: PASS_WITH_EXPLICIT_SUPERSESSION
      basis:
        - SOURCE_OPERS_PRESERVED_AS_PROVENANCE
        - CURRENT_PROCESS_CORRECTIONS_HAVE_OWNER_DECISION_REFS
        - ADDED_OPERS_A1_A2_S3_F1_F2_ARE_EXPLICIT_EXTENSIONS
    EP_OSU_V0_2:
      result: PASS_WITH_REFINEMENT
      basis:
        - TRADE_AND_EXTERNAL_FACTORY_INVARIANT_PRESERVED
        - END_TO_END_PROCESS_PRESERVED_AND_EXTENDED
        - QUARTERLY_STRATEGIC_FEEDBACK_PRESERVED
        - INDEPENDENT_CONTROL_BY_SUBJECT_OR_TIME_PRESERVED
    USER_ADDITIONS:
      result: PASS
      basis:
        - VAL_01_07_MAPPED
        - O1_O5_MAPPED

  STATIC_QA_SUMMARY:
    pass: 7
    design_pass_runtime_pending: 1
    release_ready: false
    next_open_release_blocker: EPDP-OI-032
```

`EP-DP-QA-001` — статический/compatibility run. Runtime QA `EP-DP-QA-OI-032-20260807` дополнительно подтвердил GitHub writer, `O1–O5`, SLA, control review, `HOLD`, `STOP→REPAIR→RECONTROL`, returns и claim-block fixtures; defect log закрыт. `EPDP-OI-032` закрыт. Реальная партия остаётся `EPDP-OI-033`.

### 0.65 / REPOSITORY.AND.PHYSIOLOGY.MUTUAL.RECONSTRUCTION.DECISION

```yaml
DECISION_RECORD:
  decision_id: EP-DP-DR-061
  decided_at: 2026-08-07
  authority: OWNER_LPR
  extends: EP-DP-DR-009
  requirement: DOMAIN_PHYSIOLOGY_AND_GITHUB_REPOSITORY_MUST_BE_MUTUALLY_RECONSTRUCTABLE
  canonical_repository:
    repository_full_name: valerol/ep_dashboard
    branch: main
    domain_root: data/ep-domain
  canonical_artifacts:
    physiology_version: data/ep-domain/domain-physiology/EP-DP-v0.2.1.md
    current_pointer: data/ep-domain/domain-physiology/CURRENT.md
    machine_readable_topology: data/ep-domain/repository-map.yaml
    embedded_topology: EP-DP_v0.2.1_§14.1
    logistics_protocol: data/ep-domain/observation/protocol/EP-DP-LOGISTICS-CYCLE-PROTOCOL/1.0.yaml
  reconstruction_contract:
    physiology_to_repository:
      must_restore:
        - REQUIRED_DOMAIN_DIRECTORY_TOPOLOGY
        - ARTIFACT_ROLES_AND_AUTHORITY
        - FILE_NAMING_PATTERNS
        - REQUIRED_SINGLETON_ARTIFACTS
        - ACTIVE_PROTOCOL_CONTENT
        - RULES_FOR_RECREATING_DERIVED_INDEXES
      does_not_restore:
        - PRIMARY_EVIDENCE_STORED_OUTSIDE_GITHUB
        - GIT_COMMIT_HISTORY
        - DOMAIN_EVENTS_CREATED_AFTER_THE_PHYSIOLOGY_SNAPSHOT
    repository_to_physiology:
      exact_current_text_source: physiology_version
      active_version_resolution: current_pointer
      structural_cross_check: machine_readable_topology
      normative_component_cross_check:
        - logistics_protocol
        - data/ep-domain/observation/cycle-types/registry.yaml
        - data/ep-domain/observation/templates/cycle.yaml
        - data/ep-domain/observation/templates/event.yaml
  synchronization_rule:
    topology_change_requires_same_change_set:
      - UPDATE_EMBEDDED_TOPOLOGY_IN_DOMAIN_PHYSIOLOGY
      - UPDATE_MACHINE_READABLE_REPOSITORY_MAP
      - UPDATE_AFFECTED_PROTOCOL_OR_TEMPLATE
      - UPDATE_CURRENT_POINTER_IF_VERSION_CHANGES
    protocol_change_requires:
      - VERSIONED_PROTOCOL_FILE
      - DOMAIN_PHYSIOLOGY_INTEGRATION_OR_EXPLICIT_NORMATIVE_REFERENCE
      - TRACEABLE_OWNER_LPR_AUTHORITY
    drift_state: HOLD-REPOSITORY-PHYSIOLOGY-DRIFT
    silent_divergence: DENY
  recovery_priority:
    normative_meaning: DOMAIN_PHYSIOLOGY
    exact_current_domain_state: CANONICAL_FILES_ON_MAIN
    navigation_or_cache: DERIVED_INDEXES_REGENERATED_FROM_CANONICAL_RECORDS
  lifecycle_effect:
    physiology_transition: INTERNAL_QA_REMAINS
    oper_transitions: NONE
```

`EP-DP-DR-061` вводит не две конкурирующие копии истины, а два взаимно проверяемых представления. Физиология определяет смысл, обязательную топологию, контракты и активные процедуры. Репозиторий хранит точный текущий текст физиологии и фактические записи состояния. Производные индексы восстанавливаются из канонических записей; внешние первичные документы и история Git не считаются восстановимыми из одного snapshot физиологии.


## 1 / SYNTHESIS

Два исходных документа являются не конкурирующими описаниями, а ортогональными проекциями одного объекта.

| Проекция | Вопрос | Содержание |
|---|---|---|
| `EP-OSU` / анатомическая | Кто решает, исполняет и контролирует? Где проходит граница системы? | Одноузловое внутреннее ядро `OWNER_LPR`; внешние функции; нормы, риски и переходы ОСУ |
| `EP-OPERS` / физиологическая | Как меняется состояние товара, денег, данных и свидетельств? | 22 opers, их входы, действия, выходы, evidence, guards и допустимые пересечения |
| `EP-DP` / синтез | Как функции и субъекты удерживают повторяемый цикл замкнутым? | Органы-функции, потоки, интерфейсы, состояния, контроль, ремонт и рост |

```yaml
EP_DOMAIN_PHYSIOLOGY:
  CONTROLLED_SINGLE_NODE_CORE
  + ECONOMICS_SYSTEM
  + FORMALIZED_END_TO_END_TRADE_CYCLE
  + EXTERNAL_FUNCTION_INTEGRATION
  + TRACEABLE_INFORMATION_AND_EVIDENCE
  + OBSERVATION_AND_PROTOCOL_LEARNING
  + QUALITY_SECURITY_CONTROL
  + REPAIR_BEFORE_GROWTH
```

### 1.1 / ECONOMICS.NAMESPACE

`SOURCE_STATED + INFERRED`:

В источнике слово `Economics` используется на двух уровнях. В этой версии вводится различение:

```yaml
ECONOMICS.SYSTEM:
  meaning: верхнеуровневый повторяемый контур Elephant Pants
  contains: [IMPORT, LOGISTIC, SALES, ECONOMIC_REGULATION]

E.OPERS:
  ids: [E1, E2, E3, E4]
  meaning: бюджетирование, экономический контроль, сверка и распределение результата
  position: REGULATING_OPERS_OF_ECONOMICS.SYSTEM
  separate_organ_status: NOT_ASSERTED

OBSERVATION.RELATION:
  organ: O
  position: CROSS_CUTTING_ACROSS_ECONOMICS_SYSTEM_AND_PROJECTS
```

`E1–E4` не образуют четвёртый исполнительный цикл наравне с `Import`, `Logistic` и `Sales`. Это регулирующие opers верхнеуровневого контура.

`INFERRED` контракт, устраняющий дублирование бюджета:

```yaml
E4_OUTPUT:
  meaning: распределение фактического результата и доступный envelope реинвестирования
  evidence: allocation_decision + available_resource_envelope

E1_OUTPUT:
  meaning: бюджет конкретной следующей партии + ограничения + launch gate
  evidence: batch_budget_calculation + launch_decision
```

`E1` определён решением `EP-DP-DR-016`: запуск партии требует полного покрытия известной стоимости доступным cash после `E4` и/или подтверждённым инвестиционным капиталом; stockout risk может инициировать привлечение инвестиций, но не разрешает нефинансированную закупку. `E4` определён решениями `EP-DP-DR-014–015`: резерв `10%` подтверждённой выручки после возвратов и порядок `MANDATORY_OBLIGATIONS → RESERVE → CRITICAL_REPAIR_OR_COMPLIANCE → NEXT_BATCH_REPLENISHMENT → GROWTH`. `E2` minimum price gate определён `EP-DP-DR-013`; резерв времени `OWNER_LPR` определён отдельно `EP-DP-DR-005`.

`O / Observation` также не является четвёртым товарным циклом. Это поперечный орган наблюдения, который получает события и evidence из всех циклов, фиксирует их состояние и поддерживает обучение протокола.

### 1.2 / PURPOSE

`INFERRED`:

```yaml
purpose:
  TRANSFORM:
    - market_demand_signals
    - supplier_offer
    - available_capital
  THROUGH:
    - owner_LPR_assortment_decision
    - record_approved_EP_assortment
    - purchase
    - import
    - compliance
    - product_preparation
    - Ozon_sale
  INTO:
    - confirmed_sale
    - verified_cashflow
    - traceable_evidence
    - replenishment_or_repair_decision
```

---

## 2 / VALUE.REGISTER

Ценности образуют нормативный фильтр решений об ассортименте, продукте, контенте и развитии. Они не заменяют измеримые критерии качества и не подтверждают свойства товара без evidence. Все значения в колонках «Операционное влияние» и «Gate / evidence» являются `INFERRED / CANDIDATE`, а не дополнительными пользовательскими фактами.

| ID | Ценность | Операционное влияние v0.2 candidate | Gate / evidence | Состояние |
|---|---|---|---|---|
| `VAL-01` | Натуральные / целлюлозные материалы; исходная формулировка: «Органические материалы» | Выбор поставщика, модели и материала; содержание карточки товара | Подтверждение состава и происхождения материала; organic claim только при отдельном достаточном evidence | `CANDIDATE`; предварительно нормализовано `EP-DP-DR-032` |
| `VAL-02` | Яркость | Выбор принтов и цветов; визуальный каталог и контент | Визуальная оценка `OWNER_LPR`: принт/цвет воспринимается как яркий и выразительный; формальная цветометрическая метрика не требуется | `CANDIDATE`; критерий определён `EP-DP-DR-033` |
| `VAL-03` | Стиль | Ассортимент, сочетания, фото и подача товара | Визуальная оценка `OWNER_LPR`: товар/подача соответствует стилю бренда Elephant Pants; формальный внешний стандарт не требуется | `CANDIDATE`; критерий определён `EP-DP-DR-034` |
| `VAL-04` | Комфорт | Выбор конструкции, материала и размеров; отзывы и возвраты как сигналы | Оценка `OWNER_LPR` по образцу/носке + отсутствие устойчивого негативного feedback; положительные отзывы уже имеются | `CANDIDATE`; критерий определён `EP-DP-DR-035`; review refs `UNASSIGNED` |
| `VAL-05` | Дух свободы | Голос бренда, сценарии использования и коммуникация | Оценка `OWNER_LPR`: продукт/коммуникация поддерживает свободу, неформальность и свободный образ жизни; формальная метрика не требуется | `CANDIDATE`; критерий определён `EP-DP-DR-036` |
| `VAL-06` | Атмосфера солнечного Таиланда даже дома | Происхождение, сторителлинг, фото и пользовательский опыт | Атмосфера — оценка `OWNER_LPR`; текущее evidence тайского происхождения — логотип тайского бренда; последующее усиление — декларация | `CANDIDATE`; критерий определён `EP-DP-DR-037` |
| `VAL-07` | Тусовка: йога, нью-эйдж, вайб | Аудитория, партнёрства, контент, сообщество и тесты продвижения; перспективный маркетинговый маршрут | Оценка `OWNER_LPR`: продукт, контент, партнёрство или community-action соответствует yoga / new-age / social vibe; формальная метрика не требуется | `CANDIDATE`; критерий определён `EP-DP-DR-038` |

```yaml
VALUE.GATES:
  LIFECYCLE_STATE: CANDIDATE
  SPECIFICATION_STATE: DEFINED
  ACTIVATION_STATE: ACTIVE_FOR_OWNER_LPR_DECISIONS
  NATURAL_OR_CELLULOSIC_MATERIAL_POSITIONING -> MATERIAL_COMPOSITION_EVIDENCE_REQUIRED
  ORGANIC_MATERIAL_CLAIM -> SUPPLY_CHAIN_AND_ORGANICITY_EVIDENCE_REQUIRED
  BRIGHTNESS -> OWNER_LPR_VISUAL_JUDGMENT_REQUIRED
  STYLE -> OWNER_LPR_VISUAL_JUDGMENT_REQUIRED
  COMFORT -> OWNER_LPR_ASSESSMENT_AND_MARKET_FEEDBACK_REQUIRED
  FREEDOM -> OWNER_LPR_BRAND_JUDGMENT_REQUIRED
  THAI_ATMOSPHERE -> OWNER_LPR_BRAND_JUDGMENT_REQUIRED
  THAI_ORIGIN -> CURRENT_BRAND_EVIDENCE_AND_FUTURE_DECLARATION
  COMMUNITY -> OWNER_LPR_BRAND_JUDGMENT_REQUIRED + PERSPECTIVE_MARKETING_ROUTE

GENERAL.FACTUAL.CLAIM.GATE:
  IF_THAI_ORIGIN_IS_FACTUALLY_CLAIMED -> ORIGIN_EVIDENCE_REQUIRED
```

`VAL-06` задаёт желаемую атмосферу бренда и отдельно фиксирует factual claim тайского происхождения. Атмосфера определяется `OWNER_LPR`; текущим операционным evidence происхождения принят логотип тайского бренда, последующим усилением — декларация.

```yaml
VAL_01_STATUS:
  ORIGINAL_VALUE_INTENT: ORGANIC_MATERIALS
  PRELIMINARY_OPERATIONAL_FORM: NATURAL_OR_CELLULOSIC_MATERIALS
  CURRENT_MATERIAL: RAYON
  CHINRADA_TO_MATERIAL_MANUFACTURER_LINK: NOT_CONFIRMED
  ORGANIC_PROPERTY: NOT_CONFIRMED
  ORGANIC_CLAIM_PUBLICATION: BLOCKED_PENDING_EVIDENCE
  TODO_REF: EPDP-OI-010
  TODO: CONFIRM_CHINRADA_LINK_TO_THAI_RAYON_OR_OTHER_MATERIAL_MANUFACTURER_AND_OBTAIN_ORGANICITY_OR_ORIGIN_EVIDENCE
```

`VALUE_CRITERIA_DEFINED`: `VAL-01` предварительно нормализован `EP-DP-DR-032`, при этом evidence supply-chain/organicity остаётся отдельным `EPDP-OI-010`; `VAL-02–06` определены `EP-DP-DR-033–037`; `VAL-07` определён `EP-DP-DR-038` и дополнительно задаёт перспективный маркетинговый маршрут. `EPDP-OI-009` закрыт на design/specification scope.

---

## 3 / DOMAIN.BOUNDARY

### 3.1 / INTERNAL.CORE

```yaml
state: FORMING_SINGLE_NODE
node: OWNER_LPR
owner_mode: SVOU
hierarchy: NONE
decision_node: OWNER_LPR
capacity_limit: OWNER_RESOURCE
capacity_policy_ref: EP-DP-DR-005
capacity_measurement_state: NOT_MEASURED_PENDING_INTERNAL_QA_OR_RUNTIME
near_target: CONTROLLED_SINGLE_NODE
```

| Внутренний субъект | Состояние | Функция |
|---|---|---|
| `OWNER_LPR` | `SOURCE_STATED / ACTIVE` | Владение, решение, бюджет, закупка, интеграция логистики, контроль, ассортимент, аналитика |
| `OPERATION_EXECUTOR` | `INACTIVE`; условие перехода: `T-01 / FIRST_EMPLOYEE` | Возможный исполнитель маркировки, упаковки, движения товара и подготовки отгрузки |

`SOURCE_STATED`: линейная ОСУ отсутствует; устойчивой связи `MANAGER > SUBORDINATE` сейчас нет.

### 3.2 / EXTERNAL.FUNCTION.CONTOUR

| ID | Внешняя функция | Текущая привязка в opers |
|---|---|---|
| `EXT-01` | Тайская фабрика / производство | ChinRada в `I1–I4` |
| `EXT-02` | Международная перевозка | `I5`, `L(I)1–L(I)4` |
| `EXT-03` | Таможенное сопровождение | `L(I)3` |
| `EXT-04` | Маркировка / системы | Внешняя инфраструктура для `L(R)2–L(R)4`; технический исполнитель opers — `OWNER_LPR` по `EP-DP-DR-004` |
| `EXT-05` | Ozon marketplace catalog / FBO / последняя миля | `OZON_CATALOG`, `L(R)5–L(R)7`, `S1–S2`; публикация выполняется `A2` по `EP-DP-DR-029` |
| `EXT-06` | Платёжная и информационная инфраструктура | `I4`, `S2`, `E1–E4` |
| `EXT-07` | Юридические, сертификационные и технические услуги | Контур проектов и compliance |

`SOURCE_STATED`: в `L(R)2–L(R)4` внешняя система даёт инфраструктуру, а техническое исполнение, приёмка результата и владение контролем назначены `OWNER_LPR` решением `EP-DP-DR-004`. Это не доказывает независимость проверки.

```yaml
MARKING_SYSTEM: EXTERNAL_INFRASTRUCTURE
MARKING_EXECUTOR: OWNER_LPR
MARKING_EXTERNAL_ROLE: INFRASTRUCTURE_PARTICIPANT
MARKING_CONTROL_OWNER: OWNER_LPR
INDEPENDENT_MARKING_CONTROL: METHOD_SELECTED_PER_ACTION_UNDER_EP-DP-DR-012
INDEPENDENT_CONTROL_SPECIFICATION: RESOLVED
INDEPENDENT_CONTROL_RUNTIME_EVIDENCE: NOT_YET_TESTED
```

```yaml
EXTERNAL_INTERFACE_REQUIRED:
  - function
  - input
  - output
  - deadline
  - cost
  - acceptance
  - evidence
  - fallback

invariants:
  - INDEPENDENT_FACTORY != OWN_PRODUCTION
  - CONTRACTOR != EP_SUBDIVISION
  - EXTERNAL_EXPERT != OWNER_LPR
  - OZON_CHANNEL != EP_DIVISION
```

### 3.3 / SYSTEM.STATE

```yaml
organization_state: FORMING
trade_cycle_state: REPEATING
management_system_state: FORMING
SYSTEM_ACTIVITY: TRADE
PRODUCTION_MODEL: EXTERNAL_INDEPENDENT_MANUFACTURING
EP_ROLE: ASSORTMENT_BRAND_AND_COMMERCE_OPERATOR
OWN_PRODUCTION: false
PRODUCING_SELLING:
  term_status: REJECTED_AS_AMBIGUOUS
  replacement_terms: [TRADE, EXTERNAL_INDEPENDENT_MANUFACTURING]
LEGAL_IMPORTER_STATUS: NOT_DEFINED_BY_THIS_DECISION
classification_ref: EP-DP-DR-003
organization: MONO
internal_scale: MICRO
dominant_OSU: NEW_STRUCTURE
secondary_mechanism: LINE_STAFF_WITH_EXTERNAL_EXPERTS
priority_rule: IF_RESOURCE_CONFLICT_OR_CRITICAL_REPAIR_OPEN -> REPAIR_FIRST
```

`SOURCE_STATED`: функциональная trade classification утверждена решением `EP-DP-DR-003`; юридическая квалификация и compliance-статус в scope решения не входят.

`INFERRED`: `LINE_STAFF` здесь описывает взаимодействие ЛПР с внешними экспертами, а не уже сформированную линейно-штабную иерархию.

### 3.4 / CATALOG.BOUNDARY

`SOURCE_STATED`: решение `EP-DP-DR-002`.

| Entity | Граница | Владелец / источник | Состояние |
|---|---|---|---|
| `SUPPLIER_OFFER` | `EXTERNAL_INPUT` | ChinRada | Доступные модели, принты, наличие и условия; не является каталогом Elephant Pants |
| `MARKET_DEMAND_SIGNALS` | `EXTERNAL_INPUT` | Рынок / Ozon / feedback sources | Сигналы спроса; не принимают ассортиментное решение |
| `EP_ASSORTMENT_REGISTER` | `INTERNAL_CONTROLLED_ENTITY` | `OWNER_LPR` | Утверждённый состав ассортимента; технический source of truth назначен `EP-DP-DR-009`: `valerol/ep_dashboard@main`, namespace `data/ep-domain/` |
| `OZON_CATALOG` | `EXTERNAL_PUBLICATION_INTERFACE` | Платформа: Ozon; content/assortment decision: `OWNER_LPR` | Публикационная проекция внутреннего ассортимента |

```text
SUPPLIER_OFFER + MARKET_DEMAND_SIGNALS
→ A1 / FORM_EP_ASSORTMENT
→ EP_ASSORTMENT_REGISTER
→ A2 / CREATE_OR_UPDATE_OZON_PRODUCT_CARD
→ OZON_CATALOG
```

Boundary определена `EP-DP-DR-002`, oper route — `EP-DP-DR-029`; value criteria определены `EP-DP-DR-032–038`, `EPDP-OI-009: RESOLVED`; source of truth — `EP-DP-DR-009 / valerol/ep_dashboard@main`.

---

## 4 / FUNCTIONAL.ANATOMY

Раздел различает орган, класс цикла, управляющую функцию и проектный контур. Ни один из этих типов сам по себе не означает отдел, должность или юридическое лицо.

| Entity | Онтологический тип | Назначение | Opers / нормы | Состояние |
|---|---|---|---|---|
| `VALUE_FILTER` | `CONTROL_FUNCTION` | Проверять решения на соответствие заявленным ценностям | `VAL-01–07` | Критерии определены; применяются к релевантным решениям; отдельного oper нет |
| `OBSERVATION` | `ORGAN` | Определять принадлежность действия циклу, вести состояние циклов, фиксировать закрытие и обновлять протокол по значимому evidence | `O1–O5`, `EP-OSU-09,11,12` | `CANDIDATE`; поперечный, есть открытые долги |
| `E.OPERS` | `GOVERNANCE_FUNCTION` | Бюджет, цена, фактический результат, распределение | `E1–E4` | Определены; отдельный орган не утверждён |
| `IMPORT` | `CYCLE_CLASS` | Преобразовать потребность в оплаченную и переданную логистике партию | `I1–I5` | Повторяемый |
| `LOGISTIC.IMPORT` | `CYCLE_CLASS` | Преобразовать готовый груз у фабрики в законно полученную в России партию | `L(I)1–L(I)4` | Повторяемый; зависит от внешних функций |
| `LOGISTIC.RUSSIA` | `CYCLE_CLASS` | Преобразовать полученную партию в подтверждённый остаток Ozon | `L(R)1–L(R)7` | Повторяемый |
| `SALES` | `CYCLE_CLASS` | Преобразовать доступный остаток в продажу, отчёт, выплату и обработать возврат | `S1–S3` | Повторяемый |
| `INFORMATION_EVIDENCE` | `CONTROL_FUNCTION` | Обеспечить единые данные и доказуемость каждого перехода | `EP-OSU-04,08,09` | `REQUIRED`; неполный |
| `QUALITY_SECURITY` | `CONTROL_FUNCTION` | Локализовать ошибки кода, количества, упаковки, документов и передачи | `EP-OSU-08` | `REQUIRED`; неполный |
| `EXTERNAL_INTEGRATION` | `CONTROL_FUNCTION` | Ставить задачу внешней функции и принимать terminal result | `EP-OSU-01,10` | `REQUIRED`; неполный |
| `PROJECT_REPAIR_GROWTH` | `PROJECT_CONTOUR` | Закрывать нестандартный дефект или создавать новую способность | `EP-OSU-06,07,11` | Карточки и exit/handoff contract определены; runtime projects сохраняют собственные состояния |
| `AUTHORITY_DELEGATION` | `CONTROL_FUNCTION` | Связать решение, ответственность, исполнение и независимый контроль | `EP-OSU-02,03,05,13` | Одноузловой |
| `FEEDBACK` | `CONTROL_FUNCTION` | Разделять текущий операционный контроль и стратегический пересмотр | `F1–F2`, `EP-OSU-12` | `CANDIDATE`; cadence определён `EP-DP-DR-031` |

Текущий контур полномочий одноузловой. Делегирование активируется только при фактическом отделении устойчивой функции или операции; первый сотрудник не объявлен обязательным состоянием v0.2 candidate.

### 4.1 / CURRENT.ROLE.TOPOLOGY

```text
OWNER_LPR
  -> DECIDE
  -> BUDGET
  -> INTEGRATE_EXTERNAL_FUNCTIONS
  -> EXECUTE_OR_ASSIGN
  -> ACCEPT
  -> CONTROL
  -> ANALYZE
```

Это `SOURCE_STATED` состояние, но не целевая норма. Функции остаются различимыми даже при одном исполнителе.

```yaml
function_split_target: DECIDE != EXECUTE != CONTROL != ANALYZE
control_invariant: EXECUTION != CONTROL_BY_SUBJECT_OR_TIME
control_invariant_status: DEFINED_BY_EP_DP_DR_012_RUNTIME_NOT_YET_TESTED
CURRENT_ROLE_COLOCATION: ALLOWED
ROLE_SEMANTIC_MERGE: DENY

ROLE_ASSIGNMENT:
  RESPONSIBLE: OWNER_LPR
  INTERNAL_EXECUTOR: OWNER_LPR
  CONTROL_OWNER: OWNER_LPR
  applies_to_all_32_opers: true
  decision_ref: EP-DP-DR-004
  extension_refs: [EP-DP-DR-029, EP-DP-DR-030]
```

### 4.2 / RESPONSIBILITY.AND.AUTHORITY.MATRIX

`SOURCE_STATED`: `EP-DP-DR-004`. `INTERNAL_EXECUTOR` обозначает внутреннюю часть oper и интеграцию terminal result; физическую работу внешней функции он не присваивает `OWNER_LPR`.

| Function | Oper | Responsible | Internal executor | Control owner | External participant |
|---|---|---|---|---|---|
| `ASSORTMENT / SELECTION` | `A1` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-01` as offer source |
| `CATALOG / OZON_PUBLICATION` | `A2` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-05` platform |
| `IMPORT / ASSORTMENT` | `I1` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-01` |
| `IMPORT / PROCUREMENT` | `I2` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-01` |
| `IMPORT / PRODUCT_PREPARATION_SUPPORT` | `I3` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | — |
| `IMPORT / BUDGET_PAYMENT` | `I4` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-01`, `EXT-06` |
| `IMPORT / SUPPLIER_HANDOFF` | `I5` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-01` |
| `LOGISTIC.IMPORT / INTERNATIONAL_TRANSPORT_INTEGRATION` | `L(I)1` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-01`, `EXT-02` |
| `LOGISTIC.IMPORT / TRANSFER_CONTROL` | `L(I)2` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-01`, `EXT-02` |
| `LOGISTIC.IMPORT / CUSTOMS_COMPLIANCE_INTEGRATION` | `L(I)3` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-02`, `EXT-03` |
| `LOGISTIC.IMPORT / LOGISTICS_ACCEPTANCE` | `L(I)4` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-02` |
| `LOGISTIC.RUSSIA / QUALITY_RECOUNT` | `L(R)1` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | — |
| `LOGISTIC.RUSSIA / MARKING_INFORMATION` | `L(R)2` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-04` infrastructure |
| `LOGISTIC.RUSSIA / MARKING_PRODUCT_PREPARATION` | `L(R)3` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-04` infrastructure |
| `LOGISTIC.RUSSIA / PRODUCT_PREPARATION_QC` | `L(R)4` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-04` infrastructure |
| `LOGISTIC.RUSSIA / OZON_FBO_INTEGRATION` | `L(R)5` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-05` |
| `LOGISTIC.RUSSIA / STOCK_MOVEMENT` | `L(R)6` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-05` |
| `LOGISTIC.RUSSIA / OZON_RECONCILIATION_QC` | `L(R)7` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-05` |
| `SALES / MARKETPLACE_SALES` | `S1` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-05` |
| `SALES / FINANCE_PAYOUT_RECONCILIATION` | `S2` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-05`, `EXT-06` |
| `SALES / RETURN_INTEGRATION` | `S3` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-05` |
| `FEEDBACK / OPERATIONAL_REVIEW` | `F1` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | Ozon/system/incident sources |
| `FEEDBACK / STRATEGIC_REVIEW` | `F2` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | accumulated internal/external evidence |
| `E.OPERS / GOVERNANCE_BUDGET` | `E1` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-06` |
| `E.OPERS / GOVERNANCE_PRICE_ANALYTICS` | `E2` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-05`, `EXT-06` |
| `E.OPERS / GOVERNANCE_RESULT_RECONCILIATION` | `E3` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-05`, `EXT-06` |
| `E.OPERS / GOVERNANCE_ALLOCATION` | `E4` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | `EXT-06` |
| `OBSERVATION / CYCLE_CLASSIFICATION` | `O1` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | — |
| `OBSERVATION / CYCLE_REGISTRATION` | `O2` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | — |
| `OBSERVATION / CYCLE_STATE_UPDATE` | `O3` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | — |
| `OBSERVATION / CYCLE_CLOSURE_RECORDING` | `O4` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | — |
| `OBSERVATION / PROTOCOL_CHANGE` | `O5` | `OWNER_LPR` | `OWNER_LPR` | `OWNER_LPR` | — |

```yaml
MATRIX_COVERAGE:
  TOTAL_OPERS: 32
  RESPONSIBLE_ASSIGNED: 32
  INTERNAL_EXECUTOR_ASSIGNED: 32
  CONTROL_OWNER_ASSIGNED: 32
  OBSERVATION_EXECUTOR_ASSIGNED: 5
  PROTOCOL_CHANGE_AUTHORITY: OWNER_LPR
  ACTIVE_DELEGATIONS: 0
  INDEPENDENT_CONTROL_MECHANISM_DEFINED: true
  INDEPENDENT_CONTROL_METHODS: [TIME_SEPARATED_SELF_RECHECK, ISOLATED_LLM_REVIEW, EXTERNAL_SPECIALIST_REVIEW]
  INDEPENDENT_CONTROL_DECISION_REF: EP-DP-DR-012
  INDEPENDENT_CONTROL_RUNTIME_EVIDENCE: NOT_YET_TESTED
```

Внешний участник производит внешний результат или даёт инфраструктуру. Он не становится `RESPONSIBLE`, `CONTROL_OWNER` или подразделением Elephant Pants.

### 4.3 / OWNER.RESOURCE.AND.WIP

`SOURCE_STATED`: `EP-DP-DR-005`.

```yaml
OWNER_RESOURCE_POLICY:
  unit: OWNER_LPR_HOUR
  scope: EP_DOMAIN_ONLY
  horizon_days: 7
  capacity_input: OWNER_LPR_WEEKLY_DECLARATION
  declaration_boundary: AVAILABLE_TO_EP_AFTER_NON_EP_OBLIGATIONS
  owner_time_reserve_percent: 20
  maximum_planned_commitment_percent: 80
  planned_load_formula: SUM_UNIQUE_EP_WORK_ITEM_PLANNED_OWNER_LPR_HOURS
  planned_load_categories: [REGULAR_TRADE, EP_EXTERNAL_COMMITMENTS, PROJECT_CYCLES]
  planned_load_category_semantics: TAGS_NOT_ADDITIVE_BUCKETS
  planned_load_invariant: EACH_PLANNED_OWNER_LPR_HOUR_COUNTED_ONCE

PROJECT_WIP_POLICY:
  counted: REPAIR_OR_GROWTH_PROJECT_CYCLES_WITH_WIP_LOCAL_STATE_ACTIVE_AND_OWNER_TIME_ALLOCATED_AND_TERMINAL_NOT_REACHED
  limit: 2
  new_project_decision_if_active_count_greater_than_or_equal_to_2: HOLD
  overload_if: [PLANNED_LOAD_OVER_80_PERCENT, ACTIVE_PROJECT_COUNT_OVER_2, CRITICAL_REPAIR_OPEN]
  overload_action: [HOLD_NEW_GROWTH, PAUSE_LOWEST_PRIORITY_AS_NEEDED_TO_RESTORE_WIP_AND_HOUR_LIMITS, REPLAN_7_DAY_WINDOW]
  overload_postconditions: [ACTIVE_PROJECT_COUNT_AT_MOST_2, PLANNED_LOAD_AT_OR_BELOW_80_PERCENT]
  no_pausable_project_fallback: OVERLOAD_REMAINS_ACTIVE_AND_NEW_GROWTH_STAYS_HOLD_UNTIL_REPLAN_RESTORES_HOUR_LIMIT
  excludes_from_WIP: [REGULAR_TRADE_CYCLES, PRE_START_HOLD_PROJECTS, PAUSED_NONTERMINAL_PROJECTS]
  pause_effect: RELEASE_OWNER_TIME_ALLOCATION_AND_REMOVE_FROM_ACTIVE_WIP_WITHOUT_TERMINAL_CLOSURE
  project_lifecycle_mapping: TO_BE_DEFINED_IN_EPDP_OI_021

MEASUREMENT:
  design_defined: true
  actual_weekly_capacity: NOT_MEASURED
  actual_load: NOT_MEASURED
  actual_WIP: NOT_MEASURED
  measure_in: INTERNAL_QA_OR_RUNTIME
```

При конфликте ресурса действует `CRITICAL_REPAIR_OR_COMPLIANCE > EP_CURRENT_EXTERNAL_COMMITMENTS > REGULAR_TRADE_CYCLE > GROWTH`. Текущие external commitments означают обязательства Elephant Pants перед контрагентами, а не внешнюю занятость `OWNER_LPR`. Категории — теги приоритета и трассировки, а не складываемые корзины: каждый запланированный час `OWNER_LPR` учитывается один раз по `EP_WORK_ITEM_ID`. Любой `REPAIR` имеет приоритет над `GROWTH` только при фактическом конфликте ресурса; открытый `CRITICAL_REPAIR` сам является overload condition. Для допуска критического ремонта или работы, которую `OWNER_LPR` классифицировала как compliance, при необходимости приостанавливается более низкоприоритетный проект; точный compliance gate определён `EP-DP-DR-043`; `EPDP-OI-020: RESOLVED`.

### 4.4 / ORGANIZATIONAL.TRANSITIONS

| Transition | Gate | Result | Invariant / risk |
|---|---|---|---|
| `T-01 / FIRST_EMPLOYEE` | Фактически отделена устойчивая операция и появился первый сотрудник | `SIMPLE_LINEAR_OSU`: `OWNER_LPR → OPERATION_EXECUTOR` | Один источник команд; явные полномочия, задача и результат; внешний эксперт не командует исполнителем |
| `T-02 / FUNCTIONAL_GROWTH` | Возникли устойчивые направления и контроль их взаимодействия | `LINE_FUNCTIONAL_OSU` | `DIRECTION != REQUIRED_DEPARTMENT`; риск `FUNCTIONAL_LINEAR_CONFLICT` |

Возможные направления `T-02`: procurement; logistic/customs/marking; marketplace/stock; content/promotion; finance; quality. Их наличие не требует автоматически создавать отделы или должности.

### 4.5 / EXCLUDED_OR_PREMATURE.OSU

| OSU | Состояние сейчас | Основание |
|---|---|---|
| Чистая функциональная | `DENY` | Риск множественного подчинения |
| Матричная | `DENY` | Постоянное двойное подчинение |
| Процессная ОСУ | `DENY` | Сквозной процесс обязателен; владельцы процессов как структура пока не нужны |
| Дивизиональная | `PREMATURE` | Нет автономных ресурсов, операций, руководства и P&L |
| Региональная | `INACTIVE` | Нет автономных региональных операций |
| Холдинговая | `INACTIVE` | Нет самостоятельных организаций |

---

## 5 / REGULAR.PHYSIOLOGY

### 5.1 / ROUTE

```text
A1 / assortment decision
→ E1 / budget gate
→ I1 → I2 → I4 → I5
→ L(I)1 → L(I)2 → L(I)3 → L(I)4
→ L(R)1 → L(R)2 → L(R)3 → L(R)4 → L(R)5 → L(R)6 → L(R)7
→ S1 → S2
→ E3 → E4
→ next A1 / assortment review
```

`A2 / product-card publication` запускается после `A1`, когда доступны необходимые product data; может идти параллельно закупке и логистике, но обязан завершиться для соответствующего SKU до `S1`.

`S3 / PROCESS_OZON_RETURN` — event-driven ветка после продажи: `CUSTOMER_RETURN → OZON_WAREHOUSE → OZON_CLASSIFICATION → RESTOCK_OR_DISPOSITION → OZON_FINANCIAL_REPORT → E3`. Если возврата нет, `S3` не является обязательным шагом main route.

`E2` связан с `S1` и выполняется во время продаж. `I3` запускается после определения объёма в `I2`, может идти параллельно `I4–L(R)3`, не является gate для `I5`, но обязан завершиться до `L(R)4`. По `EP-DP-DR-017` minimum для каждого расходника = `CEIL(planned next-batch need × 1.10)`; дефицит вызывает replenishment и `HOLD` перед `L(R)4` до физического наличия требуемого количества.

#### 5.1.1 / CURRENT.SUPPLIER.CARRIER.HANDOFF

`SOURCE_STATED / EP-DP-DR-018`:

```yaml
I5_CURRENT_CONTRACT:
  physical_delivery_to_carrier: SUPPLIER
  owner_pickup_request: NOT_USED
  owner_receives_from_supplier:
    - SUPPLIER_TRACKING_NUMBER
    - PARCEL_PHOTO
  I5_COMPLETE_IF:
    - SUPPLIER_DISPATCH_CONFIRMED
    - SUPPLIER_TRACKING_NUMBER_RECORDED
    - PARCEL_PHOTO_RECORDED

LI1_CURRENT_SEQUENCE:
  1: TRACKING_SHOWS_ARRIVAL_AT_CARRIER OR CARRIER_INFORMS_OWNER
  2: OWNER_AND_CARRIER_AGREE_RECEIPT_POINT

LI2_CURRENT_SEQUENCE:
  1: CARRIER_ISSUES_INVOICE
  2: OWNER_PAYS_INVOICE
  3: CARRIER_PROVIDES_INTERNATIONAL_TRACKING_NUMBER

ALTERNATE_SEQUENCE:
  status: NOT_OBSERVED
```

Текущая схема фиксирует только наблюдаемый порядок. Альтернативный workflow не предполагается без нового evidence.

### 5.2 / OPER.CROSSWALK

```yaml
REGULAR_OPER_OBJECT_INHERITANCE:
  applies_to: [A1-A2, I1-I5, L(I)1-L(I)4, L(R)1-L(R)7, S1-S3, E1-E4, F1-F2]
  lifecycle_state: CANDIDATE
  canon_hold_codes:
    - HOLD-OBJECT-INCOMPLETE
    - HOLD-OBJECT-REFERENCE-UNRESOLVED
```

Это правило назначает object lifecycle и hold-коды каждой из 27 строк ниже. Колонка `Legacy marker` сохраняет только исходную локальную метку EP-OPERS и не заменяет канонические поля.

| Oper | Преобразование состояния | Функция / внешний интерфейс | Критическое evidence | Legacy marker |
|---|---|---|---|---|
| `A1` | Market demand signals + supplier offer → утверждённый `EP_ASSORTMENT_REGISTER` | Assortment decision / OWNER_LPR | Решение об ассортименте + refs доступных сигналов | `NO_LEGACY_TODO` |
| `A2` | Утверждённый ассортимент + product data → актуальная карточка Ozon | Catalog publication / Ozon | Product-card ref / system status / OWNER_LPR confirmation fallback | `NO_LEGACY_TODO` |
| `I1` | Решение о закупке + список предпочтений → актуальное наличие | Ассортимент / ChinRada | Ответ поставщика + файл | `NO_LEGACY_TODO` |
| `I2` | Актуальное наличие → согласованная заявка + запрос счёта | Закупка / ChinRada | Финальная заявка + письмо | `NO_LEGACY_TODO` |
| `I3` | Объём партии → достаточные расходники или заявка пополнения | Product preparation / support | Остаток или подтверждение закупки | `LEGACY_TODO` |
| `I4` | Проверенный счёт → оплаченный заказ | Budget / payment infrastructure | Платёж + подтверждение поставщика | `NO_LEGACY_TODO` |
| `I5` | Оплаченный готовый заказ → посылка отправлена поставщиком международному перевозчику | Supplier handoff / ChinRada | Трекинг поставщика + фото посылки | `LEGACY_TODO` |
| `L(I)1` | Посылка в пути к перевозчику → поступление перевозчику подтверждено + пункт приёмки согласован | International transport coordination | Статус трекинга или сообщение перевозчика + согласованный пункт приёмки | `NO_LEGACY_TODO` |
| `L(I)2` | Груз у перевозчика + согласованный пункт приёмки → перевозка оплачена + международный трекинг получен | Carrier billing / payment / shipment acceptance | Счёт + подтверждение оплаты + tracking number перевозчика | `LEGACY_TODO` |
| `L(I)3` | Груз у перевозчика + документы → законный ввоз в Россию | Transport / customs / compliance | Транспортные и таможенные документы | `NO_LEGACY_TODO` |
| `L(I)4` | Завершённый ввоз → партия в российском контуре | Logistics / acceptance | Акт, накладная, фото, сверка | `NO_LEGACY_TODO` |
| `L(R)1` | Полученный груз → пересчитанные единицы + визуальное сопоставление паттернов с SKU заказа + зафиксированные расхождения | Recount / visual SKU reconciliation | Фактический пересчёт + список заказа; идентификация SKU по видимому паттерну выполняется `OWNER_LPR` по памяти | `LEGACY_TODO` |
| `L(R)2` | Подтверждённый состав → товарные единицы приняты системой маркировки | Marking / information / Честный Знак | Статус товарной единицы `«в обороте»` в системе «Честный Знак» | `LEGACY_TODO` |
| `L(R)3` | Коды + Ozon-данные → упорядоченные этикетки | Marking / product preparation | Файлы печати + образец | `NO_LEGACY_TODO` |
| `L(R)4` | Товар + этикетки + расходники → готовые единицы Ozon | Product preparation / QC | Ведомость + фото или видео | `NO_LEGACY_TODO` |
| `L(R)5` | Готовые единицы → зарегистрированная поставка и грузоместа | Ozon FBO interface | Номер поставки + состав + таймслот | `NO_LEGACY_TODO` |
| `L(R)6` | Зарегистрированная поставка + собранные маркированные коробки + наступивший таймслот → груз передан Ozon | Stock movement / Ozon | Акт, накладная или статус | `NO_LEGACY_TODO` |
| `L(R)7` | Переданный груз → подтверждённая приёмка или разбор | Ozon reconciliation / QC | Акт приёмки + остатки | `NO_LEGACY_TODO` |
| `S1` | Принятый доступный остаток + добавленные карточки → заказы и данные реализации | Market / Ozon | Отчёты о заказах и продажах | `NO_LEGACY_TODO` |
| `S2` | Реализация и начисления → cashflow + закрывающие данные | Finance / Ozon / bank | Акт, отчёт, поступление | `NO_LEGACY_TODO` |
| `S3` | Customer return → Ozon-классификация → возвращённый в продажу остаток либо disposition + финансовое отражение | Returns / Ozon | Ozon return status + stock/disposition status + financial report; physical inspection if returned to seller | `NO_LEGACY_TODO` |
| `F1` | Недельные operational signals → operational review + action/no-change decision | Feedback / OWNER_LPR | Review record + supporting refs | `NO_LEGACY_TODO` |
| `F2` | Квартальная накопленная картина → strategic review + strategic decision/no-change | Feedback / OWNER_LPR | Strategic review record + supporting refs | `NO_LEGACY_TODO` |
| `E1` | Остаток + обязательства + прошлый цикл → бюджет и разрешение | Decision / budget | Расчёт + решение о запуске | `LEGACY_TODO` |
| `E2` | Себестоимость + комиссии + цена → допустимая цена или ремонт | Analytics / market control | Расчёт юнит-экономики с датой и исходными значениями | `NO_LEGACY_TODO` |
| `E3` | Отчёты + расходы → фактический результат | Analytics / reconciliation | Отчёт партии + первичные документы | `NO_LEGACY_TODO` |
| `E4` | Результат + обязательства + ремонт → распределение и новый бюджет; в синтезе: envelope ресурса следующего цикла | Decision / projects / budget | Источник: решение о распределении cashflow + новый бюджет | `LEGACY_TODO` |

### 5.2.1 / L(R)1.CURRENT.RECOUNT

`SOURCE_STATED / CURRENT_PROCESS`:

```yaml
LR1_CURRENT_PROCESS:
  executor: OWNER_LPR
  recount: ALL_RECEIVED_UNITS
  sku_identification:
    method: VISIBLE_COLOR_PATTERN_MATCHED_TO_ORDER_SKU_BY_OWNER_MEMORY
    independent_reference: NOT_USED
  original_garment_packaging:
    default: KEEP_SEALED
    open_if:
      - PHOTO_REQUIRED
      - ORIGINAL_PACKAGING_DAMAGED
  garment_damage_check:
    if_original_packaging_intact: NOT_INSPECTED
    if_original_packaging_damaged: OPEN_AND_INSPECT_GARMENT
  deviation_actions:
    any_quantity_or_assortment_deviation:
      - RECORD_INCIDENT
      - DISCUSS_WITH_SUPPLIER
    shortage:
      - CONTACT_SUPPLIER
      - IF_UNRESOLVED_CONTACT_CARRIER
    extra_unit:
      - INFORM_SUPPLIER
  tolerance: NOT_APPLICABLE
  working_input: ACTUAL_RECEIVED_GOODS
```

`NOT_CONFIRMED`: целая внешняя/оригинальная упаковка не является evidence отсутствия повреждения одежды; в текущем процессе это свойство не проверяется.


```yaml
REGULAR_OPER.CANON_STATUS:
  TOTAL: 27
  LIFECYCLE_CANDIDATE: 27
  HOLD_OBJECT_INCOMPLETE_ACTIVE: 0
  HOLD_OBJECT_REFERENCE_UNRESOLVED_ACTIVE: 0
  OBJECT_LEVEL_COMPLETENESS_AUDIT_REF: EP-DP-DR-054
  LEGACY_TODO_MARKERS: 7
  WITHOUT_LEGACY_TODO_MARKER: 20
```

Все 27 regular opers остаются `CANDIDATE`. После `EP-DP-DR-054` definition-level completeness и references подтверждены; старые `TODO` сохранены только как provenance markers и не являются активными object hold-кодами. Переход `CANDIDATE → OBSERVED` отдельно не авторизован.

### 5.3 / PARTIAL.OVERLAPS

| Пересечение | Допустимо | Gate |
|---|---|---|
| `I2 ↔ I3` | Проверять расходники после определения объёма | `I3` завершён до `L(R)4` |
| `I4 ↔ I5` | Поставщик может готовить внутреннюю отправку после оплаты | `I5` фиксируется только после фактической отправки поставщиком и получения tracking + photo |
| `L(I)3 ↔ L(R)2` | Готовить данные маркировки в пути | Фактический набор сверен после `L(R)1` |
| `L(R)2 ↔ L(R)3` | Готовить макеты печати заранее | Полный тираж после получения и проверки кодов |
| `L(R)5 ↔ L(R)4` | Проектировать поставку во время упаковки | Финальные грузоместа только по готовым единицам |
| `S1 ↔ E2` | Пересчитывать экономику во время продаж | Цена не нарушает минимальное ценовое правило |
| `S2 ↔ E3` | Начинать сверку по частичным отчётам | Результат закрывается только по полному evidence |

### 5.4 / OPER.RUNTIME.GUARDS

Индивидуальные режимы ожидания из EP-OPERS:

| Oper | Runtime guard |
|---|---|
| `I1` | После отправки запроса — `HOLD` до ответа ChinRada |
| `I2` | После запроса счёта — `HOLD` до его получения |
| `I4` | После оплаты — `HOLD` до подтверждения платежа |
| `L(I)1` | `HOLD` до готовности партии |
| `L(I)3` | `HOLD` на время перевозки и внешних процедур |
| `L(R)5` | `HOLD`, если точка приёмки или таймслот недоступны |
| `L(R)7` | `HOLD` до акта приёмки и обновления остатков |
| `S2` | `HOLD` до формирования отчётности Ozon |
| `E3` | `HOLD` при неполном наборе данных |

`READY` в исходном oper означает допустимость запуска при подтверждённом входе; появление `HOLD` после действия не отменяет спецификационную определённость oper.

---

## 6 / OBSERVATION.PHYSIOLOGY

### 6.1 / POSITION

```yaml
organ: O.OBSERVATION
type: CROSS_CUTTING
oper_ids: [O1, O2, O3, O4, O5]
current_responsible: OWNER_LPR
current_executor: OWNER_LPR
current_control_owner: OWNER_LPR
protocol_change_authority: OWNER_LPR
active_delegation: NONE
assignment_ref: EP-DP-DR-004
observed_boundaries:
  - ECONOMICS.SYSTEM
  - IMPORT
  - LOGISTIC.IMPORT
  - LOGISTIC.RUSSIA
  - SALES
  - REPAIR_PROJECTS
  - GROWTH_PROJECTS
cycle_class_dictionary: [ECONOMICS, IMPORT, LOGISTIC_IMPORT, LOGISTIC_RUSSIA, SALES, REPAIR_PROJECT, GROWTH_PROJECT]
cycle_identity_ref: EP-DP-DR-006
writes_proposed:
  - CYCLE_REGISTER
  - CYCLE_EVENT_LOG
  - PROTOCOL_VERSION_REGISTER
feeds:
  - INFORMATION_EVIDENCE
  - FEEDBACK
  - CONTROL
  - CHANGE
```

`O` не перемещает товар и деньги, не определяет бюджет и не меняет приоритеты самостоятельно. Он определяет принадлежность события, фиксирует состояние и evidence, а изменение протокола выполняет только в пределах явного полномочия.

```yaml
OBSERVER.PROHIBITED:
  - REPLACE_OWNER_LPR
  - TREAT_ABSENCE_OF_EVIDENCE_AS_FACT
  - OVERWRITE_HISTORY_WITHOUT_VERSION
  - CHANGE_PROTOCOL_WITHOUT_AUTHORITY_OR_IMPACT_MAP
  - CREATE_RECURSIVE_OBSERVATION_CYCLE_FOR_EVERY_LOG_WRITE
```

Техническая запись, созданная oper `O`, является evidence этого же oper и не требует бесконечного повторного наблюдения.

### 6.2 / CYCLE.RECORD

Поля, прямо заданные пользователем:

```yaml
USER_REQUIRED_FIELDS:
  - membership
  - goal
  - current_step
  - plan
  - expected_result
```

Полная структура записи остаётся `INFERRED / CANDIDATE`; подмножество identity и membership ниже — `SOURCE_STATED` по `EP-DP-DR-006`, а узкий logical SLA envelope — по `EP-DP-DR-008`:

```yaml
CYCLE_RECORD:
  cycle_instance_id: EP-{CLASS}-{YYYYMMDD}-{NNN}
  cycle_class: ECONOMICS | IMPORT | LOGISTIC_IMPORT | LOGISTIC_RUSSIA | SALES | REPAIR_PROJECT | GROWTH_PROJECT
  scope:
    class_boundary_ref:
    instance_subject_ref:
  parent_cycle_instance_id:
  predecessor_cycle_instance_id:
  continuation_reason:
  trigger_evidence_ref:
  domain_membership:
    local_domain_label: ELEPHANT_PANTS
  contour_membership: ECONOMICS.SYSTEM | PROJECT_REPAIR_GROWTH
  goal:
  cycle_record_state: OPEN | CLOSED
  transition_decision: READY | HOLD | STOP
  remediation_state: NONE | REPAIR_ACTIVE | RECONTROL_PENDING
  current_step:
  plan:
  expected_result:
  actual_result:
  evidence_refs: []
  opened_at:
  updated_at:
  current_closed_at:
  current_closure_outcome:
  current_closure_event_ref:
  closure_event_refs: []
  reopen_event_refs: []
  post_close_evidence_refs: []
  instruction_version:
  observer:
  identity_rule_ref: EP-DP-DR-006
  closure_rule_ref: EP-DP-DR-007

EVENT_CYCLE_MEMBERSHIP:
  observation_event_id:
  action_or_event_ref:
  primary:
    cycle_class:
    cycle_instance_id:
    classification_basis_ref:
  related: []
  # each related item: {cycle_class, cycle_instance_id, relation_basis_ref}
  classified_by: OWNER_LPR
  classified_at:
  decision_ref: EP-DP-DR-006

OBSERVATION_RECORDING_SLA_ENVELOPE:
  scope: LOGICAL_SLA_MINIMUM_NOT_FULL_EVENT_SCHEMA
  observation_event_or_decision_ref:
  cycle_instance_id_or_pending_membership:
  oper_id: O3 | O4
  record_type: O3_STATE_CHANGE | O4_POST_CLOSE_EVENT | O4_CLOSURE_DECISION | O4_REOPEN_DECISION | O4_NEW_WORK_ROUTE_DECISION
  sla_class: CRITICAL_EVENT | ORDINARY_OBSERVATION | CLOSURE_OR_REOPEN_DECISION
  classification_resolution_state: PROVISIONAL | FINAL
  final_domain_criticality_when_resolved: CRITICAL | ORDINARY
  classification_basis_ref:
  occurred_at_if_known:
  available_for_recording_at:
  available_at_basis_ref:
  owner_LPR_decided_at_when_applicable:
  owner_LPR_route_decided_at_when_new_work:
  decision_ref_when_decision_subject:
  sla_started_at:
  sla_deadline_at:
  evaluated_at:
  actual_recorded_at:
  logical_commit_ref:
  elapsed_minutes:
  recording_sla_status: PENDING | ON_TIME | LATE | UNVERIFIABLE
  late_flag: false | true | UNKNOWN
  late_reason_when_late:
  unverifiable_reason:
  recorded_by:
  escalation_ref_when_late:
  dependent_transition_refs: []
  sla_rule_ref: EP-DP-DR-008
  physical_register_ref: UNSPECIFIED_EPDP_OI_019
```

`CYCLE_RECORD` — локальная доменная запись EP-DP, а не утверждённый экземпляр канонического `OBJECT-CYCLE`. Поэтому `cycle_record_state: OPEN | CLOSED` не подменяет канонические фазы `C00–C11`, `HOLD`, `STOP`, `REPAIR`, `CLOSED` и не является lifecycle объекта `Oper`.

`CYCLE_RECORD` имеет одну идентичность: класс, неизменяемый instance ID и непустой scope из ссылки на процессную границу класса и конкретный наблюдаемый предмет. Multiple membership относится не к идентичности `CYCLE_RECORD`, а к `EVENT_CYCLE_MEMBERSHIP`: одно событие получает ровно одну primary-ссылку и при необходимости несколько уникальных related-ссылок на полные пары `cycle_class + cycle_instance_id`. Payload события при этом не копируется. Новый класс не создаётся молча: неизвестный класс означает `NEW_CYCLE_CLASS_PROPOSAL + HOLD` до решения `OWNER_LPR`. Closure, reopen и post-close evidence представлены append-only logical refs по `EP-DP-DR-007`; их physical location/format назначены `EP-DP-DR-009`; event/change governance определена `EP-DP-DR-011`; `EPDP-OI-024: RESOLVED`. Узкий `OBSERVATION_RECORDING_SLA_ENVELOPE` задаёт только вычислимые SLA-поля по `EP-DP-DR-008`, а не физическую таблицу или полную event/change schema. `current_closed_at / current_closure_outcome / current_closure_event_ref` — текущая проекция последнего действующего closure: при reopen она очищается, но все прежние значения остаются в immutable closure history. `predecessor_cycle_instance_id` не меняет identity нового цикла и используется только для связи новой работы с корректно закрытым предыдущим циклом.

### 6.3 / O1.CLASSIFY.CYCLE

Состав и назначение `O1–O5` заданы пользователем. Ниже они раскрыты в прежнем читаемом формате `S0 / Trigger / D / S1 / Evidence / Next`; покрытие обязательных полей канонического `Oper` оценивается в §0.4. Все пять объектов остаются `CANDIDATE` до завершения полей, разрешения ссылок и авторизованного перехода.

```yaml
ID: O1
NAME: Определить цикл действия
MODES: [STANDARD_CLASSIFICATION, AUTHORIZED_NEW_WORK_AFTER_VALID_CLOSURE]
MODE_PRECEDENCE: AUTHORIZED_NEW_WORK_AFTER_VALID_CLOSURE_OVERRIDES_CLOSED_CYCLE_REASSESSMENT
S0:
  - получено действие, событие или evidence
  - принадлежность циклу ещё не подтверждена
  - IF_AUTHORIZED_CONTINUATION_MODE_THEN_O4_ROUTE_DECISION_AND_PREDECESSOR_LINK_AVAILABLE
TRIGGER: NEW_DOMAIN_ACTION_OR_EVENT
D:
  - зафиксировать earliest available_for_recording_at и available_at_basis_ref для SLA; последующая классификация или разрешение membership не сбрасывает часы
  - в AUTHORIZED_NEW_WORK_AFTER_VALID_CLOSURE проверить O4 route decision, исключить predecessor из primary candidates, сохранить predecessor как required pending related и классифицировать новую работу для NEW_CYCLE_RECORD_PROPOSAL
  - сопоставить действие с закрытым словарём классов EP-DP-DR-006
  - найти cycle records, scope которых включает действие или событие
  - выбрать ровно одну primary pair: cycle_class + cycle_instance_id
  - добавить zero-to-many related pairs только при наличии relation_basis_ref
  - проверить уникальность related pairs и отсутствие primary pair среди related
  - сохранить один observation_event payload со ссылками, не клонируя его по циклам
  - если класс известен, но подходящего instance нет, сформировать NEW_CYCLE_RECORD_PROPOSAL
  - если класс неизвестен, сформировать NEW_CYCLE_CLASS_PROPOSAL без расширения словаря
  - если evidence относится к закрытому cycle instance И mode не AUTHORIZED_NEW_WORK_AFTER_VALID_CLOSURE, создать POST_CLOSE_ASSESSMENT_PENDING с candidate closed-cycle link без committed primary и передать тот же event/evidence ref в O4
  - в AUTHORIZED_NEW_WORK_AFTER_VALID_CLOSURE запретить возврат того же event в O4 и передать NEW_CYCLE_RECORD_PROPOSAL в O2
  - при неоднозначности класса, instance или existing/new установить HOLD до решения OWNER_LPR
S1:
  CLASSIFIED:
    - exactly_one_primary_cycle_class_and_instance_assigned
    - related_membership_pairs_validated
  NEW_INSTANCE_REQUIRED:
    - new_cycle_record_proposal_fixed
  NEW_CLASS_REQUIRED:
    - new_cycle_class_proposal_fixed
    - committed_membership_absent
  POST_CLOSE_ASSESSMENT_REQUIRED:
    - referenced_closed_cycle_candidate_link_fixed
    - committed_membership_deferred_until_O4_route_decision
  AUTHORIZED_LINKED_CYCLE_REQUIRED:
    - O4_new_linked_cycle_route_decision_validated
    - predecessor_preserved_as_required_pending_related
    - new_cycle_record_proposal_fixed
    - committed_primary_deferred_to_O2
EVIDENCE:
  - observation_event_id
  - action_or_event_ref
  - available_for_recording_at
  - available_at_basis_ref
  - primary_cycle_class_and_instance_or_candidate
  - related_cycle_class_and_instance_pairs
  - classification_basis_ref
  - classified_by
  - classified_at
  - post_close_assessment_pending_when_applicable
  - O4_new_linked_cycle_route_decision_ref_when_applicable
  - predecessor_cycle_instance_id_and_relation_basis_when_applicable
NEXT:
  EXISTING_OPEN_CYCLE: O3
  NEW_CYCLE_RECORD_PROPOSAL: O2
  CLOSURE_EVENT: O4
  EVIDENCE_FOR_CLOSED_CYCLE: O4_ASSESS_POST_CLOSE_EVIDENCE
  AUTHORIZED_NEW_WORK_AFTER_VALID_CLOSURE: O2
  SIGNIFICANT_NEW_EVIDENCE: O5
  MEMBERSHIP_AMBIGUOUS: HOLD
  NEW_CYCLE_CLASS_PROPOSAL: HOLD_FOR_OWNER_LPR_DECISION
OPER_OBJECT:
  lifecycle_state: CANDIDATE
  canon_hold_codes: [HOLD-OBJECT-INCOMPLETE, HOLD-OBJECT-REFERENCE-UNRESOLVED]
  residue:
    - Physical source of truth назначен EP-DP-DR-009; event/change governance определена EP-DP-DR-011
    - Выполнить QA tests, включая SLA fixtures: EPDP-OI-032
RUNTIME_GUARD:
  READY_IF: ACTION_OR_EVENT_AVAILABLE_AND_EXACTLY_ONE_PRIMARY_OR_NEW_INSTANCE_OR_POST_CLOSE_ASSESSMENT_DETERMINED
  HOLD_IF:
    - PRIMARY_CLASS_OR_INSTANCE_AMBIGUOUS
    - EXISTING_VS_NEW_CYCLE_AMBIGUOUS
    - UNKNOWN_CLASS_NOT_AUTHORIZED
    - AUTHORIZED_CONTINUATION_MODE_WITHOUT_VALID_O4_ROUTE_OR_PREDECESSOR_LINK
  HOLD_RESOLUTION_AUTHORITY: OWNER_LPR
  RESUME_IF: [SELECTED_PRIMARY, CLASSIFICATION_BASIS, RESOLVED_BY_OWNER_LPR, RESOLVED_AT]
  HOLD_EFFECT: NO_CYCLE_CREATE_UPDATE_OR_CLOSE
  SLA_EFFECT: MEMBERSHIP_HOLD_DOES_NOT_PAUSE_OR_RESET_EP_DP_DR_008_CLOCK
```

### 6.4 / O2.REGISTER.NEW.CYCLE

```yaml
ID: O2
NAME: Зафиксировать параметры нового цикла
S0:
  - O1 produced NEW_CYCLE_RECORD_PROPOSAL
  - originating_observation_event_id and action_or_event_ref available
  - pending_new_instance_membership contains cycle_class and classification_basis_ref
  - pending_related_membership_pairs and relation_basis_refs available_or_empty
  - IF_CONTINUATION_MODE_THEN_O4_ROUTE_DECISION_PREDECESSOR_ID_REASON_AND_TRIGGER_EVIDENCE_AVAILABLE
TRIGGER: NEW_CYCLE_REQUIRES_REGISTRATION
D:
  - проверить cycle_class по словарю EP-DP-DR-006
  - проверить непустые class_boundary_ref и instance_subject_ref
  - для continuation mode проверить O4 route decision и то, что predecessor существует, CLOSED и отличается от создаваемого instance
  - зафиксировать domain membership ELEPHANT_PANTS и contour membership по cycle_class
  - зафиксировать цель
  - зафиксировать текущий шаг
  - зафиксировать план
  - зафиксировать ожидаемый результат
  - зафиксировать created_at как ISO 8601 timestamp с offset
  - присвоить next unused cycle_instance_id по классу и local date created_at
  - запретить collision, reuse и изменение identity после регистрации
  - записать новый cycle_instance_id как primary membership исходного observation_event_id
  - перенести все validated pending related membership pairs с relation_basis_refs
  - для continuation mode зафиксировать predecessor link и включить predecessor в related membership исходного event
  - повторно проверить related pair uniqueness, class match и отсутствие primary pair среди related
  - сохранить исходный event payload в одном экземпляре без клонирования
  - присвоить cycle_record_state
S1:
  - new_cycle_record_created
  - originating_event_full_membership_committed
  - predecessor_cycle_remains_closed_when_applicable
  - cycle_record_state: OPEN
EVIDENCE:
  - cycle_instance_register_entry
  - originating_observation_event_id
  - action_or_event_ref
  - originating_event_primary_membership_assignment_check
  - originating_event_related_membership_pairs
  - classification_basis_ref
  - relation_basis_refs
  - predecessor_cycle_instance_id_when_applicable
  - continuation_reason_when_applicable
  - trigger_evidence_ref_when_applicable
  - O4_new_linked_cycle_route_decision_ref_when_applicable
  - created_at
  - class_boundary_ref
  - instance_subject_ref
  - identity_assignment_check
  - author_or_observer
NEXT:
  ORIGINATING_EVENT_FULL_MEMBERSHIP_COMMITTED: O3
  OTHERWISE: HOLD
COMMIT_INVARIANT:
  logical_result: CYCLE_RECORD_AND_ORIGINATING_EVENT_FULL_MEMBERSHIP_SUCCEED_OR_FAIL_TOGETHER
  physical_atomic_implementation: UNSPECIFIED_EPDP_OI_019
OPER_OBJECT:
  lifecycle_state: CANDIDATE
  canon_hold_codes: [HOLD-OBJECT-INCOMPLETE, HOLD-OBJECT-REFERENCE-UNRESOLVED]
  residue:
    - Physical register location и data owner назначены EP-DP-DR-009; проверить atomic sequence implementation: EPDP-OI-032
RUNTIME_GUARD:
  READY_IF: REQUIRED_PARAMETERS_AND_SCOPE_AVAILABLE_AND_VALID_NEW_CYCLE_INSTANCE_ID
  HOLD_IF:
    - MEMBERSHIP_OR_GOAL_OR_EXPECTED_RESULT_MISSING
    - CLASS_BOUNDARY_OR_INSTANCE_SUBJECT_REF_MISSING
    - UNKNOWN_OR_UNAUTHORIZED_CYCLE_CLASS
    - ID_COLLISION_OR_REUSE_DETECTED
    - DAILY_CLASS_SEQUENCE_EXHAUSTED
    - ORIGINATING_EVENT_MEMBERSHIP_NOT_FULLY_COMMITTED
    - CONTINUATION_MODE_ROUTE_DECISION_OR_PREDECESSOR_LINK_INVALID_OR_INCOMPLETE
```

### 6.5 / O3.UPDATE.OPEN.CYCLE

```yaml
ID: O3
NAME: Зафиксировать новое состояние открытого цикла
S0:
  - cycle_record_state: OPEN
  - получено подтверждённое изменение состояния и ссылка на его источник; до подтверждения может существовать только pending observation record без обновления state projection
  - valid available_for_recording_at и available_at_basis_ref зафиксированы OR missing/invalid anchor и basis явно сохранены с unverifiable_reason
  - occurred_at сохранён, если он фактически известен; неизвестное время не подставляется
TRIGGER: OPEN_CYCLE_STATE_CHANGED
D:
  - классифицировать recording obligation по EP-DP-DR-008 как CRITICAL_EVENT либо ORDINARY_OBSERVATION; при неоднозначности записать sla_class CRITICAL_EVENT, classification_resolution_state PROVISIONAL и ambiguity basis ref
  - последующее OWNER_LPR resolution классификации добавить append-only; anchor и пропущенный provisional PT4H deadline/LATE не переписывать
  - вычислить sla_started_at, inclusive sla_deadline_at и recording_sla_status
  - добавить подтверждённое событие в историю цикла
  - отразить новый текущий шаг, transition_decision и remediation_state
  - отразить изменение плана только если оно принято уполномоченным субъектом и имеет source_ref
  - обновить evidence_refs без уничтожения предыдущего состояния
  - при успешном logical append зафиксировать actual_recorded_at, не подменяя его occurred_at, updated_at или временем начала классификации
  - если deadline прошёл до append, установить LATE и overdue-unrecorded; после append сохранить LATE, actual_recorded_at и непустую late_reason
  - при LATE создать escalation ref для OWNER_LPR control review
  - если запись нужна следующему переходу, удерживать только этот зависимый переход в HOLD до завершения late-записи, принятия OWNER_LPR и повторной проверки предпосылок
  - если зависимый переход уже состоялся, не применять HOLD задним числом; зафиксировать control defect, удержать следующий затронутый переход и оценить REPAIR/RECONTROL
S1:
  RECORDED:
    - current_cycle_state_updated
    - previous_state_trace_preserved
    - observation_recording_sla_envelope_appended
    - recording_sla_status: ON_TIME | LATE | UNVERIFIABLE
  RECORDED_UNVERIFIABLE:
    - current_cycle_state_updated
    - previous_state_trace_preserved
    - fact_and_history_append_allowed
    - sla_started_at: null
    - sla_deadline_at: null
    - late_flag: UNKNOWN
    - on_time_claim: DENY
    - missing_or_invalid_anchor_and_basis_preserved
    - nondependent_transition: NO_AUTOMATIC_HOLD
    - dependent_transition: HOLD_UNTIL_ANCHOR_OR_BASIS_CORRECTED_AND_SLA_REEVALUATED
  OVERDUE_UNRECORDED:
    - recording_sla_status: LATE
    - late_flag: true
    - actual_recorded_at: null
    - escalation_required: true
EVIDENCE:
  - cycle_event
  - source_ref
  - occurred_at_if_known
  - available_for_recording_at
  - available_at_basis_ref
  - sla_class
  - classification_resolution_state
  - criticality_or_classification_basis_ref
  - sla_started_at
  - sla_deadline_at
  - evaluated_at
  - actual_recorded_at_when_appended
  - logical_commit_ref_when_appended
  - elapsed_minutes_when_appended
  - recording_sla_status
  - late_flag
  - late_reason_when_late_completed
  - unverifiable_reason_when_applicable
  - escalation_ref_when_late
  - dependent_transition_refs
  - updated_at
NEXT:
  NEXT_STATE_EVENT: O3
  CLOSURE_CONDITION_REACHED: O4
  SIGNIFICANT_NEW_EVIDENCE: O5
  REQUIRED_RECORD_INCOMPLETE_OR_UNVERIFIABLE: HOLD_DEPENDENT_TRANSITION
  LATE_RECORD_ACCEPTED_AND_DEPENDENCIES_RECHECKED: RESUME_DEPENDENT_ROUTE_WITH_LATE_PRESERVED
OPER_OBJECT:
  lifecycle_state: CANDIDATE
  canon_hold_codes: [HOLD-OBJECT-INCOMPLETE, HOLD-OBJECT-REFERENCE-UNRESOLVED]
  residue:
    - Physical source of truth и write authority назначены EP-DP-DR-009; проверить writer/clock implementation: EPDP-OI-032
    - Event/change/source-authority governance: EP-DP-DR-011; retention/rollback: EP-DP-DR-010
    - Выполнить QA fixtures и измерить соблюдение SLA: EPDP-OI-032
RUNTIME_GUARD:
  READY_IF:
    - NEW_STATE_AND_SOURCE_AVAILABLE
    - SLA_ENVELOPE_COMPUTABLE_OR_UNVERIFIABLE_EXPLICITLY_RECORDED
  HOLD_IF:
    - SOURCES_CONFLICT_OR_STATE_CANNOT_BE_CONFIRMED
    - REQUIRED_SLA_START_OR_BASIS_MISSING_OR_INVALID_FOR_DEPENDENT_TRANSITION
    - DEPENDENT_TRANSITION_REQUIRES_RECORD_AND_RECORD_OR_LATE_METADATA_NOT_COMPLETE_AND_ACCEPTED
  HOLD_SCOPE: NEXT_DEPENDENT_TRANSITION_ONLY
  RESUME_IF:
    LATE: REQUIRED_RECORD_AND_LATE_METADATA_ACCEPTED_AND_DEPENDENT_PREREQUISITES_RECHECKED
    UNVERIFIABLE: ANCHOR_AND_BASIS_CORRECTED_AND_SLA_REEVALUATED_AND_DEPENDENT_PREREQUISITES_RECHECKED
  LATE_FLAG_AFTER_RESUME: REMAINS_TRUE
  UNVERIFIABLE_NONDEPENDENT_EFFECT: APPEND_FACT_WITHOUT_ON_TIME_CLAIM_AND_NO_AUTOMATIC_HOLD
```

### 6.6 / O4.RECORD.CLOSURE

```yaml
ID: O4
NAME: Зафиксировать закрытие, post-close correction или reopen цикла
MODES: [CLOSE_OPEN_CYCLE, ASSESS_POST_CLOSE_EVIDENCE]
S0:
  CLOSE_OPEN_CYCLE:
    - cycle_record_state: OPEN
    - committed cycle identity and membership confirmed
    - proposed closure outcome and basis available
    - actual result and expected-vs-actual comparison available
    - valid OWNER_LPR decided_at and closure decision_ref available OR missing/invalid decision anchor explicitly preserved with unverifiable_reason for pending/control record only
  ASSESS_POST_CLOSE_EVIDENCE:
    - cycle_record_state: CLOSED
    - new evidence references this closed cycle
    - post-close route not yet authorized
    - valid available_for_recording_at and available_at_basis_ref captured OR missing/invalid anchor and basis explicitly preserved with unverifiable_reason
TRIGGER:
  - CONFIRMED_CLOSURE_FACT
  - AUTHORIZED_TERMINATION_DECISION
  - EVIDENCE_FOR_CLOSED_CYCLE
D:
  SLA_COMMON:
    - создать отдельные referenced SLA obligations для underlying evidence/event и любого последующего OWNER_LPR decision типа CLOSURE, REOPEN или NEW_WORK_ROUTE; evidence ref можно переиспользовать, payload не клонировать
    - каждой applicable obligation назначить собственные class, anchor, deadline и status; ни одна последующая decision obligation не сбрасывает часы underlying event
    - overdue tracking фиксирует нарушение, но не заменяет constitutive closure/reopen/new-work-route decision record; такую ветвь удерживать до logical append, acceptance и prerequisite recheck
    - классифицировать underlying event как CRITICAL_EVENT либо ORDINARY_OBSERVATION; closure/reopen decision классифицировать отдельно и отсчитывать PT24H от OWNER_LPR decided_at; new-work route decision — как ORDINARY_OBSERVATION PT24H от route_decided_at
    - вычислить inclusive deadline, actual_recorded_at и status по EP-DP-DR-008; время решения, occurred_at, closed_at, reopened_at и updated_at не подменяют actual_recorded_at
    - при LATE сохранить late flag и reason, создать escalation ref и применить HOLD только к зависимому следующему переходу до принятия записи и recheck
  CLOSE_OPEN_CYCLE:
    - проверить common closure gate EP-DP-DR-007
    - выбрать ровно один outcome и проверить его outcome-specific acceptance
    - зафиксировать actual result, expected-vs-actual comparison и residue disposition
    - добавить append-only closure event с evidence, authority и timestamps
    - добавить SLA envelope решения о closure; PT24H задаёт срок его записи после decided_at, а не срок принятия самого решения
    - перевести local cycle_record_state в CLOSED без изменения identity и related cycles
  ASSESS_POST_CLOSE_EVIDENCE:
    - определить: подтверждение/уточнение, clerical correction, доказательство ошибочного closure или новая работа после valid closure
    - при подтверждении или уточнении commit referenced closed cycle as event primary, добавить post-close evidence event и оставить CLOSED
    - при clerical correction commit referenced closed cycle as event primary, добавить correction event без изменения outcome и оставить CLOSED
    - при доказанной ошибочности closure проверить same identity, evidence и OWNER_LPR authority
    - при authorized reopen commit same cycle as event primary, добавить reopen event, сохранить прежний closure в истории и перевести state в OPEN
    - для authorized reopen добавить отдельный decision SLA envelope с PT24H от OWNER_LPR decided_at
    - при valid closure + new work зафиксировать OWNER_LPR route_decided_at и decision ref, не commit predecessor as primary; сохранить его как candidate related/predecessor link и сформировать NEW_LINKED_CYCLE_PROPOSAL для O1 classification → O2
    - при значимом protocol evidence передать тот же event/evidence ref в O5 без клонирования
    - при неоднозначности установить HOLD без изменения closed cycle
S1:
  CLOSED:
    - cycle_record_state: CLOSED
    - closure_event_appended
    - closure_outcome_fixed
    - current_closure_projection_derived_from_new_closure_event
    - closure_decision_recording_sla_envelope_appended
    - closure_decision_constitutive_SLA_obligation_logically_appended_not_merely_overdue_tracked
    - all_other_applicable_nondependent_SLA_obligations_appended_or_overdue_tracked
  CLOSED_EVIDENCE_OR_CORRECTION_APPENDED:
    - cycle_record_state: CLOSED
    - original_closure_preserved
    - event_primary_membership_committed_to_closed_cycle
    - post_close_event_recording_sla_envelope_appended
    - post_close_event_constitutive_SLA_obligation_logically_appended
    - all_other_applicable_nondependent_SLA_obligations_appended_or_overdue_tracked
  REOPENED:
    - cycle_record_state: OPEN
    - current_closed_at_null_and_current_closure_outcome_and_ref_NONE
    - same_cycle_instance_id_preserved
    - reopen_event_appended
    - original_closure_preserved
    - event_primary_membership_committed_to_same_cycle
    - reopen_decision_recording_sla_envelope_appended
    - reopen_decision_constitutive_SLA_obligation_logically_appended_not_merely_overdue_tracked
    - all_other_applicable_nondependent_SLA_obligations_appended_or_overdue_tracked
  NEW_LINKED_CYCLE_REQUIRED:
    - predecessor_cycle_remains_CLOSED
    - new_linked_cycle_classification_proposal_fixed
    - predecessor_id_continuation_reason_and_trigger_evidence_fixed
    - O4_new_linked_cycle_route_decision_ref_fixed
    - committed_event_primary_deferred_to_new_cycle_route
    - route_decision_recording_sla_envelope_appended
    - new_work_route_decision_constitutive_SLA_obligation_logically_appended_not_merely_overdue_tracked
    - all_other_applicable_nondependent_SLA_obligations_appended_or_overdue_tracked
  SLA_OVERDUE_UNRECORDED:
    - recording_sla_status: LATE
    - late_flag: true
    - actual_recorded_at: null
    - dependent_transition: HOLD_IF_RECORD_REQUIRED
  SLA_UNVERIFIABLE_RECORDED:
    - underlying_fact_or_event_append_allowed
    - unverified_closure_reopen_or_new_work_route_decision_append: PENDING_OR_CONTROL_EVIDENCE_ONLY
    - unverified_decision_cycle_state_or_route_effect: DENY
    - decision_branch_requires_valid_OWNER_LPR_decided_at_and_decision_ref: true
    - sla_started_at: null
    - sla_deadline_at: null
    - late_flag: UNKNOWN
    - on_time_claim: DENY
    - missing_or_invalid_anchor_and_basis_preserved
    - nondependent_transition: NO_AUTOMATIC_HOLD
    - dependent_transition: HOLD_UNTIL_ANCHOR_OR_BASIS_CORRECTED_AND_SLA_REEVALUATED
EVIDENCE:
  - cycle_instance_id
  - closure_or_post_close_event_id
  - event_type
  - closure_outcome_when_applicable
  - expected_vs_actual_comparison
  - actual_result_or_NO_FINAL_RESULT
  - closure_or_reopen_basis_refs
  - reopen_reason_when_applicable
  - residue_disposition
  - accepted_or_authorized_by
  - authority_ref
  - event_at_with_timezone_offset
  - occurred_at_if_known
  - available_for_recording_at_when_event_subject
  - available_at_basis_ref_when_event_subject
  - OWNER_LPR_decided_at_when_decision_subject
  - OWNER_LPR_route_decided_at_when_new_work_route_subject
  - decision_ref_when_decision_subject
  - sla_class
  - classification_resolution_state
  - classification_basis_ref
  - sla_started_at
  - sla_deadline_at
  - evaluated_at
  - actual_recorded_at_when_appended
  - logical_commit_ref_when_appended
  - elapsed_minutes_when_appended
  - recording_sla_status
  - late_flag
  - late_reason_when_late_completed
  - unverifiable_reason_when_applicable
  - escalation_ref_when_late
  - dependent_transition_refs
  - original_closure_event_ref_when_applicable
  - post_close_event_membership_assignment_check
  - post_close_route_decision
  - O4_new_linked_cycle_route_decision_ref_when_new_work
  - predecessor_cycle_instance_id_when_new_work
  - continuation_reason_when_new_work
  - trigger_evidence_ref_when_new_work
NEXT:
  REOPENED: O3
  NEW_LINKED_CYCLE_REQUIRED: O1_AUTHORIZED_NEW_WORK_AFTER_VALID_CLOSURE_THEN_O2
  SIGNIFICANT_PROTOCOL_EVIDENCE: O5
  CLOSED_OR_CORRECTED_WITHOUT_NEW_WORK: TERMINAL_FOR_CYCLE_INSTANCE
  REQUIRED_RECORD_INCOMPLETE_OR_UNVERIFIABLE: HOLD_DEPENDENT_TRANSITION
  LATE_RECORD_ACCEPTED_AND_DEPENDENCIES_RECHECKED: RESUME_DEPENDENT_ROUTE_WITH_LATE_PRESERVED
  AMBIGUOUS: HOLD
OPER_OBJECT:
  lifecycle_state: CANDIDATE
  canon_hold_codes: [HOLD-OBJECT-INCOMPLETE, HOLD-OBJECT-REFERENCE-UNRESOLVED]
  residue:
    - Physical closure/event source of truth назначен EP-DP-DR-009; event/change governance определена EP-DP-DR-011
    - Выполнить recording SLA QA fixtures: EPDP-OI-032
RUNTIME_GUARD:
  READY_IF: OWNER_LPR_AUTHORITY_AND_REQUIRED_BASIS_AVAILABLE_AND_ROUTE_UNAMBIGUOUS
  HOLD_IF:
    - CLOSURE_COMMON_OR_OUTCOME_ACCEPTANCE_INCOMPLETE
    - CLOSURE_OR_REOPEN_AUTHORITY_MISSING
    - CONSTITUTIVE_DECISION_ANCHOR_OR_DECISION_REF_MISSING_OR_INVALID_FOR_STATE_OR_ROUTE_EFFECT
    - POST_CLOSE_ROUTE_AMBIGUOUS
    - REOPEN_WOULD_CHANGE_CYCLE_CLASS_OR_SCOPE_IDENTITY
    - PROJECT_CLASS_AND_PROJECT_EXIT_ACCEPTANCE_UNDEFINED_EPDP_OI_021
    - POST_CLOSE_ROUTE_MEMBERSHIP_NOT_COMMITTED_OR_DEFERRED_AS_REQUIRED
    - APPLICABLE_SLA_OBLIGATION_UNACCOUNTED
    - CONSTITUTIVE_OR_TRANSITION_REQUIRED_SLA_OBLIGATION_NOT_LOGICALLY_APPENDED
    - REQUIRED_SLA_START_OR_BASIS_MISSING_OR_INVALID_FOR_DEPENDENT_TRANSITION
    - DEPENDENT_TRANSITION_REQUIRES_RECORD_AND_RECORD_OR_LATE_METADATA_NOT_COMPLETE_AND_ACCEPTED
  SLA_HOLD_SCOPE: NEXT_DEPENDENT_TRANSITION_ONLY
  SLA_HOLD_RESUME_IF:
    LATE: REQUIRED_RECORD_AND_LATE_METADATA_ACCEPTED_AND_DEPENDENT_PREREQUISITES_RECHECKED
    UNVERIFIABLE: ANCHOR_AND_BASIS_CORRECTED_AND_SLA_REEVALUATED_AND_DEPENDENT_PREREQUISITES_RECHECKED
  LATE_FLAG_AFTER_RESUME: REMAINS_TRUE
  UNVERIFIABLE_NONDEPENDENT_EFFECT: APPEND_FACT_OR_DECISION_WITHOUT_ON_TIME_CLAIM_AND_NO_AUTOMATIC_HOLD
```

`SOURCE_STATED` по `EP-DP-DR-007`: закрытие не означает только успех. Цикл получает ровно один outcome: `ACHIEVED`, `PARTIAL`, `NOT_ACHIEVED` или `TERMINATED`. `PARTIAL` требует явного описания достигнутой и недостигнутой частей и принятого `OWNER_LPR` disposition остатка. `NOT_ACHIEVED` применяется после нормальной terminal evaluation, а `TERMINATED` — при уполномоченном досрочном прекращении и имеет приоритет при пересечении формулировок. Reopen того же ID допустим только как append-only исправление доказанно ошибочного closure, без уничтожения исходной записи.

### 6.7 / O5.LEARN.PROTOCOL

```yaml
ID: O5
NAME: Изменить инструкцию или протокол по новому значимому evidence
S0:
  - получено новое evidence
  - определены затрагиваемые instruction_or_protocol и их текущая версия
  - присутствует OWNER_LPR authority OR explicit_delegation
TRIGGER: SIGNIFICANT_EVIDENCE_CONFIRMED
SIGNIFICANT_IF_INFERRED:
  - changes_state_definition
  - changes_guard_or_acceptance_rule
  - changes_procedure_or_required_evidence
  - changes_known_risk_or_control
  - invalidates_current_instruction
D:
  - проверить источник и значимость evidence
  - построить impact map
  - обновить связанный набор правил, данных, контроля, KPI и документации
  - создать новую версию без уничтожения предыдущей
  - зафиксировать автора, основание и область изменения
S1:
  - new_instruction_or_protocol_version_active
  - affected_dependencies_updated
EVIDENCE:
  - evidence_ref
  - change_card
  - impact_map
  - version_diff
  - approval_or_delegated_authority
NEXT:
  AFFECTED_OPEN_CYCLE_STATE_CHANGED: O3
  OTHERWISE: READY_FOR_NEXT_OBSERVATION
CYCLE_STATE_BOUNDARY:
  O5_direct_close_reopen_or_outcome_mutation: DENY
  post_close_cycle_state_consequence_decided_by: O4
  same_evidence_ref_may_be_shared_with_O4: true
  event_payload_cloning: DENY
RECORDING_SLA_BOUNDARY:
  initiating_evidence_recording: MUST_EXIST_AS_O3_OR_O4_ASSOCIATED_SLA_ENVELOPE_WHEN_APPLICABLE
  O5_does_not_reset_SLA_start_or_substitute_initial_record: true
  O5_does_not_remove_LATE_or_dependent_HOLD: true
  O5_output_that_changes_domain_state: NEW_OBSERVATION_EVENT_WITHOUT_RECURSIVE_SELF_RECORD
  O5_technical_change_recording_SLA: NOT_DEFINED_BY_EP_DP_DR_008
  O5_significance_and_change_governance: DEFINED_BY_EP-DP-DR-011; retention_and_rollback_defined_by_EP-DP-DR-010
OPER_OBJECT:
  lifecycle_state: CANDIDATE
  canon_hold_codes: [HOLD-OBJECT-INCOMPLETE, HOLD-OBJECT-REFERENCE-UNRESOLVED]
  residue:
    - NONE_FOR_EPDP_OI_024; significance/change governance defined by EP-DP-DR-011, retention/rollback by EP-DP-DR-010, protocol register location by EP-DP-DR-009
RUNTIME_GUARD:
  READY_IF: EVIDENCE_CONFIRMED_AND_AUTHORITY_PRESENT_AND_DEPENDENCIES_DEFINED
  HOLD_IF: SIGNIFICANCE_OR_AUTHORITY_OR_IMPACT_MAP_UNCONFIRMED
```

`O5` реализует обучение системы, но подчиняется `EP-OSU-02 / AUTHORITY` и `EP-OSU-11 / CHANGE`. Наблюдатель не превращает единичное событие в норму без проверки evidence и связанных последствий.

```yaml
CURRENT_O5_AUTHORITY:
  executor: OWNER_LPR
  protocol_change_authority: OWNER_LPR
  delegated_authority: NONE
  assignment_ref: EP-DP-DR-004
```

### 6.8 / OBSERVATION.ROUTE

```text
action / event / evidence
→ O1 classify
→ existing open cycle → O3 update
→ new cycle → O2 register → O3 update
→ confirmed closure → O4 record closure
→ evidence for closed cycle → O4 assess
   → confirms/clarifies or clerical correction → append event; remain CLOSED
   → proves erroneous closure → OWNER_LPR decision → same cycle OPEN → O3
   → valid closure + new work → O1 AUTHORIZED_NEW_WORK_AFTER_VALID_CLOSURE → O2 new linked cycle; predecessor remains CLOSED
→ significant evidence → O5 versioned change
```

Ветви не являются взаимоисключающими. Если одно событие одновременно относится к нескольким cycle instances, оно хранится как один logical `observation_event_id`: одна primary membership и zero-to-many related memberships ссылаются на один payload. Если событие одновременно влияет на local cycle state и протокол, сначала `O4` определяет последствие для цикла, затем `O5` обрабатывает protocol consequence по тому же event/evidence ref; новая копия события не создаётся. Позднее получение документа само по себе не определяет маршрут: evidence может подтвердить прежнее closure, доказать, что оно уже было ошибочным, либо относиться к новому факту после корректного closure. По `EP-DP-DR-008` критическое событие записывается не позднее четырёх elapsed-hours, обычная O3/O4-запись — двадцати четырёх, а решение о closure/reopen — двадцати четырёх часов после решения `OWNER_LPR`. Просрочка не меняет факт и не создаёт lifecycle transition: она остаётся `LATE` и удерживает только зависимый переход до завершения записи и recheck. Physical source of truth и базовый файловый формат назначены `EP-DP-DR-009`; change governance определена `EP-DP-DR-011`; `EPDP-OI-024: RESOLVED`, а фактическое соблюдение SLA ещё не измерялось.

```yaml
OBSERVATION_OPER_COUNT: 5
OBSERVATION_OPER_LIFECYCLE_CANDIDATE: 5
OBSERVATION_OPER_RESIDUE_RECORDS: 5

DOMAIN_OPER_CANON_STATUS:
  TOTAL: 32
  REGULAR: 27
  OBSERVATION: 5
  LIFECYCLE_CANDIDATE: 32
  HOLD_OBJECT_INCOMPLETE_ACTIVE: 0
  HOLD_OBJECT_REFERENCE_UNRESOLVED_ACTIVE: 0
  OBJECT_LEVEL_COMPLETENESS_AUDIT: PASS
  OBJECT_LEVEL_COMPLETENESS_AUDIT_REF: EP-DP-DR-054
  OBSERVED_CONFIRMED: 0
  VALIDATED_CONFIRMED: 0

OPENITEM_REGISTER_STATUS:
  UNIQUE_OPENITEM_IDS: 34
  OPEN: 4
  RESOLVED: 30
  BLOCKS_INTERNAL_QA_OPEN: 0
  BLOCKS_RELEASE_OPEN: 2
  NON_BLOCKING_OPEN: 2
```

Семь legacy `TODO` и пять строк residue `O1–O5` — пересекающиеся source records, а не двенадцать уникальных долгов. Реестр §15 нормализует исходные пункты и сквозные blockers в 34 устойчивых OpenItem. После `EP-DP-DR-054` schema-level `HOLD-OBJECT-INCOMPLETE` и `HOLD-OBJECT-REFERENCE-UNRESOLVED` очищены; все 32 объекта остаются `CANDIDATE`, поскольку переход `CANDIDATE → OBSERVED` отдельно не авторизован.

### 6.9 / LOGISTICS.CYCLE.PROTOCOL

Каноническая версия: `EP-DP-LOGISTICS-CYCLE-PROTOCOL / 1.0`. Физический файл: `data/ep-domain/observation/protocol/EP-DP-LOGISTICS-CYCLE-PROTOCOL/1.0.yaml`.

```yaml
LOGISTICS_CYCLE_PROTOCOL:
  protocol_or_instruction_id: EP-DP-LOGISTICS-CYCLE-PROTOCOL
  version_id: "1.0"
  status: ACTIVE
  relation_to_ep_dp: NORMATIVE_DOMAIN_EXTENSION_INTEGRATED_IN_EP_DP_V0.2.1
  authority: OWNER_LPR
  authority_ref: OWNER_LPR_AUTHORIZATION:2026-08-07:CANONIZE_LOGISTICS_CYCLE_PROCEDURE
  governing_rules: [EP-DP-DR-006, EP-DP-DR-007, EP-DP-DR-008, EP-DP-DR-009, EP-DP-DR-061]
  scope:
    subject_type: BATCH
    cycle_types: [LOGISTICS_BATCH, INTERNATIONAL_DELIVERY, OZON_TRANSFER, OZON_SHIPMENT, OZON_ACCEPTANCE]
    does_not_change_cycle_class_dictionary: true
  hierarchy:
    LOGISTICS_BATCH:
      cycle_class: LOGISTIC_IMPORT
      required_children: [INTERNATIONAL_DELIVERY, OZON_TRANSFER]
    OZON_TRANSFER:
      cycle_class: LOGISTIC_RUSSIA
      required_children: [OZON_SHIPMENT, OZON_ACCEPTANCE]
    authoritative_relation: parent_cycle_instance_id
    reverse_children_lists: DERIVED_ONLY
    subject_invariant: ALL_NODES_REFERENCE_SAME_BATCH_SUBJECT_REF
  repeat_rule:
    unit: ONE_LOGISTICS_OCCURRENCE_PER_BATCH_ROUTE
    new_occurrence: NEW_CYCLE_INSTANCE_IDS_FOR_PARENT_AND_CHILDREN
    closed_instance_reuse: DENY
    grouping_fields: [cycle_type_id, series_id, occurrence]
    occurrence_consistency: SAME_OCCURRENCE_WITHIN_ONE_BATCH_LOGISTICS_TREE
    predecessor_link: REQUIRED_IF_NEW_WORK_CONTINUES_A_VALIDLY_CLOSED_ROUTE
  creation_procedure:
    - step: CLASSIFY
      oper: O1
      requirement: CONFIRM_NEW_VS_EXISTING_CYCLE_AND_BATCH_SUBJECT_REF
    - step: CREATE_ROOT
      oper: O2
      requirement: CREATE_LOGISTICS_BATCH_AS_OPEN
    - step: CREATE_REQUIRED_CHILDREN
      oper: O2
      requirement: CREATE_INTERNATIONAL_DELIVERY_AND_OZON_TRANSFER_AS_OPEN_WITH_PARENT_LINK
    - step: CREATE_TRANSFER_CHILDREN
      oper: O2
      requirement: CREATE_OZON_SHIPMENT_AND_OZON_ACCEPTANCE_AS_OPEN_WITH_OZON_TRANSFER_PARENT_LINK
    - step: RECORD_PLAN
      requirement: SET_GOAL_CURRENT_STEP_PLAN_EXPECTED_RESULT_AND_SOURCE_REFS_FOR_EACH_CREATED_INSTANCE
  creation_ordering_rule: CHILD_MAY_BE_CREATED_JUST_IN_TIME_BUT_MUST_EXIST_BEFORE_ITS_FIRST_STATE_CHANGE_IS_COMMITTED
  destination_split_rule:
    default: ONE_OZON_SHIPMENT_AND_ONE_OZON_ACCEPTANCE_PER_BATCH_TRANSFER
    destination_allocations: FACTS_WITHIN_THE_AGGREGATE_CYCLE
    separate_destination_cycles_if:
      - DESTINATIONS_HAVE_INDEPENDENT_STATE_OR_CLOSURE_TIME_REQUIRING_CONTROL
      - A_DESTINATION_HAS_UNRESOLVED_DEVIATION_OR_RESIDUE
      - OWNER_LPR_EXPLICITLY_REQUIRES_SEPARATE_TRACKING
    aggregate_acceptance_result: SUM_OF_ACCEPTED_DESTINATION_QUANTITIES
  evidence_rule:
    repository_storage: FACTS_AND_STABLE_REFS_ONLY
    primary_documents_in_github: NOT_REQUIRED
    accepted_evidence_forms:
      - EXTERNAL_SYSTEM_RECORD_REF
      - DOCUMENT_REF
      - OWNER_LPR_OPERATOR_REPORT_REF
      - RECONCILED_STOCK_AND_SALES_FACTS_REF
    sufficiency_rule: EVIDENCE_MUST_SUPPORT_THE_SPECIFIC_EXPECTED_RESULT_AND_QUANTITY_RECONCILIATION
    forbidden_claim: DO_NOT_DESCRIBE_A_FACT_AS_DOCUMENT_CONFIRMED_IF_ONLY_OPERATOR_REPORTED
  closure_procedure:
    child_closure: EACH_CHILD_RECEIVES_ITS_OWN_APPEND_ONLY_CLOSURE_EVENT_UNDER_EP_DP_DR_007
    parent_evaluation_trigger: AFTER_EACH_REQUIRED_CHILD_CLOSURE_OR_NEW_RELEVANT_EVIDENCE
    parent_achieved_allowed_if:
      - ALL_REQUIRED_CHILD_INSTANCES_EXIST
      - ALL_REQUIRED_CHILD_INSTANCES_ARE_CLOSED
      - ALL_REQUIRED_CHILD_OUTCOMES_ARE_ACHIEVED
      - PARENT_EXPECTED_RESULT_IS_SUPPORTED_BY_ACCEPTED_EVIDENCE
      - NO_UNRESOLVED_QUANTITY_DEVIATION
      - NO_OPEN_BLOCKING_RESIDUE
      - NO_CONTRADICTORY_EVIDENCE
    parent_closure:
      separate_event_required: true
      derive_without_copying_child_payloads: true
      closure_basis: REFERENCES_TO_CHILD_CLOSURES_AND_ACCEPTED_EVIDENCE
      projection_update: SET_PARENT_CLOSED_AFTER_PARENT_CLOSURE_EVENT
    closure_order: LEAVES_BEFORE_PARENTS
    closing_child_does_not_close_parent_implicitly: true
  standing_delegation:
    authorization_ref: OWNER_LPR_DIRECTIVE:2026-08-07:CLOSE_UNAMBIGUOUS_LOGISTICS_PARENTS_WITHOUT_NEW_QUESTION
    delegated_action: CREATE_MISSING_LOGICAL_PARENT_RECORD_AND_RECORD_ACHIEVED_CLOSURE_WITHOUT_SEPARATE_PROMPT
    allowed_if:
      - PARENT_IDENTITY_AND_SUBJECT_ARE_UNAMBIGUOUS
      - ALL_PARENT_ACHIEVED_CONDITIONS_PASS
      - NO_NEW_OWNER_CHOICE_IS_REQUIRED
    separate_parent_closure_event: REQUIRED
    ask_owner_if:
      - IDENTITY_OR_MEMBERSHIP_AMBIGUOUS
      - ANY_REQUIRED_CHILD_MISSING_WITHOUT_SUFFICIENT_RECONSTRUCTION_EVIDENCE
      - ANY_CHILD_OUTCOME_IS_NOT_ACHIEVED
      - QUANTITY_OR_DESTINATION_FACTS_CONFLICT
      - RESIDUE_DISPOSITION_REQUIRES_OWNER_CHOICE
      - CLOSURE_WOULD_REQUIRE_PARTIAL_NOT_ACHIEVED_OR_TERMINATED_OUTCOME
  quantity_reconciliation:
    required_for_ozon_acceptance: true
    formula: SHIPPED_QUANTITY_EQUALS_SUM_ACCEPTED_QUANTITIES_PLUS_CONFIRMED_UNRESOLVED_DIFFERENCE
    achieved_condition: CONFIRMED_UNRESOLVED_DIFFERENCE_EQUALS_ZERO
    stock_snapshot_rule: ADJUST_FOR_CONFIRMED_SALES_RETURNS_AND_PREEXISTING_STOCK_BEFORE_COMPARISON
  invariants:
    - ONE_CYCLE_INSTANCE_ID_MAPS_TO_ONE_CYCLE_RECORD
    - EVERY_STATE_CHANGE_HAS_AN_APPEND_ONLY_EVENT
    - NEW_BATCH_OR_VALID_POST_CLOSURE_WORK_USES_NEW_INSTANCE_IDS
    - CHILD_AND_PARENT_CLOSURES_ARE_DISTINCT_DECISIONS_AND_EVENTS
    - PRIVATE_DOCUMENTS_ARE_NOT_REQUIRED_IN_THE_PUBLIC_REPOSITORY
    - FACTS_DO_NOT_INHERIT_A_STRONGER_EVIDENCE_TYPE_THAN_THEIR_SOURCE
```

---

## 7 / DOMAIN.FLOWS

### 7.1 / MATERIAL

```text
THAI_FACTORY
→ INTERNATIONAL_TRANSPORT
→ CUSTOMS_CLEARED_BATCH
→ RUSSIAN_RECEIPT
→ MARKED_AND_PACKED_UNITS
→ OZON_STOCK
→ CONFIRMED_SALE
```

Нормальное состояние: количество и идентичность единиц трассируются на каждой передаче.

### 7.2 / FINANCIAL

```text
BUDGET
→ SUPPLIER_PAYMENT
→ LOGISTIC + COMPLIANCE + PACKING + PROMOTION_COSTS
→ OZON_SALE
→ PAYOUT
→ ACTUAL_RESULT
→ REPAIR_ALLOCATION
→ GROWTH_ALLOCATION
→ NEXT_CYCLE_BUDGET
```

В протокольной части используется термин `FINANCIAL_FLOW`. «Кровообращение» допустимо только как творческая интерпретация возврата cashflow в бюджет; это не документальный термин BOIS и оно не вводит новых правил.

### 7.3 / INFORMATION

```text
BOUNDARY_RELATIONS / NON_TEMPORAL
SUPPLIER_OFFER + MARKET_DEMAND_SIGNALS
→ A1 / FORM_EP_ASSORTMENT
→ EP_ASSORTMENT_REGISTER

EP_ASSORTMENT_REGISTER + REQUIRED_PRODUCT_DATA
→ A2 / CREATE_OR_UPDATE_OZON_PRODUCT_CARD
→ OZON_CATALOG
```

```text
DOWNSTREAM_INFORMATION_FLOW
A1 / EP_ASSORTMENT_REGISTER
→ E1 / I1
→ supplier_availability_confirmation
→ application / invoice
→ batch_and_transport_data
→ customs_documents
→ SKU / marking / Ozon_codes
→ A2 complete for affected SKU before S1
→ OZON_CATALOG
→ shipment_and_acceptance_data
→ sales_and_payout_reports
→ economic_decision
→ cycle_state_and_result
→ protocol_learning
```

Первый блок фиксирует boundary-level relations по `EP-DP-DR-002`. `A1/A2` определены `EP-DP-DR-029`; returns oper `S3` — `EP-DP-DR-030`; value criteria определены `EP-DP-DR-032–038`, `EPDP-OI-009: RESOLVED`. Технический source of truth назначен `EP-DP-DR-009`.

### 7.4 / EVIDENCE

```yaml
critical_chain:
  - SUPPLIER_RESPONSE
  - FINAL_APPLICATION
  - PAYMENT_CONFIRMATION
  - LOGISTIC_ACCEPTANCE
  - TRANSPORT_AND_CUSTOMS_DOCUMENTS
  - RUSSIAN_RECEIPT_AND_RECOUNT
  - MARKING_DATA_AND_PRINT_CONTROL
  - PACK_AND_SHIP_EVIDENCE
  - OZON_ACCEPTANCE_ACT
  - SALES_REPORT
  - OZON_RETURN_STATUS_AND_FINANCIAL_EFFECT_IF_APPLICABLE
  - BANK_PAYOUT
  - BATCH_ECONOMICS
  - ALLOCATION_DECISION
  - CYCLE_STATE_OR_CLOSURE_EVENT
  - PROTOCOL_CHANGE_CARD_WHEN_O5_RUNS
```

Evidence является частью выхода oper, а не внешним комментарием к нему.

### 7.5 / AUTHORITY

```text
constraint / primary_data
→ OWNER_LPR
→ decision + priority + budget
→ internal_executor OR external_function
→ result + status + evidence + deviation
→ OWNER_LPR acceptance
```

Внешний эксперт может определить ограничение и предложить вариант, но не подменяет ЛПР и не командует внутренним исполнителем напрямую.

Внешняя функция остаётся service/interface participant: она выполняет внешнюю работу и возвращает terminal result, но не получает внутреннюю ответственность или control authority без явного делегирования. В текущей матрице такого делегирования нет.

### 7.6 / CONTROL

`INFERRED` из норм `END_TO_END.PROCESS`, `CONTROL` и `DELEGATION`:

```text
EXECUTION
→ EVIDENCE
→ SELECT_CONTROL_MODE_BY_ACTION_CHARACTERISTICS
→ TIME_SEPARATED_SELF_RECHECK OR ISOLATED_LLM_REVIEW OR EXTERNAL_SPECIALIST_REVIEW
→ SEPARATE_CONTROL_RESULT + CONTROL_EVIDENCE + TIMESTAMP
→ OWNER_LPR_CONTROL_DECISION

CONTROL_DECISION → CONFIRM → NEXT_ALLOWED_TRANSITION
CONTROL_DECISION → HOLD → WAIT_OR_RESTORE_PRECONDITION → RECHECK
CONTROL_DECISION → STOP → ISOLATE → REPAIR → RECONTROL → READY
```

`SOURCE_STATED`: метод независимого контроля выбирается `OWNER_LPR` по характеристикам действия согласно `EP-DP-DR-012`. LLM-review и консультация специалиста являются контрольными источниками, а не автоматическим переносом полномочия на решение.

### 7.7 / REPAIR

```text
DEVIATION
→ LOCALIZE
→ ISOLATE
→ SELECT_ACTION_BY_DEFECT: RECOUNT OR REMARK OR RESTORE_EVIDENCE OR OTHER_APPROVED_REPAIR
→ RECONTROL
→ RETURN_TO_REGULAR_CYCLE
```

Набор действий выбирается по типу дефекта и не является универсальной последовательностью. Нестандартный дефект переводится в проект ремонта; повторяемый способ исправления после стабилизации должен быть передан в regular oper.

### 7.8 / FLOW.SYNCHRONIZATION

`INFERRED`:

Предлагаемый gate для проверки на реальной партии: регулярный цикл считается подтверждённым только при синхронизации как минимум четырёх потоков:

```yaml
MATERIAL_CONFIRMED
AND FINANCIAL_CONFIRMED
AND INFORMATION_CURRENT
AND EVIDENCE_COMPLETE
```

Физическое наличие товара без актуальных данных или evidence не проходит этот предложенный gate. Статус правила: `INFERRED`; требуется пилотная проверка.

### 7.9 / OBSERVATION.AND.LEARNING

```text
domain_action / state_change / evidence
→ O1 cycle classification
→ O2 new cycle record OR O3 open cycle update OR O4 closure record
→ CYCLE_REGISTER + CYCLE_EVENT_LOG
→ O5 evidence-based versioned protocol change
→ updated instruction / oper / control
```

Поток наблюдения соединяет информацию, evidence, feedback и change. Он не заменяет первичные документы: `CYCLE_EVENT_LOG` хранит ссылки на источник, а не превращает пересказ в подтверждение.

---

## 8 / INTERFACE.REGISTER

Единая схема границы между opers и функциями:

```yaml
interface:
  producer:
  consumer:
  object:
  acceptance_condition:
  evidence:
  deadline:
  cost_or_na:
  deviation_action:
  fallback:
```

`acceptance_owner` для всех 12 интерфейсов: `OWNER_LPR` (`EP-DP-DR-025`). Evidence выбирается по `EP-DP-DR-026`: документальное/системное подтверждение при наличии, иначе явное подтверждение `OWNER_LPR`; конкретный тип evidence задаётся отдельно для каждого oper/interface. Deviation action по `EP-DP-DR-027`: `HOLD → CORRECT_OR_REDO → RECHECK`; конкретное исправление задаётся на уровне oper/interface.

| ID | Интерфейс | Передаваемый результат | Gate |
|---|---|---|---|
| `IF-01` | `E1 → I1` | Бюджет и разрешение закупочного цикла | Требуемый gate: пороги запуска подтверждены; состояние gate: `UNSPECIFIED` |
| `IF-02A` | `I2 → I3` | Состав и объём предполагаемой партии | Наличие и объём подтверждены |
| `IF-02B` | `I2 → I4` | Согласованная заявка и полученный проверенный счёт | Сумма и состав счёта соответствуют заявке |
| `IF-03` | `I5 → L(I)1` | Трекинг поставщика + фото отправленной посылки | Поставщик фактически отправил посылку перевозчику |
| `IF-04` | `L(I)4 → L(R)1` | Физически полученная партия | Транспортный и таможенный контур закрыт |
| `IF-05` | `L(R)1 → L(R)2` | Подтверждённый фактический состав | Расхождения локализованы |
| `IF-06` | `L(R)3 → L(R)4` | Проверенные этикетки | Коды и расходники готовы |
| `IF-07` | `L(R)7 → S1` | Принятый остаток Ozon | Акт и остатки сопоставлены |
| `IF-08` | `S2 → E3` | Выплата и финансовые отчёты | Данных достаточно для сверки |
| `IF-09` | `E4 → E1` | Решение о распределении | Ремонт учтён; ресурс следующего цикла определён |
| `IF-O1` | `ANY_OPER_OR_PROJECT → O1` | Действие, изменение состояния или evidence | Есть ссылка на первичный источник и время события |
| `IF-O5` | `O5 → AFFECTED_PROTOCOL_OR_INSTRUCTION` | Версионированный связанный набор изменений | Evidence подтверждено; полномочие и impact map зафиксированы |

```yaml
INTERFACE_ACCEPTANCE_DEFAULT:
  decision_ref: EP-DP-DR-025
  applies_to: ALL_12_INTERFACES
  acceptance_owner: OWNER_LPR
  external_status_or_document: EVIDENCE_NOT_AUTO_ACCEPTANCE
  next_dependent_transition_allowed_only_after: OWNER_LPR_CONFIRM
  explicit_delegation_required_to_change_acceptance_owner: true
```

```yaml
EXTERNAL_WAIT_DEFAULT:
  decision_ref: EP-DP-DR-022
  universal_fixed_timeout: NONE
  timeout_authority: OWNER_LPR
  if_expected_result_missing: HOLD
  after_case_specific_deadline:
    - REPEAT_REQUEST
    - THEN_FALLBACK_OR_ALTERNATIVE_EXECUTOR_IF_AVAILABLE
  if_no_fallback: HOLD_UNTIL_OWNER_LPR_DECISION
```

```yaml
DEPENDENT_INTERNAL_INTERFACE_DEFAULT:
  decision_ref: EP-DP-DR-023
  applies_if: CONSUMER_OPER_REQUIRES_PRODUCER_OPER_RESULT
  acceptance_owner: OWNER_LPR
  deadline_rule: BEFORE_CONSUMER_OPER_START
  cost_or_na: N/A
  invalid_or_missing_result: HOLD
  deviation_action: RETURN_TO_PRODUCER_OPER_FOR_CORRECTION
  parallel_or_independent_branch: NOT_BLOCKED_BY_THIS_DEFAULT
```

`SOURCE_STATED / EP-DP-DR-028`: все 12 интерфейсных карточек заполнены через oper-specific contracts и утверждённые defaults `EP-DP-DR-022–027`. Fallback: реальная подтверждённая альтернатива используется при наличии; при отсутствии — `HOLD` зависимого перехода и решение `OWNER_LPR`. Полные поля cards зафиксированы в `EP-DP-DR-028`; `EPDP-OI-018: RESOLVED`.

---

## 9 / STATE.MACHINE

### 9.1 / RUNTIME.DECISION.AND.REMEDIATION

Следующие определения — `INFERRED` нормализация статусов двух источников.

```yaml
transition_decision:
  READY:
    condition: REQUIRED_INPUTS_CONFIRMED + AUTHORITY_PRESENT + PREVIOUS_STAGE_EVIDENCE_AVAILABLE

  HOLD:
    condition:
      - PRECONDITION_OR_EXTERNAL_RESULT_MISSING
      - REQUIRED_OBSERVATION_RECORD_OR_SLA_METADATA_MISSING_INVALID_OR_NOT_ACCEPTED
    effect: NEXT_TRANSITION_FORBIDDEN
    observation_SLA_scope: NEXT_DEPENDENT_TRANSITION_ONLY
    observation_SLA_ref: EP-DP-DR-008
    retroactive_HOLD_after_transition_occurred: DENY
    if_transition_already_occurred: RECORD_CONTROL_DEFECT_THEN_HOLD_NEXT_AFFECTED_TRANSITION_AND_ASSESS_REPAIR_RECONTROL

  STOP:
    condition: CRITICAL_CODE_COUNT_PACK_DOCUMENT_OR_CONTROL_FAILURE
    effect: MATERIAL_OR_DECISION_ISOLATED

remediation_state:
  REPAIR_ACTIVE:
    condition: DEFECT_LOCALIZED + APPROVED_RESTORATION_ACTION_ACTIVE
  RECONTROL_PENDING:
    condition: RESTORATION_COMPLETED
    exit: RECONTROL_PASSED
```

### 9.2 / NORMAL.REPAIR.TRANSITION

```text
READY
→ critical_defect_detected
→ STOP
→ isolate
→ REPAIR_ACTIVE
→ correct + restore_evidence
→ RECONTROL_PENDING
→ recontrol_passed
→ READY
```

```text
READY
→ missing_precondition
→ HOLD
→ restore_precondition OR execute_deviation_action
→ confirm
→ READY
```

`HOLD` применяется до запуска следующего перехода, когда нет обязательной предпосылки. `STOP` применяется только после обнаружения критического дефекта в исполняемом или выполненном переходе. Некритическое отклонение не переводится в `STOP` автоматически: для него требуется собственное deviation action.

### 9.3 / REGULAR.TRADE.CYCLE.INSTANCE.CLOSURE

```yaml
REGULAR_TRADE_CYCLE_INSTANCE_CLOSED_IF:
  - GOODS_COMPLETED_ROUTE_FROM_APPROVED_EP_ASSORTMENT_TO_CONFIRMED_SALE
  - CASHFLOW_CONFIRMED_BY_DOCUMENTS
  - ACTUAL_RESULT_CALCULATED_IN_E3
  - RESULT_ALLOCATION_DECIDED_IN_E4
  - ALLOWED_RESOURCE_RETURNED_TO_NEXT_CYCLE_BUDGET
```

Отсутствие evidence не заменяется предположением о выполнении oper.

Условия выше являются class-specific входами для оценки результата торгового цикла, а не автоматическим factual closure. Local `CYCLE_RECORD` закрывается только через `O4` после outcome comparison, evidence acceptance и решения `OWNER_LPR` по `EP-DP-DR-007`.

---

## 10 / PROJECT.PHYSIOLOGY

```yaml
PROJECT:
  definition: NONSTANDARD_TASK + DEADLINE + RESOURCE_LIMIT + TERMINAL_RESULT
  types: [REPAIR, GROWTH]
  priority_rule: IF_RESOURCE_CONFLICT_OR_CRITICAL_REPAIR_OPEN -> REPAIR_FIRST
  owner_resource_policy_ref: EP-DP-DR-005
  project_WIP_limit: 2
  WIP_counted_if: WIP_LOCAL_WORK_STATE_ACTIVE AND CURRENT_OWNER_TIME_ALLOCATED AND TERMINAL_NOT_REACHED
  WIP_excludes: [PRE_START_HOLD, PAUSED_NONTERMINAL_PROJECT]
  started_history_alone_counts_as_active_WIP: false
  regular_trade_counted_as_project_WIP: false
  terminal: [CLOSED, TRANSFERRED_TO_REGULAR_PROCESS]
  required_fields:
    - result
    - owner
    - deadline
    - budget
    - resource
    - quality
    - displaced_tasks
    - closure
    - handoff
```

Исходное сокращение `REPAIR > GROWTH` было интерпретировано в v0.1 и сохраняется в v0.2 как правило конкуренции за ограниченный ресурс, а не как безусловный запрет любого роста при наличии любого ремонта.

| Проект | Тип | Связь с физиологией | Статус связи |
|---|---|---|---|
| Декларация 3Д | `REPAIR` | Легальность ввоза и торговли; compliance-контур | Terminal result — `EP-DP-DR-039`; gate до заказа партии/финансирования импорта — `EP-DP-DR-043` |
| Маркировка | `REPAIR` | `L(R)2–L(R)4`; настройка и стабилизация marking workflow | `ACTIVE_NOT_STABILIZED`; `EP-DP-DR-040–041`: ПО ещё не настроено/валидировано; критерии успешного полного теста определены; transfer запрещён до test pass и приёмки `OWNER_LPR` |
| Брендирование | `GROWTH` | `VALUE_FILTER`, ассортимент, контент и `S1` | Terminal result определён `EP-DP-DR-042`; project card задана |

```yaml
PROJECT_CARD_DECLARATION_3D:
  type: REPAIR
  owner: OWNER_LPR
  terminal_result:
    - REQUIRED_DECLARATION_OBTAINED
    - DECLARATION_REGISTERED
    - DECLARATION_DOCUMENT_STORED_AS_EVIDENCE
    - RESULT_ACCEPTED_BY_OWNER_LPR
  pre_terminal_dependent_compliance_transition: HOLD
  terminal_state: CLOSED
  decision_ref: EP-DP-DR-039
```

```yaml
PROJECT_CARD_MARKING:
  type: REPAIR
  owner: OWNER_LPR
  current_state: ACTIVE_NOT_STABILIZED
  candidate_software: MOYSKLAD
  transfer_to_regular_process: FORBIDDEN_UNTIL_TEST_PASSED
  terminal_result:
    - MARKING_SOFTWARE_CONFIGURED
    - REQUIRED_MARKING_WORKFLOW_TEST_PASSED
    - RESULT_ACCEPTED_BY_OWNER_LPR
    - HANDOFF_TO_LR2_LR3_LR4_AUTHORIZED
  terminal_state: TRANSFERRED_TO_REGULAR_PROCESS
  test_acceptance_ref: EP-DP-DR-041
  decision_ref: [EP-DP-DR-040, EP-DP-DR-041]
```

```yaml
PROJECT_CARD_BRANDING:
  type: GROWTH
  owner: OWNER_LPR
  terminal_result:
    - BRAND_VISUALLY_DEFINED
    - LOGO_AND_IDENTITY_READY
    - PACKAGING_AND_LABELS_ALIGNED_WITH_BRAND
    - PRODUCT_CARDS_USE_COHERENT_BRAND_STYLE
    - RESULT_ACCEPTED_BY_OWNER_LPR
  terminal_state: CLOSED
  decision_ref: EP-DP-DR-042
```

```yaml
PROJECT_GATE_HOLD_IF:
  - NO_RESULT
  - NO_RESOURCE
  - NO_REPRIORITIZATION
  - NEW_PROJECT_AND_ACTIVE_PROJECT_COUNT_GREATER_THAN_OR_EQUAL_TO_2
  - NEW_PROJECT_WOULD_EXCEED_80_PERCENT_COMMITMENT_LIMIT

PROJECT_STOP_IF:
  - PROJECT_WITHOUT_END
  - PROJECT_WITHOUT_RESOURCE
  - PROJECT_PLUS_FULL_LOAD_WITHOUT_REPRIORITIZATION

PROJECT_OVERLOAD_PAUSE_IF:
  - ACTIVE_PROJECT_COUNT_GREATER_THAN_2
  - PLANNED_LOAD_HOURS_GREATER_THAN_MAXIMUM_PLANNED_COMMITMENT_HOURS_AFTER_HOLD_NEW_GROWTH
  - LOWER_PRIORITY_PROJECT_MUST_YIELD_TO_CRITICAL_REPAIR_OR_OWNER_LPR_CLASSIFIED_COMPLIANCE

RESOURCE_OVERLOAD_ROUTE:
  NEW_GROWTH: HOLD
  LOWEST_PRIORITY_ACTIVE_PROJECT: PAUSED_RESOURCE_OVERLOAD
  PAUSE_EFFECT: [RELEASE_CURRENT_OWNER_TIME_ALLOCATION, EXCLUDE_FROM_ACTIVE_PROJECT_COUNT, REMOVE_PAUSED_PROJECT_HOURS_FROM_CURRENT_PLANNED_LOAD_ON_REPLAN]
  PAUSE_REQUIRES: [PAUSE_RECORD, RESUME_CONDITION, REPLANNED_7_DAY_WINDOW]
  PAUSE_IS_TERMINAL: false
  CANONICAL_PROJECT_LIFECYCLE_MAPPING: TO_BE_DEFINED_IN_EPDP_OI_021
  REPEAT_OR_REPLAN_UNTIL:
    - ACTIVE_PROJECT_COUNT_LESS_THAN_OR_EQUAL_TO_2
    - PLANNED_LOAD_HOURS_LESS_THAN_OR_EQUAL_TO_MAXIMUM_PLANNED_COMMITMENT_HOURS
  IF_NO_PAUSABLE_ACTIVE_PROJECT:
    OVERLOAD_STATE: REMAINS_ACTIVE
    ACTION: HOLD_NEW_GROWTH_AND_REPLAN_UNTIL_HOUR_LIMIT_RESTORED
  CRITICAL_REPAIR_OR_COMPLIANCE_ADMISSION: PREEMPT_LOWEST_PRIORITY_PROJECT_IF_NEEDED

PROJECT.EXIT:
  CLOSED:
    condition: TERMINAL_RESULT_ACHIEVED_AND_ACCEPTED_BY_OWNER_LPR
  TRANSFERRED_TO_REGULAR_PROCESS:
    condition:
      - REPEATABLE_RESULT_FORMALIZED_AS_OPER_OR_RULE_OR_SOURCE_OF_TRUTH
      - HANDOFF_TESTED
      - HANDOFF_ACCEPTED_BY_OWNER_LPR
```

`SOURCE_STATED` для resource-overload route по `EP-DP-DR-005`: `PROJECT_GATE_HOLD_IF` применяется до запуска проекта; `PROJECT_OVERLOAD_PAUSE_IF` — к уже активному проекту и не означает `STOP` или terminal closure. `PROJECT_STOP_IF` применяется только при критическом дефекте активного проекта. Acceptance, closure и handoff определены `EP-DP-DR-044`; `EPDP-OI-021: RESOLVED`.

Закрытие observation `CYCLE_RECORD` класса `REPAIR_PROJECT` или `GROWTH_PROJECT` само по себе не создаёт project terminal state. Terminal state возникает только по `EP-DP-DR-044`: разовый результат принят → `CLOSED`; повторяемый результат формализован, проверен и принят в regular process → `TRANSFERRED_TO_REGULAR_PROCESS`.

---

## 11 / HOMEOSTASIS.GATES

Регулирующие opers `E1–E4` удерживают цикл в допустимых пределах и решают, можно ли направлять ресурс в повторение, ремонт или рост. Они не объявляются отдельным органом без дополнительного решения.

`REQUIRED` по EP-OSU; фактическое прохождение условий не подтверждено этим документом:

```yaml
GROWTH_ALLOWED_IF:
  - STOCK_CONFIRMED
  - CAPITAL_CONFIRMED
  - REPLENISHMENT_TIME_KNOWN
  - DOCUMENTS_VALID
  - MARKING_READY
  - LOGISTIC_READY
  - QUALITY_CONTROL_ACTIVE
  - SKU_ACCOUNTING_ACTIVE
  - RETURNS_CONTROLLED

GROWTH_HOLD_IF: ANY_CRITICAL_PRECONDITION_UNCONFIRMED

DECLARATION_3D_COMPLIANCE_GATE:
  decision_ref: EP-DP-DR-043
  gate_position: BEFORE_I1_SUPPLIER_BATCH_ORDER
  if_required_declaration_not_active:
    supplier_batch_order: HOLD
    project_account_import_financing: HOLD
  investment_funding_does_not_override_gate: true

E2_MIN_PRICE_GATE:
  decision_ref: EP-DP-DR-013
  baseline_calculation_date: 2026-07-16
  minimum_customer_price_after_ozon_discounts: 2900 RUB
  practical_operating_price: 2990 RUB
  violation_if: ACTUAL_CUSTOMER_PRICE_AFTER_OZON_DISCOUNTS < 2900_RUB
  violation_result: MIN_PRICE_RULE_FAILED


E4_RESERVE_GATE:
  decision_ref: EP-DP-DR-014
  basis: CONFIRMED_SALES_REVENUE_AFTER_RETURNS
  reserve_rate: 10 PERCENT
  reserve_formula: RESERVE_AMOUNT = 0.10 * CONFIRMED_SALES_REVENUE_AFTER_RETURNS
  reserve_before: REINVESTMENT
  release_authority: OWNER_LPR
  distribution_rule_state: UNRESOLVED

REPAIR_TRIGGER:
  - MIN_PRICE_RULE_FAILED
  - UNIT_ECONOMICS_FAILED
  - OZON_ACCEPTANCE_MISMATCH
  - CODE_COUNT_PACK_DOCUMENT_FAILED
```

`INFERRED`:

```yaml
IMPORT_HOLD_IF: BUDGET_OR_ECONOMIC_GATE_NOT_PASSED

CANDIDATE_VALUE_CLAIM_BLOCK_IF:
  FACTUAL_CLAIM_REQUIRES_EVIDENCE
  AND ACCEPTABLE_EVIDENCE_NOT_CONFIRMED
```

`E1` launch gate определён `EP-DP-DR-016`; `E4` distribution/reserve — `EP-DP-DR-014–015`; `E2` minimum price — `EP-DP-DR-013`. Runtime суммы и фактическое наличие инвестиционного финансирования определяются на каждом запуске партии.

---

## 12 / NORM.TO.PHYSIOLOGY

| Norm | Физиологическое правило | Защищаемый контур |
|---|---|---|
| `EP-OSU-01 / BOUNDARY` | Каждый внешний субъект имеет явный terminal result и контракт интерфейса | External integration |
| `EP-OSU-02 / AUTHORITY` | Решение связано с ответственностью; до делегирования решает `OWNER_LPR`; `O5` проверяет полномочие изменения | Authority |
| `EP-OSU-03 / FUNCTION.SPLIT` | Решение, исполнение, контроль и анализ различимы | Control |
| `EP-OSU-04 / END_TO_END.PROCESS` | Следующий этап не запускается без подтверждения предыдущего | Все regular flows |
| `EP-OSU-05 / SPECIALIZATION` | Смешение функций временно; узкая функция отделяется по триггеру перегрузки | Capacity |
| `EP-OSU-06 / PROJECT` | Нестандартная задача имеет terminal result и возвращает ресурс циклу | Repair / growth |
| `EP-OSU-07 / GROWTH.GATE` | Рост спроса не превышает обеспечивающую способность | Growth |
| `EP-OSU-08 / CONTROL` | Код, количество, упаковка и документы трассируются; дефект вызывает `STOP` | Quality / security |
| `EP-OSU-09 / INFORMATION` | Для каждой сущности существует один актуальный source of truth; `O1–O4` ведут cycle record и event log | Information / observation |
| `EP-OSU-10 / EXTERNAL.FUNCTION` | Подрядчики оцениваются по факту, истории и наличию fallback | External integration |
| `EP-OSU-11 / CHANGE` | Изменение применяется как связанный набор; `O5` обновляет затронутые бюджет, ответственность, данные, контроль, KPI и документы с версией и impact map | Change / observation |
| `EP-OSU-12 / FEEDBACK` | Критические первичные сигналы доходят до ЛПР без единственного посредника; наблюдение хранит ссылку на первичный источник | Feedback / observation |
| `EP-OSU-13 / DELEGATION` | Делегирование не уменьшает наблюдаемость и независимость контроля | Authority / control |

---

## 13 / DEFECT.PHYSIOLOGY

Риски EP-OSU здесь представлены как причины нарушения потоков.

| Группа | Риски | Механизм дефекта | Эффект |
|---|---|---|---|
| Центральный узел | `R-01, R-08, R-09, R-13` | Один ресурс принимает решения, исполняет, контролирует и держит ручные связи | Задержка, потеря независимых данных, остановка при недоступности собственника |
| Качество и evidence | `R-04, R-11` | Неполный контроль, нет сквозной доказательной цепи | Пересорт, ошибка маркировки, утрата, недоказуемая претензия |
| Внешняя интеграция | `R-12` | У внешней услуги нет terminal result, приёмки или fallback | Незавершённый oper и замороженный материальный поток |
| Несинхронное изменение | `R-06, R-10` | Одно звено растёт без бюджета, документов, логистики или контроля | Замороженный капитал и разрыв цикла |
| Копирование структуры | `R-07` | Каналы и функции умножаются по чужому шаблону | Распыление единственного ресурса |
| Конкуренция проектов | `R-14` | Несколько WIP конкурируют с regular cycle | Незавершённость проектов и остановка повторяемого процесса |
| Ассортимент | `R-15` | Исчезновение принта или SKU-overload | Непополняемость, ошибки каталога и учёта |
| Будущий найм | `R-02, R-03` | Разрыв сквозной ответственности или несколько источников команд | Конфликт приоритетов и множественное подчинение |
| Избыточный менеджмент | `R-05` | Координатор без стабильной oper-функции | Лишний канал, искажение и затраты |

`SOURCE_STATED`: `R-02` становится актуален после найма. `R-03` возрастает при появлении нескольких источников команд, неформальной смене приоритетов или делегировании без единого контура полномочий. Оба риска имеют низкую оценку `NOW`, но разные триггеры роста.

Эпистемический guard из EP-OSU сохранён без приписывания отрицательных характеристик ЛПР:

```yaml
NOT_ASSIGNED:
  - FAVORITISM
  - INDECISION
  - REFUSAL_TO_LEARN
  - FAMILY_APPOINTMENTS
  - REFUSAL_OF_RESPONSIBILITY
REASON: NO_EVIDENCE
```

`INFERRED`:

```yaml
dominant_failure_chain:
  ONE_OWNER_RESOURCE
  + MANY_MANUAL_INTERFACES
  + PARALLEL_PROJECT_WIP
  + INCOMPLETE_EVIDENCE
  -> DELAY_OR_ERROR
  -> UNFINISHED_CYCLE
  -> FROZEN_CAPITAL_OR_UNPROVABLE_CLAIM
  -> REGULAR_CYCLE_STOP
```

---

## 14 / SOURCE.OF.TRUTH

`REQUIRED` по `EP-OSU-09`:

| Entity | Минимальный source of truth | Связанные opers |
|---|---|---|
| `SKU_PATTERN` | Реестр SKU, принта, цвета, размера и статуса | `I1–I3`, `L(R)1–L(R)4`, `S1` |
| `SUPPLIER` | Карточка поставщика и история исполнения | `I1–I5` |
| `BATCH` | Реестр партии и единиц | `I2–E3` |
| `FULL_COST` | Себестоимость партии и единицы | `E2–E4` |
| `STOCK` | Остатки до и после каждой передачи | `L(R)1`, `L(R)4–L(R)7`, `S1` |
| `DOCUMENT` | Счёт, платёж, транспорт, таможня, маркировка, Ozon | Весь цикл |
| `PRICE` | Действующая цена и основание | `S1`, `E2` |
| `SALE_PAYOUT` | Заказы, реализация, комиссии, удержания и выплата | `S1–S2`, `E3` |
| `INCIDENT` | Отклонение, локализация, причина, repair, recontrol | `L(I)2–S2` |
| `PROJECT` | Карточка, WIP, ресурс, terminal state | Проектный контур |
| `DECISION` | Автор, основание, область и дата решения | `E1–E4`, изменения, делегирование |
| `CYCLE` | Identity contract: immutable `cycle_instance_id`, class из словаря, scope; event membership: одна primary и zero-to-many related links; closure outcome и append-only closure/reopen refs; required predecessor link и related membership с `relation_basis_ref` для новой работы после valid closure; узкий logical SLA envelope с class/start/deadline/actual record time/late metadata. Identity определена `EP-DP-DR-006`, closure/reopen — `EP-DP-DR-007`, recording SLA — `EP-DP-DR-008`; physical source of truth назначен `EP-DP-DR-009`, change governance определена `EP-DP-DR-011`; `EPDP-OI-024: RESOLVED` | `O1–O4` |
| `PROTOCOL_VERSION` | Действующая версия, история, evidence, impact map, diff и полномочие; `INFERRED`, введено для Observation | `O5` |
| `VALUE_CRITERIA` | Критерии и evidence соответствия `VAL-01–07`; `INFERRED`, введено для ценностного слоя | `I1`, `S1`, Branding |

Для каждого источника должны быть определены `DATA_OWNER` и `UPDATED_AT`.

`EP-DP-DR-009` назначает GitHub repository `valerol/ep_dashboard`, branch `main`, каноническим физическим source of truth. Базовый namespace: `data/ep-domain/`; файлы — UTF-8 YAML; observation events хранятся как отдельные append-only event files. Primary evidence может оставаться во внешней системе или документном хранилище, но каноническая запись обязана содержать устойчивую ссылку и metadata источника. История не переписывается молча: исправление выполняется новой записью, supersede/tombstone и Git commit.

### 14.1 / CANONICAL.REPOSITORY.TOPOLOGY

Снимок структуры: `2026-08-07`. Машиночитаемое зеркало: `data/ep-domain/repository-map.yaml`. Полная доменная структура является нормативной; верхнеуровневая структура сайта приводится для ориентации и не делает UI-код частью доменной физиологии.

```text
valerol/ep_dashboard@main
├── .openai/hosting.json                  # привязка Sites
├── README.md                             # вход в репозиторий
├── app/                                  # интерфейс сайта
├── build/                                # сборка
├── worker/                               # публикация/runtime сайта
├── scripts/                              # служебные скрипты
├── prompts/                              # процедуры обновления представления
├── sources/                              # правила обращения с источниками
├── tests/                                # проверки сайта и связей
└── data/
    ├── roadmap.json                      # дорожная карта
    ├── current-step.json                 # текущий шаг
    ├── news.json                         # бизнес-события
    ├── organs.json                       # органы проекта
    ├── machine.json                      # публичное представление машины
    ├── site-changelog.json               # история представления
    ├── source-registry.json              # безопасные ссылки на источники
    └── ep-domain/                        # канонический доменный namespace
        ├── README.md
        ├── repository-map.yaml
        ├── domain-physiology/
        │   ├── CURRENT.md
        │   └── EP-DP-v0.2.1.md
        └── observation/
            ├── cycle-types/
            │   └── registry.yaml
            ├── templates/
            │   ├── cycle.yaml
            │   └── event.yaml
            ├── protocol/
            │   └── EP-DP-LOGISTICS-CYCLE-PROTOCOL/
            │       └── 1.0.yaml
            ├── cycles/
            │   ├── README.md
            │   ├── EP-LI-20260807-001.yaml
            │   ├── EP-LI-20260807-002.yaml
            │   ├── EP-LR-20260807-001.yaml
            │   ├── EP-LR-20260807-002.yaml
            │   └── EP-LR-20260807-003.yaml
            ├── events/
            │   ├── README.md
            │   └── 2026/08/
            │       ├── EP-EVENT-20260807-001.yaml
            │       ├── EP-EVENT-20260807-002.yaml
            │       ├── EP-EVENT-20260807-003.yaml
            │       ├── EP-EVENT-20260807-004.yaml
            │       ├── EP-EVENT-20260807-005.yaml
            │       ├── EP-EVENT-20260807-006.yaml
            │       └── EP-EVENT-20260807-007.yaml
            └── indexes/
                └── cycles.yaml
```

```yaml
TOPOLOGY.AUTHORITY:
  normative_structure: EP-DP_v0.2.1_§14.1
  machine_readable_mirror: data/ep-domain/repository-map.yaml
  exact_current_physiology: data/ep-domain/domain-physiology/EP-DP-v0.2.1.md
  actual_cycle_state: data/ep-domain/observation/cycles/*.yaml
  actual_event_history: data/ep-domain/observation/events/<YYYY>/<MM>/*.yaml
  derived_only:
    - data/ep-domain/observation/indexes/cycles.yaml
  external_not_reconstructed:
    - PRIMARY_EVIDENCE_DOCUMENT_CONTENT
    - EXTERNAL_SYSTEM_CONTENT
    - GIT_HISTORY_BEFORE_SNAPSHOT
  drift_rule: EP-DP-DR-061
```

При изменении доменной топологии §14.1 и `repository-map.yaml` обновляются в одном change set. Новый фактический cycle/event добавляется в репозиторий без выпуска новой версии физиологии, если он соответствует существующим pattern и schema; меняется только инвентарная часть `repository-map.yaml`. Новая категория, новый singleton, новый pattern или изменение роли/authority требует новой версии физиологии либо явно версионированной поправки к ней.


---

## 15 / OPENITEM.REGISTER

### 15.1 / REGISTER.CONTRACT

`LOCAL_EP_DP_OPENITEM_REGISTER` — локальный реестр управления долгом. Его наличие не утверждает полную совместимость каждой записи с каноническим `OBJECT-OPENITEM`; это проверяется в `INTERNAL_QA`.

```yaml
OPENITEM_SCHEMA:
  openitem_id: EPDP-OI-NNN
  slug:
  class: [SPECIFICATION, OWNER_DECISION, EVIDENCE, VERIFICATION, AUTHORIZATION]
  resolution_state: OPEN | RESOLVED
  blocker: BLOCKS_INTERNAL_QA | BLOCKS_RELEASE | NON_BLOCKING
  source_refs: []
  subsumes: []
  depends_on: []
  accountable_owner: OWNER_LPR
  delivery_actor:
  runtime_effect:
  closure_rule:
  closure_evidence_refs: []
  resolved_by:
  resolved_at:
  resolved_in_version:

REGISTER_RULES:
  ID_IMMUTABLE: true
  SOURCE_NUMBER_IS_NOT_ID: true
  DUPLICATE_REQUIRES_IDENTICAL_CLOSURE_PREDICATE: true
  SUBSCOPE_OR_PREREQUISITE_IS_NOT_DUPLICATE: true
  NORMALIZATION_DOES_NOT_RESOLVE_DEBT: true
  RESOLUTION_DOES_NOT_PROMOTE_OPER_LIFECYCLE: true
  ASSISTIVE_PROCESSOR_IS_NOT_ACCOUNTABLE_OWNER: true
  DEPENDENCY_TYPE_MUST_BE_EXPLICIT_WHEN_PREREQUISITE_REMAINS_OPEN: true
  OPEN_IMPLEMENTATION_DEPENDENCY_MAY_COEXIST_WITH_SPECIFICATION_RESOLVED_ONLY_IF:
    - RESOLUTION_SCOPE_IS_EXPLICITLY_LIMITED_TO_DEFINITION_OR_DESIGN
    - RUNTIME_ACTIVATION_REMAINS_BLOCKED
    - DEPENDENCY_IS_NOT_CLAIMED_SATISFIED
  QA_ENTRY_REQUIRES: DEFINITION_AND_AUTHORIZATION_COMPLETE
  RELEASE_REQUIRES: TEST_OR_RUNTIME_EVIDENCE_ACCEPTED
```

`BLOCKS_INTERNAL_QA` означает: сначала должна существовать однозначная тестируемая спецификация, решение, ссылка или полномочие. `BLOCKS_RELEASE` означает: спецификация уже должна быть определена, но требуется выполненный test, подтверждённая совместимость, runtime evidence или отдельная авторизация. `NON_BLOCKING` не разрешает действие автоматически: отсутствие внешнего evidence может удерживать конкретный claim или runtime transition в `BLOCKED / HOLD / INACTIVE`, не блокируя release самой физиологии.

### 15.2 / DOMAIN.OPENITEMS

Если явно не указано иное, ссылки вида `§15.x` и `legacy §15.x` в колонке «Источник» относятся к immutable baseline `EP-DP v0.1` с SHA-256 `d172938068ab715cfc11ef65acb1be9c4829987aed3318902692b0c2d2de6e99`, а не к нумерации текущего раздела v0.2.

| ID | Slug / class | Источник / объединение | Blocker | Depends on | Closure rule / evidence |
|---|---|---|---|---|---|
| `EPDP-OI-001` | `CATALOG_BOUNDARY` / `OWNER_DECISION` | §15.1.1 | `BLOCKS_INTERNAL_QA` | — | `SUPPLIER_OFFER` и `MARKET_DEMAND_SIGNALS` определены как external inputs; `EP_ASSORTMENT_REGISTER` — internal controlled entity; `OZON_CATALOG` — external publication interface; owner решения — `OWNER_LPR`. |
| `EPDP-OI-002` | `DEMAND_ASSORTMENT_CATALOG_OPERS` / `SPECIFICATION` | §15.1.2 + неописанное создание карточек | `BLOCKS_INTERNAL_QA` | `001` | `RESOLVED` `EP-DP-DR-029`: созданы `A1 / FORM_EP_ASSORTMENT` и `A2 / CREATE_OR_UPDATE_OZON_PRODUCT_CARD`; заданы owner, states, triggers, evidence, transitions и `A2 → S1` gate. Определение value criteria остаётся независимым `EPDP-OI-009`. |
| `EPDP-OI-003` | `RETURNS_OPER` / `SPECIFICATION` | §15.1.6 | `BLOCKS_INTERNAL_QA` | `012,019` | `RESOLVED` `EP-DP-DR-030`: создан `S3 / PROCESS_OZON_RETURN`; physical route → Ozon warehouse; classification owner = Ozon, internal inspection method = `UNKNOWN`; saleable → stock/sale, unsaleable → Ozon disposition; seller inspects only if item returned to seller; finance reflected by Ozon reports. |
| `EPDP-OI-004` | `FEEDBACK_OPER_AND_CADENCE` / `SPECIFICATION` | §15.3.8 + отсутствующий oper `FEEDBACK` | `BLOCKS_INTERNAL_QA` | `011,019` | `RESOLVED` `EP-DP-DR-031`: `F1 / OPERATIONAL_REVIEW = WEEKLY`, `F2 / STRATEGIC_REVIEW = QUARTERLY`; заданы trigger, owner, inputs, outputs, decision gates и evidence contract; critical signals не ждут weekly cadence. |
| `EPDP-OI-005` | `TRADE_CLASSIFICATION` / `OWNER_DECISION` | §15.3.9 | `BLOCKS_INTERNAL_QA` | `001` | Утверждены `SYSTEM_ACTIVITY: TRADE`, `PRODUCTION_MODEL: EXTERNAL_INDEPENDENT_MANUFACTURING`, `EP_ROLE: ASSORTMENT_BRAND_AND_COMMERCE_OPERATOR`, `OWN_PRODUCTION: false`; `PRODUCING_SELLING` отклонён как неоднозначный; юридический статус вне scope. |
| `EPDP-OI-006` | `E1_BATCH_LAUNCH_GATE` / `OWNER_DECISION + SPECIFICATION` | часть §15.1.3 + legacy §15.2.6 | `BLOCKS_INTERNAL_QA` | `007,008,019` | `RESOLVED` `EP-DP-DR-016`: запуск при полном покрытии `FULL_KNOWN_BATCH_COST` доступным cash после E4 и/или подтверждённым инвестиционным капиталом; при дефиците и stockout risk допускается financing route, но закупка остаётся `HOLD` до подтверждения средств. |
| `EPDP-OI-007` | `E2_MIN_PRICE_GATE` / `OWNER_DECISION + SPECIFICATION` | §15.1.4 | `BLOCKS_INTERNAL_QA` | `019` | Минимальная цена вычисляется из full cost, переменных удержаний и требуемого результата; утверждены дата данных и реакция на нарушение. |
| `EPDP-OI-008` | `E4_ALLOCATION_AND_RESERVE` / `OWNER_DECISION + SPECIFICATION` | часть §15.1.3 + legacy §15.2.7 | `BLOCKS_INTERNAL_QA` | `019,022` | `RESOLVED` `EP-DP-DR-014–015`: reserve `10%` confirmed sales revenue after returns; allocation order `obligations → reserve → critical repair/compliance → next batch → growth`; available envelope и контрольный пример определены. |
| `EPDP-OI-009` | `VAL_01_07_CRITERIA` / `OWNER_DECISION + SPECIFICATION` | design-часть §15.1.7 | `BLOCKS_INTERNAL_QA` | `019` | `RESOLVED` `EP-DP-DR-032–038`: критерии `VAL-01–07` определены; субъективные brand-values решает `OWNER_LPR`; factual claims требуют evidence; применяются только релевантные конкретному действию ценности; `VAL-07` дополнительно определён как перспективный маркетинговый маршрут. Material-origin evidence остаётся отдельным `EPDP-OI-010`. |
| `EPDP-OI-010` | `MATERIAL_ORIGIN_EVIDENCE_INSTANCE` / `EVIDENCE` | factual-часть §15.1.7 | `NON_BLOCKING` | `009` | `OPEN / TODO`: подтвердить связь `ChinRada → Thai Rayon` либо `ChinRada → другой производитель материала/ткани` и получить первичное evidence происхождения/органичности. Organic claim остаётся `BLOCKED_PENDING_EVIDENCE`. |
| `EPDP-OI-011` | `RESPONSIBILITY_AND_AUTHORITY_MATRIX` / `OWNER_DECISION` | §15.1.8 + §15.3.2 + §15.4.1 | `BLOCKS_INTERNAL_QA` | — | Все opers имеют `FUNCTION → OPER → RESPONSIBLE → CONTROL`; назначены `L(R)2–L(R)4`, `O1–O5` и change authority. |
| `EPDP-OI-012` | `INDEPENDENT_CONTROL` / `OWNER_DECISION + SPECIFICATION` | §15.1.5 | `BLOCKS_INTERNAL_QA` | `011,019` | Утверждён адаптивный выбор независимого контроля по характеристикам действия: time-separated self-recheck, isolated LLM review или external specialist review; контрольный акт имеет отдельные timestamp/result/evidence, итоговое решение остаётся за `OWNER_LPR`. |
| `EPDP-OI-013` | `I3_CONSUMABLES` / `SPECIFICATION` | legacy §15.2.1 | `BLOCKS_INTERNAL_QA` | `011,019` | `RESOLVED` `EP-DP-DR-017`: minimum = next-batch need + 10%; check after `I2`, final gate before `L(R)4`; shortage → replenish + `HOLD` until physical stock satisfies formula; evidence contract defined. |
| `EPDP-OI-014` | `I5_SUPPLIER_TO_CARRIER_HANDOFF` / `SPECIFICATION` | legacy §15.2.2 | `BLOCKS_INTERNAL_QA` | `011` | `RESOLVED` `EP-DP-DR-018`: поставщик самостоятельно доставляет посылку международному перевозчику; `I5` фиксирует dispatch только после получения tracking number поставщика и фото посылки; pickup request от `OWNER_LPR` отсутствует. |
| `EPDP-OI-015` | `LI2_TRANSFER_EVIDENCE` / `SPECIFICATION` | legacy §15.2.3 | `BLOCKS_INTERNAL_QA` | `011` | `RESOLVED` `EP-DP-DR-019`: этап завершён только после счёта перевозчика, подтверждённой оплаты и международного tracking number; неполнота → `HOLD`. |
| `EPDP-OI-016` | `LR1_RECOUNT_AND_DEVIATION` / `SPECIFICATION` | legacy §15.2.4 | `BLOCKS_INTERNAL_QA` | `012,019` | `RESOLVED` `EP-DP-DR-020`: полный пересчёт; визуальное сопоставление паттерна с SKU по памяти; tolerance не применяется; фактически полученный товар используется как рабочий вход; любое количественное/ассортиментное расхождение → incident + discussion with supplier; shortage при необходимости эскалируется перевозчику; повреждённая упаковка → вскрытие и проверка товара. |
| `EPDP-OI-017` | `LR2_MARKING_ACCEPTANCE` / `SPECIFICATION` | legacy §15.2.5 | `BLOCKS_INTERNAL_QA` | `011,019` | `RESOLVED` `EP-DP-DR-021`: acceptance = статус товарной единицы `«в обороте»` в системе «Честный Знак»; иной или неподтверждённый статус → `HOLD`; evidence = product-unit identifier + observed status + check timestamp. |
| `EPDP-OI-018` | `TWELVE_INTERFACE_CONTRACTS` / `SPECIFICATION` | §15.3.1 + §15.3.6 | `BLOCKS_INTERNAL_QA` | `006-008,011,013-017` | `RESOLVED` `EP-DP-DR-028`: все 12 cards имеют `acceptance_owner`, oper/interface-specific `evidence`, `deadline`, `cost_or_na`, `deviation_action`, `fallback`; общий fallback использует только фактически существующую альтернативу, иначе зависимый переход остаётся `HOLD` до решения `OWNER_LPR`. |
| `EPDP-OI-019` | `SOURCE_OF_TRUTH_AND_MEMORY` / `OWNER_DECISION + SPECIFICATION` | §15.3.3 + §15.4.3 | `BLOCKS_INTERNAL_QA` | `011` | Для сущностей §14 назначены location/format, key/schema, data owner, write authority, update trigger, retention; выбраны Observation registers. |
| `EPDP-OI-020` | `THREE_PROJECT_CARDS_AND_COMPLIANCE_GATE` / `SPECIFICATION` | §15.3.4 + project gap §10 | `BLOCKS_INTERNAL_QA` | `011,022` | `RESOLVED`: «Декларация 3Д» — `EP-DP-DR-039`; «Маркировка» — `EP-DP-DR-040–041`; «Брендирование» — `EP-DP-DR-042`; compliance gate до заказа партии и финансирования импорта — `EP-DP-DR-043`. |
| `EPDP-OI-021` | `PROJECT_EXIT_AND_HANDOFF` / `OWNER_DECISION + SPECIFICATION` | §15.3.5 + unresolved §10 | `BLOCKS_INTERNAL_QA` | `020` | `RESOLVED` `EP-DP-DR-044`: разовый проект закрывается после достижения terminal result и acceptance `OWNER_LPR`; повторяемый результат требует формализации `oper / rule / source_of_truth`, test handoff и acceptance до `TRANSFERRED_TO_REGULAR_PROCESS`. |
| `EPDP-OI-022` | `OWNER_RESOURCE_AND_WIP` / `OWNER_DECISION + SPECIFICATION` | baseline §15.3.7 + baseline §16.2 item 6 | `BLOCKS_INTERNAL_QA` | — | Заданы unit, horizon, reserve, overload threshold, WIP-limit и reprioritization action; фактический baseline измеряется в QA. |
| `EPDP-OI-023` | `OBSERVATION_CYCLE_IDENTITY` / `OWNER_DECISION + SPECIFICATION` | §15.4.2 + residue `O1` | `BLOCKS_INTERNAL_QA` | `001` | Утверждены membership dictionary, `cycle_class / instance / scope`, ID rule и разрешение multiple membership. |
| `EPDP-OI-024` | `OBSERVATION_CHANGE_GOVERNANCE` / `OWNER_DECISION + SPECIFICATION` | §15.4.4 + §15.4.7 + residues `O3/O5` | `BLOCKS_INTERNAL_QA` | `011,019` | Утверждены significant evidence decision rule и оставшаяся change governance schema; retention и rollback уже определены `EP-DP-DR-010` через Git/GitHub без уничтожения истории. |
| `EPDP-OI-025` | `OBSERVATION_CLOSURE_AND_REOPEN` / `OWNER_DECISION + SPECIFICATION` | §15.4.5 + residue `O4` | `BLOCKS_INTERNAL_QA` | `023` | Утверждены closure authority, outcomes, acceptance и правило reopen либо нового linked cycle. |
| `EPDP-OI-026` | `OBSERVATION_RECORDING_SLA` / `OWNER_DECISION + SPECIFICATION` | §15.4.6 | `BLOCKS_INTERNAL_QA` | `019,023` | Для классов событий задан logical SLA `O3/O4`, late flag, escalation и timestamps; `019` остаётся implementation/runtime dependency и блокирует activation, но не definition-resolution. |

### 15.3 / CANON.LIFECYCLE.TEST.OPENITEMS

| ID | Slug / class | Источник | Blocker | Depends on | Closure rule / evidence |
|---|---|---|---|---|---|
| `EPDP-OI-027` | `CANON_VERSION_LABEL_MISMATCH` / `EVIDENCE` | §0.3 | `NON_BLOCKING` | — | Получено авторитетное разрешение `2.44/2.43` либо release scope продолжает ссылаться только на pinned SHA; mismatch не скрыт. |
| `EPDP-OI-028` | `ALL_OPER_OBJECTS_COMPLETE` / `SPECIFICATION` | §0.4 + §§5–6 | `BLOCKS_INTERNAL_QA` | все применимые `001–026` | `RESOLVED` by `EP-DP-DR-054`; все 14 required fields имеют definition-level значение/правило для 32 opers; `value_or_risk_gate` normalised oper-specifically; audit: `INCOMPLETE=0`, `REFERENCE_UNRESOLVED=0`. Runtime instance refs/amounts создаются по факту исполнения и не являются definition debt. |
| `EPDP-OI-029` | `PHYSIOLOGY_OBJECT_COMPLETE` / `SPECIFICATION` | §0.4 + §16 | `BLOCKS_INTERNAL_QA` | `018,019,028` | `RESOLVED` `EP-DP-DR-059`: `machine_id`, generation, schemas, compatibility contract, test registry и formal lifecycle record определены; definition-level объект `Physiology` полный. Lifecycle остаётся `CANDIDATE`; переход в `INTERNAL_QA` требует отдельного `EPDP-OI-030`. |
| `EPDP-OI-030` | `INTERNAL_QA_ENTRY_AUTHORIZATION` / `AUTHORIZATION` | §0.4 + §16 | `BLOCKS_INTERNAL_QA` | все открытые `BLOCKS_INTERNAL_QA`, кроме `030` | `RESOLVED` `EP-DP-DR-060`: `OWNER_LPR` авторизовал `CANDIDATE → INTERNAL_QA` для `EP-DP-001 / v0.2`; transition event записан; automatic transition запрещён. |
| `EPDP-OI-031` | `COMPATIBILITY_CONFIRMATION` / `VERIFICATION` | §16 | `BLOCKS_RELEASE` | `030` | `RESOLVED` `EP-DP-QA-001`: matrix проверена относительно exact pinned canon SHA, EP-OPERS и EP-OSU; substantive conflicts не обнаружены; label mismatch `2.44/2.43` сохранён как `EPDP-OI-027`, named compatibility claim остаётся blocked. |
| `EPDP-OI-032` | `INTERNAL_QA_EXECUTION` / `VERIFICATION` | baseline §16.2 items 8–9 + current §16 release gate | `BLOCKS_RELEASE` | `030,031` | `RESOLVED` by `EP-DP-QA-OI-032-20260807`: structural/reference, route, interface, economics, control, SLA, `HOLD`, `STOP→REPAIR→RECONTROL`, returns, claim-block и `O1–O5` tests пройдены; defect log закрыт. |
| `EPDP-OI-033` | `PROSPECTIVE_REAL_BATCH_PILOT` / `VERIFICATION` | baseline §16.2 item 9 + current §16 release gate | `BLOCKS_RELEASE` | `032` | Реальная партия прошла заявленный release scope с primary evidence по material, financial, information и evidence flows; defects recontrolled; cycle closed. |
| `EPDP-OI-034` | `RELEASE_AUTHORIZATION` / `AUTHORIZATION` | §16 | `BLOCKS_RELEASE` | `031-033` | Нет открытых release blockers; factual claims подтверждены либо остаются blocked; ЛПР отдельно авторизовал `INTERNAL_QA → RELEASED` для version/hash. |

### 15.4 / SOURCE.DEDUPLICATION.MAP

```yaml
SOURCE_COUNTS:
  SOURCE_DOCUMENT: EP-DP_v0.1@sha256:d172938068ab715cfc11ef65acb1be9c4829987aed3318902692b0c2d2de6e99
  RAW_NUMBERED_ENTRIES_SECTION_15: 31
  LEGACY_TODO_ROWS_WITHIN_31: 7
  OBSERVATION_DESIGN_ROWS_WITHIN_31: 7
  OBSERVATION_OPER_RESIDUE_ROWS_OUTSIDE_SECTION_15: 5
  NOTE: COUNTS_OVERLAP_AND_MUST_NOT_BE_ADDED

EXACT_ALIASES: []

SUBSUMED_SOURCE_ITEMS:
  EPDP-OI-006: [baseline §15.1.3, baseline §15.2.6]
  EPDP-OI-008: [baseline §15.1.3, baseline §15.2.7]
  EPDP-OI-011: [§15.1.8, §15.3.2, §15.4.1]
  EPDP-OI-018: [§15.3.1, §15.3.6]
  EPDP-OI-019: [§15.3.3, §15.4.3]
  EPDP-OI-024: [§15.4.4, §15.4.7]

SPLIT_SOURCE_ITEMS:
  §15.1.3: [EPDP-OI-006, EPDP-OI-008]
  §15.1.7: [EPDP-OI-009, EPDP-OI-010]

RESOLUTION_STATE_INDEX:
  authoritative_for_resolution_state: true
  RESOLVED:
    EPDP-OI-001:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-002
      resolved_at: 2026-08-06
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-002, EP-DP_v0.2_§3.4, EP-DP_v0.2_§7.3]
    EPDP-OI-002:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-029
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-029, EP-DP_v0.2_§5.1, EP-DP_v0.2_§5.2, EP-DP_v0.2_§7.3]
    EPDP-OI-003:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-030
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-030, EP-DP_v0.2_§5.1, EP-DP_v0.2_§5.2, EP-DP_v0.2_§7.4]
    EPDP-OI-004:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-031
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-031, EP-DP_v0.2_§0.35, EP-DP_v0.2_§4, EP-DP_v0.2_§12]
    EPDP-OI-005:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-003
      resolved_at: 2026-08-06
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-003, EP-DP_v0.2_§3.3]
    EPDP-OI-006:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-016
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-016, EP-DP_v0.2_§1.1, EP-DP_v0.2_§11]
    EPDP-OI-007:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-013
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-013, EP-DP_v0.2_§11, E2_BASELINE_CALCULATION:2026-07-16]
    EPDP-OI-008:
      resolution_state: RESOLVED
      resolved_by: [EP-DP-DR-014, EP-DP-DR-015]
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-014, EP-DP-DR-015, EP-DP_v0.2_§1.1]
    EPDP-OI-009:
      resolution_state: RESOLVED
      resolution_scope: VALUE_CRITERIA_AND_GATE_CONTRACT_DEFINED
      resolved_by: [EP-DP-DR-032, EP-DP-DR-033, EP-DP-DR-034, EP-DP-DR-035, EP-DP-DR-036, EP-DP-DR-037, EP-DP-DR-038]
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-038, EP-DP_v0.2_§2]
    EPDP-OI-011:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-004
      resolved_at: 2026-08-06
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-004, EP-DP_v0.2_§4.2, EP-DP_v0.2_§6.1, EP-DP_v0.2_§6.7]
    EPDP-OI-012:
      resolution_state: RESOLVED
      resolution_scope: INDEPENDENT_CONTROL_METHOD_SELECTION_DEFINED
      runtime_verification: NOT_YET_TESTED
      resolved_by: EP-DP-DR-012
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-012, EP-DP_v0.2_§4.2, EP-DP_v0.2_§7.6]
    EPDP-OI-013:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-017
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-017, EP-DP_v0.2_§5.1, EP-DP_v0.2_§5.2, EP-DP_v0.2_§5.3]
    EPDP-OI-014:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-018
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-018, EP-DP_v0.2_§5.1, EP-DP_v0.2_§5.2, EP-DP_v0.2_§8]
    EPDP-OI-015:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-019
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-019, EP-DP_v0.2_§5.1, EP-DP_v0.2_§5.2]
    EPDP-OI-016:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-020
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-020, EP-DP_v0.2_§5.2.1]
    EPDP-OI-017:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-021
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-021, CHESTNY_ZNAK:PRODUCT_UNIT_STATUS_IN_CIRCULATION]
    EPDP-OI-018:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-028
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-022, EP-DP-DR-023, EP-DP-DR-024, EP-DP-DR-025, EP-DP-DR-026, EP-DP-DR-027, EP-DP-DR-028, EP-DP_v0.2_§8]
    EPDP-OI-019:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-009
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-009, GITHUB_REPOSITORY:valerol/ep_dashboard@main, EP-DP_v0.2_§14]
    EPDP-OI-020:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-043
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-039, EP-DP-DR-040, EP-DP-DR-041, EP-DP-DR-042, EP-DP-DR-043, EP-DP_v0.2_§10, EP-DP_v0.2_§11]
    EPDP-OI-021:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-044
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-044, EP-DP_v0.2_§10]
    EPDP-OI-022:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-005
      resolved_at: 2026-08-06
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-005, EP-DP_v0.2_§4.3, EP-DP_v0.2_§10]
    EPDP-OI-023:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-006
      resolved_at: 2026-08-06
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-006, EP-DP_v0.2_§6.2, EP-DP_v0.2_§6.3, EP-DP_v0.2_§6.4]
    EPDP-OI-024:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-011
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-009, EP-DP-DR-010, EP-DP-DR-011, EP-DP_v0.2_§6.7]
    EPDP-OI-025:
      resolution_state: RESOLVED
      resolved_by: EP-DP-DR-007
      resolved_at: 2026-08-06
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-007, EP-DP_v0.2_§6.2, EP-DP_v0.2_§6.6, EP-DP_v0.2_§6.8]
    EPDP-OI-026:
      resolution_state: RESOLVED
      resolution_scope: LOGICAL_O3_O4_RECORDING_SLA_CONTRACT_DEFINED
      runtime_activation: PATHS_DEFINED_WRITER_NOT_YET_VERIFIED
      resolved_by: EP-DP-DR-008
      resolved_at: 2026-08-06
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-008, EP-DP_v0.2_§6.2, EP-DP_v0.2_§6.5, EP-DP_v0.2_§6.6]
    EPDP-OI-028:
      resolution_state: RESOLVED
      resolution_scope: ALL_32_OPER_DEFINITIONS_SCHEMA_COMPLETE
      resolved_by: EP-DP-DR-054
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-045, EP-DP-DR-046, EP-DP-DR-047, EP-DP-DR-048, EP-DP-DR-049, EP-DP-DR-050, EP-DP-DR-051, EP-DP-DR-052, EP-DP-DR-053, EP-DP-DR-054, EP-DP_v0.2_§0.4]
    EPDP-OI-029:
      resolution_state: RESOLVED
      resolution_scope: PHYSIOLOGY_DEFINITION_OBJECT_COMPLETE
      resolved_by: EP-DP-DR-059
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-055, EP-DP-DR-056, EP-DP-DR-057, EP-DP-DR-058, EP-DP-DR-059, EP-DP_v0.2_§0.4]
    EPDP-OI-030:
      resolution_state: RESOLVED
      resolution_scope: INTERNAL_QA_ENTRY_AUTHORIZED_AND_APPLIED
      resolved_by: EP-DP-DR-060
      resolved_at: 2026-08-07T12:49:00+10:00
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-DR-060, EP-DP_v0.2_§0.4, EP-DP_v0.2_§16]
    EPDP-OI-031:
      resolution_state: RESOLVED
      resolution_scope: COMPATIBILITY_CONFIRMED_FOR_PINNED_ARTIFACT_SCOPE
      resolved_by: EP-DP-QA-001
      resolved_at: 2026-08-07
      resolved_in_version: 0.2
      closure_evidence_refs: [EP-DP-QA-001, PINNED_BOIS_SHA256:0b1c7b46cd084679ed08c4babd13e35c686250c06d1fd79f1a8d26140685304a, EP_OPERS_V0_1, EP_OSU_V0_2]
    EPDP-OI-032:
      resolution_state: RESOLVED
      resolution_scope: INTERNAL_QA_EXECUTION_COMPLETE
      resolved_by: EP-DP-QA-OI-032-20260807
      resolved_at: 2026-08-07T14:54:00+10:00
      resolved_in_version: 0.2
      closure_evidence_refs:
        - GITHUB:valerol/ep_dashboard@qa/ep-dp-v0.2-observation:data/ep-domain/qa/EP-DP-v0.2/OI-032-observation-runtime.yaml
        - GITHUB:valerol/ep_dashboard@qa/ep-dp-v0.2-observation:data/ep-domain/qa/EP-DP-v0.2/OI-032-sla-qa.yaml
        - GITHUB:valerol/ep_dashboard@qa/ep-dp-v0.2-observation:data/ep-domain/qa/EP-DP-v0.2/OI-032-control-review.yaml
        - GITHUB:valerol/ep_dashboard@qa/ep-dp-v0.2-observation:data/ep-domain/qa/EP-DP-v0.2/OI-032-state-and-domain-fixtures.yaml
        - GITHUB:valerol/ep_dashboard@qa/ep-dp-v0.2-observation:data/ep-domain/qa/EP-DP-v0.2/OI-032-defect-log.yaml
  OPEN:
    resolution_state: OPEN
    id_ranges:
      - from: EPDP-OI-033
        through: EPDP-OI-034
        semantics: INCLUSIVE_NUMERIC_SUFFIX
        count: 2
    isolated_ids: [EPDP-OI-010, EPDP-OI-027]
    isolated_count: 2
    count: 4

REGISTER_COUNTS:
  UNIQUE_OPENITEM_IDS: 34
  RESOLUTION_OPEN: 4
  RESOLUTION_RESOLVED: 30
  BLOCKS_INTERNAL_QA_OPEN: 0
  BLOCKS_RELEASE_OPEN: 2
  NON_BLOCKING_OPEN: 2
```

Индекс `RESOLUTION_STATE_INDEX` — авторитетная текущая ось состояния долга; blocker class в основной таблице сохраняет исторический gate и не возвращает `RESOLVED` item в `OPEN`. Назначение ID и объединение источников сами по себе не закрывают предметный долг. Решениями `EP-DP-DR-002–031` закрыты перечисленные в индексе domain OpenItem, включая `EPDP-OI-018`: `EP-DP-DR-022–027` задают общие interface defaults, а `EP-DP-DR-028` инстанцирует все 12 contracts и общий fallback. `EPDP-OI-026` закрыт только на definition/design scope; runtime writer и фактическое соблюдение SLA требуют QA. `EPDP-OI-024` закрыт `EP-DP-DR-009–011`; `EPDP-OI-008` — `EP-DP-DR-014–015`; `EPDP-OI-006` — `EP-DP-DR-016`. Открыты 4 OpenItem: `EPDP-OI-033–034` как release blockers и `EPDP-OI-010`, `EPDP-OI-027` как non-blocking evidence items. `EPDP-OI-032` закрыт runtime QA.

---

## 16 / V0.2.CONTENT.GATE

```yaml
PHYSIOLOGY_LIFECYCLE_STATE: INTERNAL_QA
INTERNAL_QA_ENTRY:
  status: REACHED
  authorization_ref: EP-DP-DR-060
  authorized_at: 2026-08-07T12:49:00+10:00

RELEASE_STATUS: NOT_RELEASED

CURRENT_DEFINITION:
  machine_id: EP-MACHINE-001
  opers:
    total: 32
    regular: 27
    observation: 5
    lifecycle_state: CANDIDATE
    definition_completeness: PASS
    transition_to_observed_authorized: false
  interfaces:
    count: 12
    contract_completeness: PASS
  physiology_required_fields: COMPLETE
  definition_references: RESOLVED

INTERNAL_QA_STATIC_RUN:
  qa_run_id: EP-DP-QA-001
  status: PASS
  test_summary:
    pass: 7
    design_pass_runtime_pending: 0
  compatibility:
    status: CONFIRMED_FOR_PINNED_ARTIFACT_SCOPE
    openitem: EPDP-OI-031
    resolution_state: RESOLVED

INTERNAL_QA_RUNTIME_RUN:
  qa_run_id: EP-DP-QA-OI-032-20260807
  status: PASS
  observation: O1_O5_PASS
  sla: PASS
  independent_control_review: PASS
  state_and_domain_fixtures: PASS
  defect_log: CLOSED
  openitem: EPDP-OI-032
  resolution_state: RESOLVED
  github_branch: qa/ep-dp-v0.2-observation

OPENITEM_COUNTS:
  total: 34
  resolved: 30
  open: 4
  blocks_internal_qa_open: 0
  blocks_release_open: 2
  non_blocking_open: 2

RELEASE_BLOCKERS:
  - EPDP-OI-033_PROSPECTIVE_REAL_BATCH_PILOT
  - EPDP-OI-034_RELEASE_AUTHORIZATION

NON_BLOCKING_OPEN:
  - EPDP-OI-010_MATERIAL_ORIGIN_EVIDENCE_INSTANCE
  - EPDP-OI-027_CANON_VERSION_LABEL_MISMATCH

CANDIDATE_TO_INTERNAL_QA_BLOCKED_BY: []

INTERNAL_QA_TO_RELEASED_NOT_YET_SATISFIED:
  - PROSPECTIVE_REAL_BATCH_NOT_TRACED
  - RELEASE_TRANSITION_NOT_AUTHORIZED
```

Этот блок подтверждает definition-level сборку `v0.2`, авторизованный вход в `INTERNAL_QA`, статические результаты `EP-DP-QA-001` и runtime QA `EP-DP-QA-OI-032-20260807`. Он не подтверждает prospective real batch (`EPDP-OI-033`) или `RELEASED`.

### 16.1 / TARGET.NEAR

```yaml
CURRENT:
  FORMING_SINGLE_NODE
  + REPEATING_TRADE_CYCLE
  + INCOMPLETE_CONTROL_AND_EVIDENCE

TARGET_NEAR:
  CONTROLLED_SINGLE_NODE
  + FORMALIZED_PROCESS
  + EXTERNAL_FUNCTION_INTEGRATION
  + OBSERVATION_AND_VERSIONED_PROTOCOL
  + VALUE_GATES
```

### 16.2 / V0.2.WORK.PLAN

```yaml
WAVE_1_OWNER_DECISIONS: []

WAVE_1_RESOLVED:
  - EPDP-OI-001
  - EPDP-OI-005
  - EPDP-OI-011
  - EPDP-OI-012
  - EPDP-OI-019
  - EPDP-OI-022
  - EPDP-OI-023
  - EPDP-OI-024
  - EPDP-OI-025
  - EPDP-OI-026

WAVE_2_RESOLVED:
  - EPDP-OI-002
  - EPDP-OI-003
  - EPDP-OI-004
  - EPDP-OI-006
  - EPDP-OI-007
  - EPDP-OI-008
  - EPDP-OI-014
  - EPDP-OI-015
  - EPDP-OI-018
  - EPDP-OI-009
  - EPDP-OI-020
  - EPDP-OI-021

WAVE_2_GATES: []

WAVE_3_SPECIFICATION_RESOLVED:
  - EPDP-OI-028
  - EPDP-OI-029
WAVE_3_SPECIFICATION_OPEN: []

WAVE_4_INTERNAL_QA_ENTRY_RESOLVED:
  - EPDP-OI-030

WAVE_5_QA_AND_RELEASE_EVIDENCE:
  RESOLVED:
    - EPDP-OI-031
    - EPDP-OI-032
  OPEN:
    - EPDP-OI-033-034

NON_BLOCKING_RUNTIME_EVIDENCE:
  - EPDP-OI-010
  - EPDP-OI-027
```

Ближний terminal result `v0.2`: закрыты все `BLOCKS_INTERNAL_QA`, сформирован testable object, и ЛПР отдельно авторизовал `CANDIDATE → INTERNAL_QA`. Прогон реальной партии и выпуск `RELEASED` относятся к последующему QA/release gate, а не к факту создания рабочей `v0.2`.

---

## 17 / TRACEABILITY

| Раздел EP-DP | Источник |
|---|---|
| Канонические схемы и lifecycle объектов; правило natural-language extraction | Pinned BOIS artifact `sha256:0b1c7b46cd084679ed08c4babd13e35c686250c06d1fd79f1a8d26140685304a`; supplied metadata `2.44`, observed footer `2.43`, label `UNRESOLVED`: `OBJECT-CYCLE` (визуальная стр. 86), `OBJECT-OPENITEM` (стр. 98), `OBJECT-OPER` (стр. 99), `OBJECT-PHYSIOLOGY` (стр. 103), `N-GEN-073` (стр. 187) |
| `BASELINE.AND.WORKING.TARGET` | Решение `EP-DP-DR-001`, авторизовано `OWNER_LPR` 2026-08-06; scope исключает lifecycle promotion |
| `CATALOG.BOUNDARY` | Решение `EP-DP-DR-002`, авторизовано `OWNER_LPR` 2026-08-06; closure evidence для `EPDP-OI-001`; oper route, value criteria и source of truth не включены в closure scope |
| `TRADE.CLASSIFICATION` | Решение `EP-DP-DR-003`, авторизовано `OWNER_LPR` 2026-08-06; closure evidence для `EPDP-OI-005`; юридический статус, compliance, ОКВЭД и налоговый режим в scope не входят |
| `RESPONSIBILITY.AND.AUTHORITY` | Решение `EP-DP-DR-004`, авторизовано `OWNER_LPR` 2026-08-06; closure evidence для `EPDP-OI-011`; независимый контроль специфицирован отдельно `EP-DP-DR-012` |
| `INDEPENDENT.CONTROL` | Решение `EP-DP-DR-012`, авторизовано `OWNER_LPR` 2026-08-07; closure evidence для `EPDP-OI-012`; метод выбирается по характеристикам действия из `TIME_SEPARATED_SELF_RECHECK / ISOLATED_LLM_REVIEW / EXTERNAL_SPECIALIST_REVIEW`; фактическое применение проверяется в Internal QA/runtime |
| `OWNER.RESOURCE.AND.WIP` | Решение `EP-DP-DR-005`, авторизовано `OWNER_LPR` 2026-08-06; closure evidence для `EPDP-OI-022`; фактические часы/WIP остаются `NOT_MEASURED`; финансовый резерв определён отдельно `EP-DP-DR-014–015` |
| `E2.MIN.PRICE` | Решение `EP-DP-DR-013`, авторизовано `OWNER_LPR` 2026-08-07; baseline расчёт 2026-07-16; minimum customer price after Ozon discounts `2900 RUB`, practical `2990 RUB`, нарушение `→ MIN_PRICE_RULE_FAILED → REPAIR`; closure evidence для `EPDP-OI-007` |
| `E4.ALLOCATION.AND.RESERVE` | Решения `EP-DP-DR-014–015`, авторизованы `OWNER_LPR` 2026-08-07; reserve = `10%` confirmed sales revenue after returns; порядок `obligations → reserve → critical repair/compliance → next batch → growth`; closure evidence для `EPDP-OI-008` |
| `E1.BATCH.LAUNCH.GATE` | Решение `EP-DP-DR-016`, авторизовано `OWNER_LPR` 2026-08-07; запуск партии при полном покрытии known batch cost cash после E4 и/или confirmed investment capital; stockout risk открывает financing route, но не отменяет HOLD до подтверждения средств; closure evidence для `EPDP-OI-006` |
| `I3.CONSUMABLES` | Решение `EP-DP-DR-017`, авторизовано `OWNER_LPR` 2026-08-07; minimum = planned next-batch need + 10%, check after I2, final physical-stock gate before L(R)4; closure evidence для `EPDP-OI-013` |
| `I5.SUPPLIER.TO.CARRIER.HANDOFF` | Решение `EP-DP-DR-018`, авторизовано `OWNER_LPR` 2026-08-07; поставщик самостоятельно доставляет посылку международному перевозчику; `OWNER_LPR` получает supplier tracking number + parcel photo; pickup request отсутствует; closure evidence для `EPDP-OI-014` |
| `LR1.RECOUNT.AND.DEVIATION` | Решение `EP-DP-DR-020`, авторизовано `OWNER_LPR` 2026-08-07; полный пересчёт, tolerance N/A, incident + supplier discussion при расхождении, damaged packaging → open and inspect garment; closure evidence для `EPDP-OI-016` |
| `LR2.MARKING.ACCEPTANCE` | Решение `EP-DP-DR-021`, авторизовано `OWNER_LPR` 2026-08-07; acceptance = статус товарной единицы `«в обороте»` в системе «Честный Знак»; иной/неподтверждённый статус → `HOLD`; closure evidence для `EPDP-OI-017` |
| `PROJECT.EXIT.AND.HANDOFF` | Решение `EP-DP-DR-044`, авторизовано `OWNER_LPR` 2026-08-07; `CLOSED` для принятого разового terminal result; `TRANSFERRED_TO_REGULAR_PROCESS` только после формализации repeatable result как `oper / rule / source_of_truth`, проверки handoff и acceptance; closure evidence для `EPDP-OI-021` |
| `OPER.EVIDENCE.REFS` | Решение `EP-DP-DR-048`, авторизовано `OWNER_LPR` 2026-08-07; каждый oper использует stable reference на конкретное GitHub/external evidence либо сохранённое OWNER_LPR confirmation при отсутствии документального evidence; contributes to `EPDP-OI-028` |
| `OPER.TRANSITION.REFS` | Решение `EP-DP-DR-049`, авторизовано `OWNER_LPR` 2026-08-07; всем 32 opers назначен `transition_ref = EP-TR-{OPER_ID}`, связывающий `S0 → S1`; runtime guards остаются oper-specific; contributes to `EPDP-OI-028` |
| `OPER.MEMORY.WRITE.REFS` | Решение `EP-DP-DR-050`, авторизовано `OWNER_LPR` 2026-08-07; persisted state change → stable entity/event ref в `valerol/ep_dashboard@main:data/ep-domain/`, иначе `N/A`; instance refs создаются при исполнении; contributes to `EPDP-OI-028` |
| `OPER.MICRO.CLOSURE` | Решение `EP-DP-DR-052`, авторизовано `OWNER_LPR` 2026-08-07; `S1` + accepted evidence + required memory write + no blocking deviation; contributes to `EPDP-OI-028` |
| `OPER.RESIDUE` | Решение `EP-DP-DR-053`, авторизовано `OWNER_LPR` 2026-08-07; residue = `[]` либо explicit linked blocking/non-blocking follow-up; blocking residue запрещает micro-closure; contributes to `EPDP-OI-028` |
| `OPER.VALUE_OR_RISK_GATE + COMPLETENESS` | Решение `EP-DP-DR-054`, авторизовано `OWNER_LPR` 2026-08-07; oper-specific gate mapping + `N/A` when not applicable; object-level audit всех 32 opers: `INCOMPLETE=0`, `REFERENCE_UNRESOLVED=0`; closure evidence для `EPDP-OI-028` |
| `OBSERVATION.CYCLE.IDENTITY` | Решение `EP-DP-DR-006`, авторизовано `OWNER_LPR` 2026-08-06; closure evidence для `EPDP-OI-023`; closure/reopen вынесены в `EP-DP-DR-007`, recording SLA — в `EP-DP-DR-008`; physical source of truth, change governance и QA остаются `OPEN` |
| `OBSERVATION.CLOSURE.AND.REOPEN` | Решение `EP-DP-DR-007`, авторизовано `OWNER_LPR` 2026-08-06; closure evidence для `EPDP-OI-025`; recording SLA определён отдельно в `EP-DP-DR-008`; physical register, general change schema, project exit и QA остаются `OPEN` |
| `OBSERVATION.RECORDING.SLA` | Решение `EP-DP-DR-008`, авторизовано `OWNER_LPR` 2026-08-06; closure evidence для design scope `EPDP-OI-026`; PT4H critical, PT24H ordinary и PT24H closure/reopen after decision; physical paths определены `EP-DP-DR-009`; writer/runtime behavior и measured compliance проверяются в `EPDP-OI-032` |
| `DOMAIN.BOUNDARY`, `SYSTEM.STATE`, роли | EP-OSU §§ 1.1–1.5, 4 |
| `VALUE.REGISTER` | Дополнение пользователя от 2026-08-06; операционализация `INFERRED / CANDIDATE` |
| `REGULAR.PHYSIOLOGY`, 24 opers, overlaps, closure | EP-OPERS §§ I, L(I), L(R), S, E; «Частичные пересечения»; «Контроль замыкания цикла» |
| `OBSERVATION.PHYSIOLOGY`, `O1–O5` | Дополнение пользователя от 2026-08-06; BOIS-формализация `INFERRED / CANDIDATE`; нормы EP-OSU-02, 09, 11, 12 |
| `DOMAIN.FLOWS` | Синтез EP-OPERS с EP-OSU-04, 08, 09, 12, 13 |
| `INTERFACE.REGISTER` | Синтез полей oper с EP-OSU-01, 04, 10 |
| `STATE.MACHINE` | EP-OPERS § 0 + EP-OSU § 0 и EP-OSU-08 |
| `PROJECT.PHYSIOLOGY` | Разовые проекты EP-OPERS + EP-OSU § 1.6 и нормы `EP-OSU-06–07` |
| `HOMEOSTASIS.GATES` | `E1–E4` + EP-OSU-07 + `OUTPUT.GATE` |
| `NORM.TO.PHYSIOLOGY` | EP-OSU-01–13 |
| `DEFECT.PHYSIOLOGY` | EP-OSU `R-01–R-15` |
| `OPENITEM.REGISTER` | Исходные пункты §15 baseline v0.1, oper residues, canonical/lifecycle/test gaps и решение о локальной нормализации; IDs и blocker classes являются derived EP-DP data |

---

`EP-DP v0.2` — объект физиологии в состоянии `INTERNAL_QA`, производный от immutable baseline `v0.1`. Авторитетный `RESOLUTION_STATE_INDEX` фиксирует `30 RESOLVED / 4 OPEN`; lifecycle физиологии = `INTERNAL_QA`, lifecycle opers = `CANDIDATE`. Runtime QA `EP-DP-QA-OI-032-20260807` подтверждает Observation writer, `O1–O5`, SLA и control review. Артефакт не подтверждает prospective real-batch pilot, свойства товара сверх имеющегося evidence или release без отдельной авторизации.
