import { useState } from "react";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle } from "../shared";

const INIT_KANBAN = {
  todo: [{ id: 1, title: "Design login page", tag: "enhancement" }, { id: 2, title: "Write API docs", tag: "docs" }, { id: 3, title: "Fix mobile layout", tag: "bug" }],
  inprog: [{ id: 4, title: "Build auth system", tag: "enhancement" }],
  review: [{ id: 5, title: "Add rate limiting", tag: "bug" }],
  done: [{ id: 6, title: "Setup CI pipeline", tag: "enhancement" }, { id: 7, title: "Write unit tests", tag: "docs" }],
};
const KCOLS = { todo: { label: "To Do", color: "#64748b" }, inprog: { label: "In Progress", color: "#fbbf24" }, review: { label: "In Review", color: "#60a5fa" }, done: { label: "Done", color: "#4ade80" } };

function ProjectsSimulator({ isMobile }) {
  const [cols, setCols] = useState(INIT_KANBAN);
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const tcolor = (t) => ({ bug: "#f87171", enhancement: "#60a5fa", docs: "#a78bfa" })[t] || T.muted;

  const drop = (colId) => {
    if (!drag || drag.col === colId) { setDrag(null); setOver(null); return; }
    setCols((p) => ({ ...p, [drag.col]: p[drag.col].filter((c) => c.id !== drag.card.id), [colId]: [...p[colId], drag.card] }));
    setDrag(null);
    setOver(null);
  };

  return (
    <div>
      <InfoBox icon="📋" title="GitHub Projects — your team Kanban board" color={T.blue}>
        GitHub Projects v2 is a spreadsheet and Kanban board built into GitHub. Every issue and PR
        can be a card. Cards move through columns as work progresses. When you close an issue the
        card auto-moves. Drag cards between columns below to try it.
      </InfoBox>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4,1fr)", gap: 10, overflowX: isMobile ? "auto" : "visible" }}>
        {Object.entries(cols).map(([colId, cards]) => {
          const meta = KCOLS[colId];
          const isOver = over === colId;
          return (
            <div key={colId} onDragOver={(e) => { e.preventDefault(); setOver(colId); }} onDrop={() => drop(colId)} onDragLeave={() => setOver(null)} style={{ background: isOver ? "rgba(74,222,128,.05)" : T.card, border: "1px solid " + (isOver ? "rgba(74,222,128,.3)" : T.border), borderRadius: 10, padding: 10, minHeight: 180 }}>
              <div style={{ color: meta.color, fontSize: 11, fontWeight: 700, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
                <span>{meta.label}</span>
                <span style={{ background: meta.color + "20", borderRadius: 10, padding: "1px 7px", fontSize: 10 }}>{cards.length}</span>
              </div>
              {cards.map((card) => {
                const isDrag = drag && drag.card.id === card.id;
                return (
                  <div key={card.id} draggable onDragStart={() => setDrag({ card, col: colId })} onDragEnd={() => { setDrag(null); setOver(null); }} style={{ background: "rgba(6,11,24,.6)", border: "1px solid " + (isDrag ? "rgba(74,222,128,.3)" : T.border), borderRadius: 7, padding: "9px 10px", marginBottom: 7, cursor: "grab", opacity: isDrag ? 0.5 : 1 }}>
                    <div style={{ color: T.text, fontSize: 11, marginBottom: 5 }}>{card.title}</div>
                    <span style={{ background: tcolor(card.tag) + "18", border: "1px solid " + tcolor(card.tag) + "40", borderRadius: 8, fontSize: 9, color: tcolor(card.tag), padding: "1px 6px" }}>{card.tag}</span>
                  </div>
                );
              })}
              {isOver && drag && <div style={{ border: "2px dashed rgba(74,222,128,.3)", borderRadius: 7, padding: 16, textAlign: "center", color: "rgba(74,222,128,.5)", fontSize: 11 }}>Drop here</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProjectsModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="📋" title="What is GitHub Projects?" color={T.blue}>
        GitHub Projects is a{" "}
        <strong style={{ color: T.blue }}>Kanban-style project management board</strong> built
        directly into GitHub. Think of it like Trello or Jira — but every card is a real GitHub
        Issue or Pull Request, so your board stays in sync with your actual code activity
        automatically.
        <br /><br />
        You organise work into columns:{" "}
        <strong style={{ color: T.amber }}>To Do → In Progress → In Review → Done</strong>.
        When a developer opens a PR linked to an issue, the card moves. When it merges, it moves
        again. No manual updates needed.
      </InfoBox>
      <InfoBox icon="🏗️" title="When should a team use it?" color={T.green}>
        Any time more than one person is working on a project. Without a board, it's hard to see
        at a glance: what's being worked on, what's blocked, what's waiting for review, and what's
        done this week. Projects makes that visible in seconds.
      </InfoBox>
      <SectionTitle>GitHub Projects — Kanban Board</SectionTitle>
      <ProjectsSimulator isMobile={isMobile} />
    </div>
  );
}
