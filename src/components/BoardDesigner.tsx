import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, horizontalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { BoardConfig, Column, SwimLane, KanbanCard } from '../types';

interface Props {
  board: BoardConfig;
  onChange: (patch: Partial<BoardConfig>) => void;
  onBack: () => void;
}

const CARD_SIZES = ['S', 'M', 'L'] as const;

export default function BoardDesigner({ board, onChange, onBack }: Props) {
  const { t } = useTranslation();
  const [addingCard, setAddingCard] = useState<{ colId: string; laneId: string | null } | null>(null);
  const [cardTitle, setCardTitle] = useState('');
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleColumnDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = board.columns.findIndex(c => c.id === active.id);
    const newIdx = board.columns.findIndex(c => c.id === over.id);
    onChange({ columns: arrayMove(board.columns, oldIdx, newIdx) });
  }

  function addColumn() {
    const col: Column = {
      id: crypto.randomUUID(),
      name: 'New Column',
      wipLimit: null,
      color: '#e2e8f0',
    };
    onChange({ columns: [...board.columns, col] });
  }

  function updateColumn(id: string, patch: Partial<Column>) {
    onChange({ columns: board.columns.map(c => c.id === id ? { ...c, ...patch } : c) });
  }

  function removeColumn(id: string) {
    onChange({
      columns: board.columns.filter(c => c.id !== id),
      cards: board.cards.filter(c => c.columnId !== id),
    });
  }

  function addLane() {
    const colors = ['#fef3c7', '#ede9fe', '#fce7f3', '#d1fae5'];
    const lane: SwimLane = {
      id: crypto.randomUUID(),
      name: 'New Lane',
      color: colors[board.lanes.length % colors.length],
    };
    onChange({ lanes: [...board.lanes, lane] });
  }

  function removeLane(id: string) {
    onChange({
      lanes: board.lanes.filter(l => l.id !== id),
      cards: board.cards.map(c => c.laneId === id ? { ...c, laneId: null } : c),
    });
  }

  function addCard(colId: string, laneId: string | null) {
    if (!cardTitle.trim()) return;
    const card: KanbanCard = {
      id: crypto.randomUUID(),
      title: cardTitle.trim(),
      columnId: colId,
      laneId,
      size: 'M',
    };
    onChange({ cards: [...board.cards, card] });
    setCardTitle('');
    setAddingCard(null);
  }

  function removeCard(id: string) {
    onChange({ cards: board.cards.filter(c => c.id !== id) });
  }

  function moveCard(cardId: string, colId: string) {
    onChange({ cards: board.cards.map(c => c.id === cardId ? { ...c, columnId: colId } : c) });
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(board, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${board.name.toLowerCase().replace(/\s+/g, '-')}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  function save() {
    onChange({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const laneRows = board.lanes.length > 0 ? board.lanes : [null];

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-3 flex-wrap shadow-sm">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 text-sm">← {t('common.cancel')}</button>
        <input
          type="text"
          value={board.name}
          onChange={e => onChange({ name: e.target.value })}
          className="font-semibold text-slate-800 border-0 focus:outline-none text-sm bg-transparent"
        />
        <div className="flex-1" />
        <button onClick={addLane} className="text-sm border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors text-slate-600">
          + {t('board.addLane')}
        </button>
        <button onClick={addColumn} className="text-sm bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">
          + {t('board.addColumn')}
        </button>
        <button onClick={exportJSON} className="text-sm border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600 transition-colors">
          {t('board.exportJSON')}
        </button>
        <button onClick={save} className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-700 transition-colors font-medium">
          {saved ? '✓ Saved' : t('board.save')}
        </button>
      </div>

      {/* Swim lane labels + board */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex gap-0">
          {/* Lane labels column */}
          {board.lanes.length > 0 && (
            <div className="flex flex-col shrink-0 w-24 mr-2">
              <div className="h-16 shrink-0" /> {/* header spacer */}
              {board.lanes.map(lane => (
                <div
                  key={lane.id}
                  className="flex items-center justify-center text-xs font-semibold text-slate-600 rounded-l-lg border border-r-0 border-slate-200 mb-2"
                  style={{ backgroundColor: lane.color, minHeight: '120px' }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="rotate-[-90deg] whitespace-nowrap">{lane.name}</span>
                    <button onClick={() => removeLane(lane.id)} className="text-slate-400 hover:text-red-400 text-xs">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Columns */}
          <div className="flex-1 min-w-0">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleColumnDragEnd}>
              <SortableContext items={board.columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
                <div className="flex gap-3 min-w-max">
                  {board.columns.map(col => {
                    const colCards = board.cards.filter(c => c.columnId === col.id);
                    const wipOver = col.wipLimit !== null && colCards.length > col.wipLimit;

                    return (
                      <SortableColumn key={col.id} id={col.id}>
                        <div className="w-52 shrink-0 flex flex-col">
                          {/* Column header */}
                          <div
                            className={`rounded-t-xl px-3 py-2 border-b-2 ${wipOver ? 'border-red-400' : 'border-transparent'}`}
                            style={{ backgroundColor: col.color }}
                          >
                            <input
                              type="text"
                              value={col.name}
                              onChange={e => updateColumn(col.id, { name: e.target.value })}
                              className="font-semibold text-slate-800 text-sm w-full bg-transparent border-0 focus:outline-none"
                            />
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="number"
                                value={col.wipLimit ?? ''}
                                placeholder={t('board.noLimit')}
                                min={1}
                                onChange={e => updateColumn(col.id, { wipLimit: e.target.value ? Number(e.target.value) : null })}
                                className="w-16 text-xs border border-slate-300 rounded px-1.5 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-400"
                              />
                              <span className="text-xs text-slate-500">WIP</span>
                              {wipOver && <span className="text-xs text-red-500 font-semibold">{t('board.wipViolation')}</span>}
                              <button onClick={() => removeColumn(col.id)} className="ml-auto text-slate-300 hover:text-red-400 text-base leading-none">×</button>
                            </div>
                          </div>

                          {/* Lane rows */}
                          {laneRows.map(lane => {
                            const laneCards = colCards.filter(c =>
                              lane === null ? c.laneId === null : c.laneId === lane.id
                            );
                            const isAdding = addingCard?.colId === col.id && addingCard?.laneId === (lane?.id ?? null);

                            return (
                              <div
                                key={lane?.id ?? 'default'}
                                className="flex-1 bg-white border border-slate-200 p-2 space-y-1.5 min-h-[120px]"
                                style={lane ? { backgroundColor: `${lane.color}30` } : {}}
                              >
                                {laneCards.map(card => (
                                  <CardTile
                                    key={card.id}
                                    card={card}
                                    columns={board.columns.filter(c => c.id !== col.id)}
                                    onMove={moveCard}
                                    onDelete={removeCard}
                                  />
                                ))}
                                {isAdding ? (
                                  <div className="space-y-1">
                                    <input
                                      type="text" autoFocus
                                      value={cardTitle}
                                      placeholder={t('board.cardTitle')}
                                      onChange={e => setCardTitle(e.target.value)}
                                      onKeyDown={e => { if (e.key === 'Enter') addCard(col.id, lane?.id ?? null); if (e.key === 'Escape') setAddingCard(null); }}
                                      className="w-full text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-400"
                                    />
                                    <div className="flex gap-1">
                                      <button onClick={() => addCard(col.id, lane?.id ?? null)} className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded">{t('common.save')}</button>
                                      <button onClick={() => setAddingCard(null)} className="text-xs text-slate-400 px-2 py-0.5">✕</button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setAddingCard({ colId: col.id, laneId: lane?.id ?? null })}
                                    className="w-full text-left text-xs text-slate-400 hover:text-slate-600 py-1 px-1 rounded hover:bg-slate-50 transition-colors"
                                  >
                                    + {t('board.addCard')}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </SortableColumn>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

function CardTile({ card, columns, onMove, onDelete }: {
  card: KanbanCard; columns: Column[];
  onMove: (id: string, colId: string) => void;
  onDelete: (id: string) => void;
}) {
  const SIZE_COLORS = { S: 'bg-green-100 text-green-700', M: 'bg-blue-100 text-blue-700', L: 'bg-orange-100 text-orange-700' };
  return (
    <div className="bg-white rounded border border-slate-200 px-2 py-1.5 shadow-sm group">
      <div className="flex items-start gap-1">
        <span className="text-xs flex-1 text-slate-700">{card.title}</span>
        <button onClick={() => onDelete(card.id)} className="text-slate-200 group-hover:text-red-300 text-sm leading-none">×</button>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <span className={`text-xs px-1 rounded ${SIZE_COLORS[card.size]}`}>{card.size}</span>
        {columns.length > 0 && (
          <select
            value=""
            onChange={e => e.target.value && onMove(card.id, e.target.value)}
            className="text-xs border-0 bg-transparent text-slate-400 cursor-pointer focus:outline-none"
          >
            <option value="" disabled>→</option>
            {columns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}
